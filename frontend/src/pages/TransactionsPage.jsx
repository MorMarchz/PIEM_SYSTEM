import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  TextField,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Tooltip,
  CircularProgress,
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  InputAdornment,
  Switch,
  FormControlLabel,
  ToggleButtonGroup,
  ToggleButton,
  Alert,
} from '@mui/material';
import AddIcon from '@mui/icons-material/AddRounded';
import SearchIcon from '@mui/icons-material/SearchRounded';
import SyncAltIcon from '@mui/icons-material/SyncAltRounded';
import DownloadIcon from '@mui/icons-material/DownloadRounded';
import CloseIcon from '@mui/icons-material/CloseRounded';
import EditIcon from '@mui/icons-material/EditRounded';
import DeleteIcon from '@mui/icons-material/DeleteRounded';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownwardRounded';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpwardRounded';
import InsightsIcon from '@mui/icons-material/InsightsRounded';
import AutorenewIcon from '@mui/icons-material/AutorenewRounded';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLongRounded';
import EventRepeatIcon from '@mui/icons-material/EventRepeatRounded';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutlineRounded';
import api from '../services/api';
import CategoryIcon from '../components/common/CategoryIcon';
import {
  cleanNumericInput,
  formatAmountWithCommas,
  parseAmountToNumber,
  formatCurrency,
} from '../utils/numberFormat';

