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
import api from '../services/api';
import CategoryIcon from '../components/common/CategoryIcon';

const TransactionsPage = () => {
  const navigate = useNavigate();

  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({ current_page: 1, total_pages: 1, total_items: 0, limit: 10 });
  const [loading, setLoading] = useState(true);

  // Filter States
  const [search, setSearch] = useState('');
  const [type, setType] = useState('all');
  const [categoryId, setCategoryId] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [page, setPage] = useState(1);

  // Modal States for Add / Edit
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editTx, setEditTx] = useState(null);
  const [formType, setFormType] = useState('expense');
  const [formTitle, setFormTitle] = useState('');
  const [formAmount, setFormAmount] = useState('');
  const [formCategoryId, setFormCategoryId] = useState('');
  const [formDate, setFormDate] = useState(new Date().toISOString().split('T')[0]);
  const [formNote, setFormNote] = useState('');
  const [submittingForm, setSubmittingForm] = useState(false);
  const [formError, setFormError] = useState('');

  // Delete Dialog State
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

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

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

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
    setFormError('');
    setDialogOpen(true);
  };

  // Open Edit Dialog
  const handleOpenEdit = (tx) => {
    setEditTx(tx);
    setFormType(tx.type || 'expense');
    setFormTitle(tx.title || '');
    setFormAmount(tx.amount ? String(tx.amount) : '');
    setFormCategoryId(tx.category?.id ? String(tx.category.id) : '');
    setFormDate(tx.date ? new Date(tx.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]);
    setFormNote(tx.note || '');
    setFormError('');
    setDialogOpen(true);
  };

  const handleSaveTransaction = async (e) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      setFormError('กรุณาระบุชื่อรายการ');
      return;
    }
    const num = parseFloat(formAmount);
    if (isNaN(num) || num <= 0) {
      setFormError('กรุณาระบุจำนวนเงินที่มากกว่า 0');
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
      }

      setDialogOpen(false);
      fetchTransactions();
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
              FINANCIAL LEDGER
            </Typography>
            <Typography variant="caption" sx={{ color: '#475569' }}>/</Typography>
            <Typography variant="caption" sx={{ color: '#94A3B8', fontWeight: 600, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              REAL-TIME AUDIT
            </Typography>
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#F1F5F9', fontSize: { xs: '1.25rem', sm: '1.45rem' }, letterSpacing: '-0.02em' }}>
            รายการการเงิน
          </Typography>
          <Typography variant="body2" sx={{ color: '#94A3B8', fontSize: { xs: '0.78rem', sm: '0.85rem' } }}>
            จัดการและตรวจสอบประวัติรายรับ-รายจ่ายทั้งหมด
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: { xs: '100%', sm: 'auto' }, flexWrap: 'wrap' }}>
          <Button
            variant="outlined"
            onClick={fetchTransactions}
            startIcon={<SyncAltIcon sx={{ fontSize: 18 }} />}
            sx={{
              height: 36,
              fontSize: '0.825rem',
              fontWeight: 600,
              bgcolor: '#131C2E',
              borderColor: 'rgba(255, 255, 255, 0.08)',
              color: '#94A3B8',
              flex: { xs: 1, sm: 'none' },
              '&:hover': {
                bgcolor: '#182235',
                color: '#F1F5F9',
                borderColor: 'rgba(255, 255, 255, 0.15)',
              },
            }}
          >
            ปรับปรุงข้อมูล
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleOpenAdd}
            startIcon={<AddIcon sx={{ fontSize: 18 }} />}
            sx={{
              height: 36,
              fontSize: '0.825rem',
              fontWeight: 600,
              flex: { xs: 1, sm: 'none' },
            }}
          >
            + เพิ่มรายการใหม่
          </Button>
        </Box>
      </Box>

      {/* 3 Metric Spark Overview Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              bgcolor: '#131C2E',
              borderRadius: '14px',
              border: '1px solid rgba(255, 255, 255, 0.07)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: 'inset 0 1px 0 0 rgba(255, 255, 255, 0.05)',
            }}
          >
            <Box>
              <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                รายรับช่วงนี้ (Inflow)
              </Typography>
              <Typography variant="h5" className="tabular-nums" sx={{ fontWeight: 700, color: '#10B981', mt: 0.5, fontSize: { xs: '1.2rem', sm: '1.35rem' } }}>
                +{currentInflow.toLocaleString('th-TH', { minimumFractionDigits: 2 })} <Typography component="span" sx={{ fontSize: '0.75rem', color: '#4EDEA3' }}>THB</Typography>
              </Typography>
              <Typography variant="caption" sx={{ color: '#10B981', fontSize: '0.68rem', display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                <ArrowDownwardIcon sx={{ fontSize: 12 }} /> {transactions.filter((t) => t.type === 'income').length} รายการรับ
              </Typography>
            </Box>
            <Box sx={{ width: 38, height: 38, borderRadius: '10px', bgcolor: 'rgba(16, 185, 129, 0.12)', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ArrowDownwardIcon />
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              bgcolor: '#131C2E',
              borderRadius: '14px',
              border: '1px solid rgba(255, 255, 255, 0.07)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: 'inset 0 1px 0 0 rgba(255, 255, 255, 0.05)',
            }}
          >
            <Box>
              <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                รายจ่ายช่วงนี้ (Outflow)
              </Typography>
              <Typography variant="h5" className="tabular-nums" sx={{ fontWeight: 700, color: '#F43F5E', mt: 0.5, fontSize: { xs: '1.2rem', sm: '1.35rem' } }}>
                -{currentOutflow.toLocaleString('th-TH', { minimumFractionDigits: 2 })} <Typography component="span" sx={{ fontSize: '0.75rem', color: '#FFB2B7' }}>THB</Typography>
              </Typography>
              <Typography variant="caption" sx={{ color: '#F43F5E', fontSize: '0.68rem', display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                <ArrowUpwardIcon sx={{ fontSize: 12 }} /> {transactions.filter((t) => t.type === 'expense').length} รายการใช้จ่าย
              </Typography>
            </Box>
            <Box sx={{ width: 38, height: 38, borderRadius: '10px', bgcolor: 'rgba(244, 63, 94, 0.12)', color: '#F43F5E', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ArrowUpwardIcon />
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={12} md={4}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              bgcolor: '#131C2E',
              borderRadius: '14px',
              border: '1px solid rgba(255, 255, 255, 0.07)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: 'inset 0 1px 0 0 rgba(255, 255, 255, 0.05)',
            }}
          >
            <Box>
              <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                กระแสเงินสดสุทธิ (Net Delta)
              </Typography>
              <Typography variant="h5" className="tabular-nums" sx={{ fontWeight: 700, color: currentNet >= 0 ? '#6366F1' : '#F43F5E', mt: 0.5, fontSize: { xs: '1.2rem', sm: '1.35rem' } }}>
                {currentNet >= 0 ? '+' : ''}{currentNet.toLocaleString('th-TH', { minimumFractionDigits: 2 })} <Typography component="span" sx={{ fontSize: '0.75rem', color: '#94A3B8' }}>THB</Typography>
              </Typography>
              <Typography variant="caption" sx={{ color: '#818CF8', fontSize: '0.68rem', display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                <InsightsIcon sx={{ fontSize: 12 }} /> ยอดรวมในหน้านี้
              </Typography>
            </Box>
            <Box sx={{ width: 38, height: 38, borderRadius: '10px', bgcolor: 'rgba(99, 102, 241, 0.15)', color: '#6366F1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <InsightsIcon />
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Filter & Search Shelf */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 1.5, sm: 2 },
          mb: 3,
          bgcolor: '#131C2E',
          borderRadius: '14px',
          border: '1px solid rgba(255, 255, 255, 0.07)',
        }}
      >
        <Grid container spacing={1.5} alignItems="center">
          {/* Search Input */}
          <Grid item xs={12} md={3.5}>
            <TextField
              size="small"
              fullWidth
              placeholder="🔍 ค้นหารายการ..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Box sx={{ px: 0.75, py: 0.2, borderRadius: '4px', bgcolor: '#222D42', color: '#94A3B8', fontSize: '0.65rem', fontWeight: 600 }}>
                      ⌘K
                    </Box>
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
      <Paper
        elevation={0}
        sx={{
          bgcolor: '#131C2E',
          borderRadius: '14px',
          border: '1px solid rgba(255, 255, 255, 0.07)',
          overflow: 'hidden',
          boxShadow: 'inset 0 1px 0 0 rgba(255, 255, 255, 0.05)',
        }}
      >
        <TableContainer sx={{ overflowX: 'auto' }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ minWidth: 100 }}>วันที่</TableCell>
                <TableCell sx={{ minWidth: 160 }}>ชื่อรายการ & หมายเหตุ</TableCell>
                <TableCell sx={{ minWidth: 90 }}>ประเภท</TableCell>
                <TableCell sx={{ minWidth: 120 }}>หมวดหมู่</TableCell>
                <TableCell align="right" sx={{ minWidth: 120 }}>จำนวนเงิน</TableCell>
                <TableCell align="center" sx={{ minWidth: 90 }}>จัดการ</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 5 }}>
                    <CircularProgress size={26} color="primary" />
                  </TableCell>
                </TableRow>
              ) : transactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 5, color: '#64748B' }}>
                    ไม่พบรายการธุรกรรมตามเงื่อนไขที่กำหนด
                  </TableCell>
                </TableRow>
              ) : (
                transactions.map((tx) => {
                  const isIncome = tx.type === 'income';
                  const formattedDate = new Date(tx.date).toLocaleDateString('th-TH', {
                    day: '2-digit',
                    month: '2-digit',
                    year: '2-digit',
                  });

                  return (
                    <TableRow
                      key={tx.id}
                      hover
                      sx={{
                        '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.02)' },
                      }}
                    >
                      <TableCell className="tabular-nums" sx={{ color: '#94A3B8', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                        {formattedDate}
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#F1F5F9', fontSize: '0.825rem' }}>
                          {tx.title}
                        </Typography>
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

        {/* Pagination Bar */}
        {pagination.total_pages > 1 && (
          <Box sx={{ p: 2, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: 'center', gap: 1.5, borderTop: '1px solid rgba(255, 255, 255, 0.04)' }}>
            <Typography variant="caption" sx={{ color: '#64748B', fontSize: '0.72rem' }}>
              หน้า {pagination.current_page} จาก {pagination.total_pages} (ทั้งหมด {pagination.total_items} รายการ)
            </Typography>
            <Pagination
              count={pagination.total_pages}
              page={page}
              onChange={(e, value) => setPage(value)}
              color="primary"
              size="small"
            />
          </Box>
        )}
      </Paper>

      {/* Add / Edit Transaction Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="sm"
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
              {editTx ? 'แก้ไขรายการธุรกรรม' : 'เพิ่มรายการธุรกรรมใหม่'}
            </Typography>
          </Box>
          <IconButton size="small" onClick={() => setDialogOpen(false)} sx={{ color: '#64748B' }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ px: { xs: 2, sm: 3 }, py: 2 }}>
          {formError && (
            <Box sx={{ mb: 2, p: 1.5, borderRadius: '8px', bgcolor: 'rgba(244, 63, 94, 0.15)', color: '#FFB2B7', border: '1px solid rgba(244, 63, 94, 0.3)', fontSize: '0.85rem' }}>
              {formError}
            </Box>
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

            <TextField
              label="จำนวนเงิน (บาท) *"
              type="number"
              placeholder="0.00"
              fullWidth
              size="small"
              value={formAmount}
              onChange={(e) => setFormAmount(e.target.value)}
              inputProps={{ min: '0', step: '0.01' }}
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
              {deleteTarget?.amount} ฿
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