const TransactionsPage = () => {
  const navigate = useNavigate();

  // Active View Tab: 'history' (ประวัติรายการ) | 'recurring' (รายการอัตโนมัติประจำเดือน)
  const [activeTab, setActiveTab] = useState('history');

  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({ current_page: 1, total_pages: 1, total_items: 0, limit: 10 });
  const [loading, setLoading] = useState(true);

  // Recurring state
  const [recurringList, setRecurringList] = useState([]);
  const [loadingRecurring, setLoadingRecurring] = useState(false);

  // Filter States
  const [search, setSearch] = useState('');
  const [type, setType] = useState('all');
  const [categoryId, setCategoryId] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [page, setPage] = useState(1);

  // Modal States for Add / Edit Transaction
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editTx, setEditTx] = useState(null);
  const [formType, setFormType] = useState('expense');
  const [formTitle, setFormTitle] = useState('');
  const [formAmount, setFormAmount] = useState('');
  const [formCategoryId, setFormCategoryId] = useState('');
  const [formDate, setFormDate] = useState(new Date().toISOString().split('T')[0]);
  const [formNote, setFormNote] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringDay, setRecurringDay] = useState(new Date().getDate());
  const [submittingForm, setSubmittingForm] = useState(false);
  const [formError, setFormError] = useState('');

  // Delete Dialog State
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Delete Recurring Rule State
  const [deleteRecurringTarget, setDeleteRecurringTarget] = useState(null);

  // Fetch Master Categories for Filter & Form
  const fetchCategories = useCallback(async () => {
    try {
      const response = await api.get('/categories');
      if (response.data?.success) {
        setCategories(Array.isArray(response.data.data) ? response.data.data : []);
      }
    } catch (err) {
      console.error('[TransactionsPage]: Failed to fetch categories:', err);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Fetch Transactions List
  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    try {
      let queryParams = new URLSearchParams();
      queryParams.append('page', page);
      queryParams.append('limit', 10);

      if (search.trim()) queryParams.append('search', search.trim());
      if (type && type !== 'all') queryParams.append('type', type);
      if (categoryId && categoryId !== 'all') queryParams.append('category_id', categoryId);
      if (startDate) queryParams.append('start_date', startDate);
      if (endDate) queryParams.append('end_date', endDate);

      const response = await api.get(`/transactions?${queryParams.toString()}`);
      if (response.data?.success) {
        setTransactions(response.data.data.transactions || []);
        setPagination(response.data.data.pagination || { current_page: 1, total_pages: 1, total_items: 0 });
      }
    } catch (err) {
      console.error('[TransactionsPage]: Failed to fetch transactions:', err);
    } finally {
      setLoading(false);
    }
  }, [page, search, type, categoryId, startDate, endDate]);

  // Fetch Recurring Rules
  const fetchRecurringRules = useCallback(async () => {
    setLoadingRecurring(true);
    try {
      const response = await api.get('/recurring');
      if (response.data?.success) {
        setRecurringList(Array.isArray(response.data.data) ? response.data.data : []);
      }
    } catch (err) {
      console.error('[TransactionsPage]: Failed to fetch recurring rules:', err);
    } finally {
      setLoadingRecurring(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'history') {
      fetchTransactions();
    } else {
      fetchRecurringRules();
    }
  }, [activeTab, fetchTransactions, fetchRecurringRules]);

  const handleResetFilters = () => {
    setSearch('');
    setType('all');
    setCategoryId('all');
    setStartDate('');
    setEndDate('');
    setPage(1);
  };

  // Open Add Dialog
  const handleOpenAdd = () => {
    setEditTx(null);
    setFormType('expense');
    setFormTitle('');
    setFormAmount('');
    setFormCategoryId('');
    setFormDate(new Date().toISOString().split('T')[0]);
    setFormNote('');
    setIsRecurring(false);
    setRecurringDay(new Date().getDate());
    setFormError('');
    setDialogOpen(true);
  };

  // Open Edit Dialog
  const handleOpenEdit = (tx) => {
    setEditTx(tx);
    setFormType(tx.type || 'expense');
    setFormTitle(tx.title || '');
    setFormAmount(tx.amount ? formatAmountWithCommas(tx.amount) : '');
    setFormCategoryId(tx.category?.id ? String(tx.category.id) : '');
    setFormDate(tx.date ? new Date(tx.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]);
    setFormNote(tx.note || '');
    setIsRecurring(false);
    setFormError('');
    setDialogOpen(true);
  };

  const handleSaveTransaction = async (e) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      setFormError('กรุณาระบุชื่อรายการ');
      return;
    }

    const num = parseAmountToNumber(formAmount);
    if (isNaN(num) || num <= 0) {
      setFormError('กรุณาระบุจำนวนเงินที่ถูกต้องและมากกว่า 0');
      return;
    }

    setSubmittingForm(true);
    setFormError('');
    try {
      const payload = {
        title: formTitle.trim(),
        amount: num,
        type: formType,
        category_id: formCategoryId ? parseInt(formCategoryId, 10) : null,
        date: formDate,
        note: formNote.trim() || null,
      };

      if (editTx) {
        await api.put(`/transactions/${editTx.id}`, payload);
      } else {
        await api.post('/transactions', payload);

        // If user enabled auto-recurring on creation, also register the recurring rule
        if (isRecurring) {
          await api.post('/recurring', {
            title: formTitle.trim(),
            amount: num,
            type: formType,
            category_id: formCategoryId ? parseInt(formCategoryId, 10) : null,
            day_of_month: recurringDay,
            note: formNote.trim() || null,
          });
        }
      }

      setDialogOpen(false);
      fetchTransactions();
      if (activeTab === 'recurring') fetchRecurringRules();
      window.dispatchEvent(new CustomEvent('transactionUpdated'));
    } catch (err) {
      console.error('[TransactionsPage]: Save failed:', err);
      setFormError(err.response?.data?.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    } finally {
      setSubmittingForm(false);
    }
  };

  // Confirm Delete Handler
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.delete(`/transactions/${deleteTarget.id}`);
      setDeleteTarget(null);
      fetchTransactions();
      window.dispatchEvent(new CustomEvent('transactionUpdated'));
    } catch (err) {
      console.error('[TransactionsPage]: Delete failed:', err);
    } finally {
      setDeleting(false);
    }
  };

  // Toggle Recurring Rule Active State
  const handleToggleRecurringActive = async (rule) => {
    try {
      await api.patch(`/recurring/${rule.id}`, { is_active: !rule.is_active });
      fetchRecurringRules();
      fetchTransactions();
      window.dispatchEvent(new CustomEvent('transactionUpdated'));
    } catch (err) {
      console.error('[TransactionsPage]: Toggle recurring error:', err);
    }
  };

  // Delete Recurring Rule Handler
  const handleDeleteRecurringConfirm = async () => {
    if (!deleteRecurringTarget) return;
    try {
      await api.delete(`/recurring/${deleteRecurringTarget.id}`);
      setDeleteRecurringTarget(null);
      fetchRecurringRules();
      window.dispatchEvent(new CustomEvent('transactionUpdated'));
    } catch (err) {
      console.error('[TransactionsPage]: Delete recurring error:', err);
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    if (transactions.length === 0) return;
    const headers = ['ID', 'วันที่', 'ชื่อรายการ', 'ประเภท', 'หมวดหมู่', 'จำนวนเงิน', 'หมายเหตุ'];
    const rows = transactions.map((t) => [
      t.id,
      t.date,
      `"${t.title.replace(/"/g, '""')}"`,
      t.type === 'income' ? 'รายรับ' : 'รายจ่าย',
      `"${(t.category?.name || '-').replace(/"/g, '""')}"`,
      t.amount,
      `"${(t.note || '').replace(/"/g, '""')}"`,
    ]);
    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `transactions_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // KPI Calculations from current list
  const currentInflow = transactions
    .filter((t) => t.type === 'income')
    .reduce((acc, curr) => acc + (parseFloat(curr.amount) || 0), 0);
  const currentOutflow = transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, curr) => acc + (parseFloat(curr.amount) || 0), 0);
  const currentNet = currentInflow - currentOutflow;

  return (
    <Box sx={{ pb: { xs: 4, md: 6 } }}>
      {/* Top Header Strip */}
      <Box sx={{ pt: 1, pb: 2.5, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="caption" sx={{ color: '#10B981', fontWeight: 700, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Financial Ledger & Auto Schedule
            </Typography>
            <Box sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: '#475569' }} />
            <Typography variant="caption" className="tabular-nums" sx={{ color: '#64748B', fontSize: '0.72rem' }}>
              Real-time Sync
            </Typography>
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#F1F5F9', fontSize: { xs: '1.25rem', sm: '1.45rem' }, letterSpacing: '-0.02em' }}>
            รายการทางการเงิน
          </Typography>
          <Typography variant="body2" sx={{ color: '#94A3B8', fontSize: { xs: '0.78rem', sm: '0.85rem' } }}>
            ประวัติธุรกรรมรายรับ-รายจ่าย และการจัดการรายการอัตโนมัติประจำเดือน
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: { xs: '100%', sm: 'auto' } }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleOpenAdd}
            startIcon={<AddIcon sx={{ fontSize: 18 }} />}
            sx={{
              height: 36,
              fontSize: '0.825rem',
              fontWeight: 600,
              width: { xs: '100%', sm: 'auto' },
            }}
          >
            บันทึกรายการใหม่
          </Button>
        </Box>
      </Box>

      {/* Main View Tab Switcher (History vs Recurring) */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2.5 }}>
        <ToggleButtonGroup
          value={activeTab}
          exclusive
          onChange={(e, newTab) => {
            if (newTab) setActiveTab(newTab);
          }}
          size="small"
          sx={{
            bgcolor: '#0A0E16',
            p: 0.5,
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            '& .MuiToggleButton-root': {
              px: 2,
              py: 0.6,
              fontSize: '0.825rem',
              fontWeight: 600,
              textTransform: 'none',
              borderRadius: '8px',
              color: '#94A3B8',
              border: 'none',
              gap: 0.75,
              '&.Mui-selected': {
                bgcolor: '#6366F1',
                color: '#FFFFFF',
                '&:hover': { bgcolor: '#4F46E5' },
              },
            },
          }}
        >
          <ToggleButton value="history">
            <ReceiptLongIcon sx={{ fontSize: 18 }} />
            ประวัติรายการ
          </ToggleButton>
          <ToggleButton value="recurring">
            <EventRepeatIcon sx={{ fontSize: 18 }} />
            รายการอัตโนมัติประจำเดือน
            {recurringList.length > 0 && (
              <Box sx={{ px: 0.8, py: 0.1, borderRadius: '9999px', bgcolor: 'rgba(255, 255, 255, 0.2)', fontSize: '0.65rem', fontWeight: 700 }}>
                {recurringList.length}
              </Box>
            )}
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* VIEW A: HISTORY VIEW */}
      {activeTab === 'history' && (
        <>
          {/* Quick Ledger Metric Highlights */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={4}>
              <Paper elevation={0} sx={{ p: 2, bgcolor: '#131C2E', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.06)', display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box sx={{ width: 36, height: 36, borderRadius: '8px', bgcolor: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10B981' }}>
                  <ArrowUpwardIcon sx={{ fontSize: 18 }} />
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: '#64748B', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    รายรับที่แสดง (Inflow)
                  </Typography>
                  <Typography variant="subtitle1" className="tabular-nums" sx={{ fontWeight: 700, color: '#10B981', fontSize: '1.05rem', lineHeight: 1.2 }}>
                    +฿{currentInflow.toLocaleString('th-TH', { minimumFractionDigits: 2 })}
                  </Typography>
                </Box>
              </Paper>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Paper elevation={0} sx={{ p: 2, bgcolor: '#131C2E', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.06)', display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box sx={{ width: 36, height: 36, borderRadius: '8px', bgcolor: 'rgba(244, 63, 94, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F43F5E' }}>
                  <ArrowDownwardIcon sx={{ fontSize: 18 }} />
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: '#64748B', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    รายจ่ายที่แสดง (Outflow)
                  </Typography>
                  <Typography variant="subtitle1" className="tabular-nums" sx={{ fontWeight: 700, color: '#F43F5E', fontSize: '1.05rem', lineHeight: 1.2 }}>
                    -฿{currentOutflow.toLocaleString('th-TH', { minimumFractionDigits: 2 })}
                  </Typography>
                </Box>
              </Paper>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Paper elevation={0} sx={{ p: 2, bgcolor: '#131C2E', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.06)', display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box sx={{ width: 36, height: 36, borderRadius: '8px', bgcolor: 'rgba(99, 102, 241, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#818CF8' }}>
                  <InsightsIcon sx={{ fontSize: 18 }} />
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: '#64748B', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    ยอดสุทธิ (Net Delta)
                  </Typography>
                  <Typography variant="subtitle1" className="tabular-nums" sx={{ fontWeight: 700, color: currentNet >= 0 ? '#10B981' : '#F43F5E', fontSize: '1.05rem', lineHeight: 1.2 }}>
                    {currentNet >= 0 ? '+' : ''}฿{currentNet.toLocaleString('th-TH', { minimumFractionDigits: 2 })}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>

          {/* Filter Controls Section */}
          <Paper elevation={0} sx={{ p: 2.5, mb: 3, bgcolor: '#131C2E', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.07)' }}>
            <Grid container spacing={1.5} alignItems="center">
              {/* Search input */}
              <Grid item xs={12} sm={4} md={3.5}>
                <TextField
                  placeholder="ค้นหาชื่อรายการหรือหมายเหตุ..."
                  size="small"
                  fullWidth
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: '#64748B', fontSize: 20 }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              {/* Type Dropdown */}
              <Grid item xs={6} sm={4} md={2}>
                <TextField
                  select
                  size="small"
                  fullWidth
                  value={type}
                  onChange={(e) => { setType(e.target.value); setPage(1); }}
                >
                  <MenuItem value="all">ประเภท: ทั้งหมด</MenuItem>
                  <MenuItem value="income">รายรับ (Income)</MenuItem>
                  <MenuItem value="expense">รายจ่าย (Expense)</MenuItem>
                </TextField>
              </Grid>

              {/* Category Dropdown */}
              <Grid item xs={6} sm={4} md={2.5}>
                <TextField
                  select
                  size="small"
                  fullWidth
                  value={categoryId}
                  onChange={(e) => { setCategoryId(e.target.value); setPage(1); }}
                >
                  <MenuItem value="all">หมวดหมู่: ทั้งหมด</MenuItem>
                  {categories.map((cat) => (
                    <MenuItem key={cat.id} value={String(cat.id)}>
                      <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1 }}>
                        <CategoryIcon icon={cat.icon} name={cat.name} size="1.1rem" />
                        <span>{cat.name}</span>
                      </Box>
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              {/* Date Range Start */}
              <Grid item xs={6} sm={2} md={2}>
                <TextField
                  type="date"
                  size="small"
                  fullWidth
                  label="ตั้งแต่วันที่"
                  value={startDate}
                  onChange={(e) => { setStartDate(e.target.value); setPage(1); }}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              {/* Date Range End */}
              <Grid item xs={6} sm={2} md={2}>
                <TextField
                  type="date"
                  size="small"
                  fullWidth
                  label="ถึงวันที่"
                  value={endDate}
                  onChange={(e) => { setEndDate(e.target.value); setPage(1); }}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              {/* Action Buttons */}
              <Grid item xs={12} sx={{ display: 'flex', justifyContent: { xs: 'space-between', sm: 'flex-end' }, alignItems: 'center', gap: 1, pt: 0.5 }}>
                <Button
                  size="small"
                  onClick={handleResetFilters}
                  startIcon={<CloseIcon sx={{ fontSize: 16 }} />}
                  sx={{ color: '#94A3B8', fontSize: '0.78rem', '&:hover': { color: '#F43F5E' } }}
                >
                  ล้างตัวกรอง
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={handleExportCSV}
                  startIcon={<DownloadIcon sx={{ fontSize: 16 }} />}
                  sx={{
                    fontSize: '0.78rem',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    color: '#F1F5F9',
                    bgcolor: 'rgba(255, 255, 255, 0.03)',
                  }}
                >
                  ส่งออก CSV
                </Button>
              </Grid>
            </Grid>
          </Paper>

          {/* Financial Ledger Table */}
          <Paper elevation={0} sx={{ borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.07)', bgcolor: '#131C2E', overflow: 'hidden' }}>
            <TableContainer>
              <Table size="medium">
                <TableHead sx={{ bgcolor: '#0A0E16' }}>
                  <TableRow>
                    <TableCell sx={{ color: '#64748B', fontWeight: 700, fontSize: '0.72rem', textTransform: 'uppercase' }}>วันที่</TableCell>
                    <TableCell sx={{ color: '#64748B', fontWeight: 700, fontSize: '0.72rem', textTransform: 'uppercase' }}>รายการ</TableCell>
                    <TableCell sx={{ color: '#64748B', fontWeight: 700, fontSize: '0.72rem', textTransform: 'uppercase' }}>ประเภท</TableCell>
                    <TableCell sx={{ color: '#64748B', fontWeight: 700, fontSize: '0.72rem', textTransform: 'uppercase' }}>หมวดหมู่</TableCell>
                    <TableCell align="right" sx={{ color: '#64748B', fontWeight: 700, fontSize: '0.72rem', textTransform: 'uppercase' }}>จำนวนเงิน (บาท)</TableCell>
                    <TableCell align="center" sx={{ color: '#64748B', fontWeight: 700, fontSize: '0.72rem', textTransform: 'uppercase' }}>จัดการ</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                        <CircularProgress size={32} color="primary" />
                      </TableCell>
                    </TableRow>
                  ) : transactions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                        <Typography variant="body2" sx={{ color: '#64748B' }}>
                          ไม่พบรายการที่ตรงกับเงื่อนไขการค้นหา
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    transactions.map((tx) => {
                      const isIncome = tx.type === 'income';
                      const isAuto = tx.note && tx.note.includes('บันทึกอัตโนมัติ');
                      return (
                        <TableRow
                          key={tx.id}
                          sx={{
                            '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.02)' },
                            borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                          }}
                        >
                          <TableCell sx={{ whiteSpace: 'nowrap' }}>
                            <Typography variant="body2" className="tabular-nums" sx={{ color: '#F1F5F9', fontSize: '0.8rem', fontWeight: 500 }}>
                              {new Date(tx.date).toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' })}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="body2" sx={{ color: '#F1F5F9', fontWeight: 600, fontSize: '0.85rem' }}>
                                {tx.title}
                              </Typography>
                              {isAuto && (
                                <Chip
                                  label="Auto"
                                  size="small"
                                  icon={<AutorenewIcon sx={{ fontSize: '12px !important' }} />}
                                  sx={{ height: 18, fontSize: '0.625rem', bgcolor: 'rgba(99, 102, 241, 0.15)', color: '#C0C1FF', border: '1px solid rgba(99, 102, 241, 0.3)' }}
                                />
                              )}
                            </Box>
                            {tx.note && (
                              <Typography variant="caption" sx={{ color: '#64748B', display: 'block', fontSize: '0.7rem', mt: 0.25 }}>
                                {tx.note}
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell sx={{ whiteSpace: 'nowrap' }}>
                            <Box
                              sx={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 0.5,
                                px: 0.9,
                                py: 0.2,
                                borderRadius: '9999px',
                                bgcolor: isIncome ? 'rgba(16, 185, 129, 0.12)' : 'rgba(244, 63, 94, 0.12)',
                                color: isIncome ? '#4EDEA3' : '#FFB2B7',
                                fontSize: '0.7rem',
                                fontWeight: 600,
                              }}
                            >
                              <Box sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: isIncome ? '#10B981' : '#F43F5E' }} />
                              {isIncome ? 'รายรับ' : 'รายจ่าย'}
                            </Box>
                          </TableCell>
                          <TableCell sx={{ whiteSpace: 'nowrap' }}>
                            {tx.category ? (
                              <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.75 }}>
                                <CategoryIcon icon={tx.category.icon} name={tx.category.name} size="1.1rem" />
                                <Typography variant="body2" sx={{ color: '#94A3B8', fontSize: '0.8rem' }}>
                                  {tx.category.name}
                                </Typography>
                              </Box>
                            ) : (
                              <Typography variant="body2" sx={{ color: '#64748B', fontSize: '0.8rem' }}>
                                -
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
                            <Typography
                              variant="body2"
                              className="tabular-nums"
                              sx={{
                                fontWeight: 700,
                                fontSize: '0.875rem',
                                color: isIncome ? '#10B981' : '#F43F5E',
                              }}
                            >
                              {isIncome ? '+' : '-'}{parseFloat(tx.amount).toLocaleString('th-TH', { minimumFractionDigits: 2 })} ฿
                            </Typography>
                          </TableCell>
                          <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.25 }}>
                              <Tooltip title="แก้ไข">
                                <IconButton
                                  size="small"
                                  onClick={() => handleOpenEdit(tx)}
                                  sx={{
                                    color: '#94A3B8',
                                    p: 0.6,
                                    '&:hover': { color: '#F1F5F9', bgcolor: 'rgba(255, 255, 255, 0.05)' },
                                  }}
                                >
                                  <EditIcon sx={{ fontSize: 16 }} />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="ลบรายการ">
                                <IconButton
                                  size="small"
                                  onClick={() => setDeleteTarget(tx)}
                                  sx={{
                                    color: '#94A3B8',
                                    p: 0.6,
                                    '&:hover': { color: '#F43F5E', bgcolor: 'rgba(244, 63, 94, 0.1)' },
                                  }}
                                >
                                  <DeleteIcon sx={{ fontSize: 16 }} />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Pagination Controls */}
            {pagination.total_pages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, borderTop: '1px solid rgba(255, 255, 255, 0.04)' }}>
                <Typography variant="caption" sx={{ color: '#64748B' }}>
                  แสดงหน้า {pagination.current_page} จาก {pagination.total_pages} (ทั้งหมด {pagination.total_items} รายการ)
                </Typography>
                <Pagination
                  count={pagination.total_pages}
                  page={page}
                  onChange={(e, newPage) => setPage(newPage)}
                  color="primary"
                  size="small"
                />
              </Box>
            )}
          </Paper>
        </>
      )}

      {/* VIEW B: RECURRING RULES VIEW */}
      {activeTab === 'recurring' && (
        <Paper elevation={0} sx={{ borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.07)', bgcolor: '#131C2E', overflow: 'hidden', p: 2.5 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#F1F5F9' }}>
                รายการอัตโนมัติประจำเดือน (Auto Recurring Schedules)
              </Typography>
              <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                ระบบจะสร้างรายการรายรับ-รายจ่ายให้อัตโนมัติเมื่อถึงวันที่กำหนดในแต่ละเดือน
              </Typography>
            </Box>
            <Button
              variant="outlined"
              color="primary"
              size="small"
              onClick={handleOpenAdd}
              startIcon={<AddIcon sx={{ fontSize: 16 }} />}
            >
              เพิ่มรายการประจำ
            </Button>
          </Box>

          {loadingRecurring ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
              <CircularProgress size={32} color="primary" />
            </Box>
          ) : recurringList.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 6, bgcolor: 'rgba(255, 255, 255, 0.02)', borderRadius: '10px' }}>
              <EventRepeatIcon sx={{ fontSize: 48, color: '#475569', mb: 1 }} />
              <Typography variant="body1" sx={{ color: '#94A3B8', fontWeight: 600 }}>
                ยังไม่มีการตั้งค่ารายการอัตโนมัติ
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748B', display: 'block', mt: 0.5, mb: 2 }}>
                คุณสามารถเปิดตัวเลือก "ตั้งเป็นรายการประจำทุกเดือน" ตอนบันทึกรายการเพื่อให้อัปเดตออโต้
              </Typography>
              <Button variant="contained" color="primary" size="small" onClick={handleOpenAdd}>
                เริ่มตั้งค่ารายการประจำ
              </Button>
            </Box>
          ) : (
            <Grid container spacing={2}>
              {recurringList.map((rule) => {
                const isIncome = rule.type === 'income';
                const stripeColor = isIncome ? '#10B981' : '#F43F5E';
                return (
                  <Grid item xs={12} sm={6} md={4} key={rule.id}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        borderRadius: '12px',
                        bgcolor: '#0A0E16',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        position: 'relative',
                        overflow: 'hidden',
                        opacity: rule.is_active ? 1 : 0.6,
                        transition: 'all 0.2s ease',
                      }}
                    >
                      {/* Stripe */}
                      <Box sx={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, bgcolor: stripeColor }} />

                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Box sx={{ width: 36, height: 36, borderRadius: '8px', bgcolor: 'rgba(255, 255, 255, 0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <CategoryIcon icon={rule.category?.icon} name={rule.title} size="1.2rem" />
                          </Box>
                          <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#F1F5F9' }}>
                              {rule.title}
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#64748B' }}>
                              {rule.category?.name || (isIncome ? 'รายรับ' : 'รายจ่าย')}
                            </Typography>
                          </Box>
                        </Box>

                        <Switch
                          size="small"
                          checked={rule.is_active}
                          onChange={() => handleToggleRecurringActive(rule)}
                          color="primary"
                        />
                      </Box>

                      {/* Day & Amount Info */}
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 1, borderTop: '1px solid rgba(255, 255, 255, 0.04)' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <EventRepeatIcon sx={{ fontSize: 16, color: '#818CF8' }} />
                          <Typography variant="caption" sx={{ color: '#94A3B8', fontWeight: 600 }}>
                            ทุกวันที่ {rule.day_of_month} ของเดือน
                          </Typography>
                        </Box>

                        <Typography variant="subtitle2" className="tabular-nums" sx={{ fontWeight: 700, color: isIncome ? '#10B981' : '#F43F5E' }}>
                          {isIncome ? '+' : '-'}฿{parseFloat(rule.amount).toLocaleString('th-TH', { minimumFractionDigits: 2 })}
                        </Typography>
                      </Box>

                      {/* Status and Action */}
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1.5 }}>
                        <Typography variant="caption" sx={{ color: rule.is_active ? '#10B981' : '#64748B', fontSize: '0.675rem', fontWeight: 600 }}>
                          {rule.is_active ? '● กำลังทำงาน' : '○ พักการทำงาน'}
                        </Typography>

                        <IconButton
                          size="small"
                          onClick={() => setDeleteRecurringTarget(rule)}
                          sx={{ color: '#64748B', p: 0.4, '&:hover': { color: '#F43F5E' } }}
                        >
                          <DeleteIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                      </Box>
                    </Paper>
                  </Grid>
                );
              })}
            </Grid>
          )}
        </Paper>
      )}

      {/* Add / Edit Transaction Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: '#0F172A',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: { xs: '12px', sm: '16px' },
            boxShadow: '0 24px 60px rgba(0, 0, 0, 0.8)',
            m: { xs: 1.5, sm: 2 },
          },
        }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1, pt: 2, px: { xs: 2, sm: 3 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#6366F1' }} />
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#F1F5F9', fontSize: { xs: '1rem', sm: '1.1rem' } }}>
              {editTx ? 'แก้ไขรายการธุรกรรม' : 'บันทึกรายการใหม่'}
            </Typography>
          </Box>
          <IconButton size="small" onClick={() => setDialogOpen(false)} sx={{ color: '#64748B' }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ px: { xs: 2, sm: 3 }, py: 2 }}>
          {formError && (
            <Alert severity="error" sx={{ mb: 2, bgcolor: 'rgba(244, 63, 94, 0.15)', color: '#FFB2B7', border: '1px solid rgba(244, 63, 94, 0.3)' }}>
              {formError}
            </Alert>
          )}

          {/* Type Toggle */}
          <Box sx={{ display: 'flex', p: 0.5, bgcolor: '#0A0E16', borderRadius: '10px', mb: 2.5, border: '1px solid rgba(255, 255, 255, 0.05)' }}>
            <Button
              fullWidth
              onClick={() => { setFormType('expense'); setFormCategoryId(''); }}
              sx={{
                py: 0.75,
                borderRadius: '8px',
                fontSize: { xs: '0.78rem', sm: '0.85rem' },
                fontWeight: 600,
                color: formType === 'expense' ? '#FFB2B7' : '#64748B',
                bgcolor: formType === 'expense' ? 'rgba(244, 63, 94, 0.15)' : 'transparent',
                border: formType === 'expense' ? '1px solid rgba(244, 63, 94, 0.3)' : '1px solid transparent',
              }}
            >
              รายจ่าย (Expense)
            </Button>
            <Button
              fullWidth
              onClick={() => { setFormType('income'); setFormCategoryId(''); }}
              sx={{
                py: 0.75,
                borderRadius: '8px',
                fontSize: { xs: '0.78rem', sm: '0.85rem' },
                fontWeight: 600,
                color: formType === 'income' ? '#4EDEA3' : '#64748B',
                bgcolor: formType === 'income' ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
                border: formType === 'income' ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid transparent',
              }}
            >
              รายรับ (Income)
            </Button>
          </Box>

          <Box component="form" id="tx-modal-form" onSubmit={handleSaveTransaction} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="ชื่อรายการ *"
              placeholder="เช่น ซื้อกาแฟ, ค่าห้อง, เงินเดือน"
              fullWidth
              size="small"
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              required
            />

            {/* Amount Field with Comma Formatting and Numeric Sanitization */}
            <TextField
              label="จำนวนเงิน (บาท) *"
              placeholder="0.00"
              fullWidth
              size="small"
              value={formAmount}
              onChange={(e) => {
                const formatted = formatAmountWithCommas(e.target.value);
                setFormAmount(formatted);
              }}
              onKeyDown={(e) => {
                if (['e', 'E', '+', '-'].includes(e.key)) {
                  e.preventDefault();
                }
              }}
              InputProps={{
                endAdornment: <InputAdornment position="end">฿</InputAdornment>,
              }}
              required
            />

            <TextField
              select
              label="หมวดหมู่"
              fullWidth
              size="small"
              value={formCategoryId}
              onChange={(e) => setFormCategoryId(e.target.value)}
            >
              <MenuItem value="">-- ไม่ระบุหมวดหมู่ --</MenuItem>
              {categories
                .filter((c) => !c.type || c.type === formType)
                .map((c) => (
                  <MenuItem key={c.id} value={String(c.id)}>
                    <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1 }}>
                      <CategoryIcon icon={c.icon} name={c.name} size="1.1rem" />
                      <span>{c.name}</span>
                    </Box>
                  </MenuItem>
                ))}
            </TextField>

            <TextField
              label="วันที่ทำรายการ"
              type="date"
              fullWidth
              size="small"
              value={formDate}
              onChange={(e) => setFormDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />

            {/* Auto Recurring Toggle Option (When Creating New Transaction) */}
            {!editTx && (
              <Box sx={{ p: 1.5, borderRadius: '10px', bgcolor: 'rgba(99, 102, 241, 0.05)', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={isRecurring}
                      onChange={(e) => setIsRecurring(e.target.checked)}
                      color="primary"
                    />
                  }
                  label={
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#F1F5F9', fontSize: '0.825rem' }}>
                        🔁 ตั้งเป็นรายการประจำทุกเดือน (Auto Recurring)
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#94A3B8', fontSize: '0.7rem', display: 'block' }}>
                        ระบบจะบันทึกรายการนี้ให้คุณอัตโนมัติในวันที่กำหนดของทุกเดือน
                      </Typography>
                    </Box>
                  }
                />
                {isRecurring && (
                  <Box sx={{ mt: 1.5, pt: 1.5, borderTop: '1px dashed rgba(255, 255, 255, 0.1)' }}>
                    <TextField
                      select
                      fullWidth
                      size="small"
                      label="ทำรายการทุกวันที่"
                      value={recurringDay}
                      onChange={(e) => setRecurringDay(Number(e.target.value))}
                    >
                      {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                        <MenuItem key={d} value={d}>
                          วันที่ {d} ของทุกเดือน
                        </MenuItem>
                      ))}
                    </TextField>
                  </Box>
                )}
              </Box>
            )}

            <TextField
              label="หมายเหตุเพิ่มเติม (ถ้ามี)"
              placeholder="บันทึกรายละเอียดสั้นๆ"
              multiline
              rows={2}
              fullWidth
              size="small"
              value={formNote}
              onChange={(e) => setFormNote(e.target.value)}
            />
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: { xs: 2, sm: 3 }, pb: 2, pt: 1, gap: 1 }}>
          <Button onClick={() => setDialogOpen(false)} variant="outlined" sx={{ color: '#94A3B8' }}>
            ยกเลิก
          </Button>
          <Button
            type="submit"
            form="tx-modal-form"
            variant="contained"
            disabled={submittingForm}
            sx={{
              bgcolor: '#6366F1',
              color: '#fff',
              fontWeight: 600,
              minWidth: { xs: 100, sm: 120 },
            }}
          >
            {submittingForm ? <CircularProgress size={20} color="inherit" /> : 'บันทึกข้อมูล'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        PaperProps={{
          sx: {
            bgcolor: '#0F172A',
            borderRadius: { xs: '12px', sm: '16px' },
            border: '1px solid rgba(244, 63, 94, 0.3)',
            m: { xs: 1.5, sm: 2 },
          },
        }}
      >
        <DialogTitle sx={{ color: '#FFB2B7', fontWeight: 700, fontSize: { xs: '1rem', sm: '1.1rem' } }}>
          ยืนยันการลบรายการธุรกรรม
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: '#94A3B8', fontSize: '0.85rem' }}>
            คุณต้องการลบรายการ <strong style={{ color: '#F1F5F9' }}>"{deleteTarget?.title}"</strong> จำนวนเงิน{' '}
            <strong style={{ color: deleteTarget?.type === 'income' ? '#10B981' : '#F43F5E' }}>
              ฿{deleteTarget?.amount ? parseFloat(deleteTarget.amount).toLocaleString('th-TH', { minimumFractionDigits: 2 }) : '0.00'}
            </strong>{' '}
            ใช่หรือไม่?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDeleteTarget(null)} sx={{ color: '#94A3B8' }}>
            ยกเลิก
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            variant="contained"
            disabled={deleting}
            sx={{
              bgcolor: '#F43F5E',
              color: '#fff',
              fontWeight: 600,
              '&:hover': { bgcolor: '#E11D48' },
            }}
          >
            {deleting ? <CircularProgress size={20} color="inherit" /> : 'ยืนยันลบ'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TransactionsPage;
