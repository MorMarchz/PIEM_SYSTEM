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
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import api from '../services/api';

const TransactionsPage = () => {
  const navigate = useNavigate();

  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({ current_page: 1, total_pages: 1, total_items: 0, limit: 10 });
  const [loading, setLoading] = useState(true);

  // Filter States
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [page, setPage] = useState(1);

  // Delete Dialog State
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Fetch Master Categories for Filter
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/categories');
        if (response.data?.success) {
          setCategories(response.data.data.categories || []);
        }
      } catch (err) {
        console.error('[TransactionsPage]: Failed to fetch categories:', err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch Transactions List
  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    try {
      let queryParams = new URLSearchParams();
      queryParams.append('page', page);
      queryParams.append('limit', 10);

      if (search.trim()) queryParams.append('search', search.trim());
      if (type) queryParams.append('type', type);
      if (categoryId) queryParams.append('category_id', categoryId);
      if (startDate) queryParams.append('start_date', startDate);
      if (endDate) queryParams.append('end_date', endDate);

      const response = await api.get(`/transactions?${queryParams.toString()}`);
      if (response.data?.success) {
        setTransactions(response.data.data.transactions || []);
        setPagination(response.data.data.pagination);
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
    setType('');
    setCategoryId('');
    setStartDate('');
    setEndDate('');
    setPage(1);
  };

  // Confirm Delete Handler
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.delete(`/transactions/${deleteTarget.id}`);
      setDeleteTarget(null);
      fetchTransactions();
    } catch (err) {
      console.error('[TransactionsPage]: Delete failed:', err);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Box sx={{ animation: 'fadeIn 0.3s ease-in-out' }}>
      {/* Header Actions */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#F8FAFC' }}>
            ประวัติรายการการเงิน
          </Typography>
          <Typography variant="body2" color="text.secondary">
            ค้นหา กรอง และจัดการบันทึกรายรับ-รายจ่ายย้อนหลัง
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          size="large"
          startIcon={<AddIcon />}
          onClick={() => navigate('/transactions/new')}
          sx={{
            borderRadius: 2.5,
            px: 3,
            py: 1.2,
            boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)',
          }}
        >
          เพิ่มรายการใหม่
        </Button>
      </Box>

      {/* Filter Panel */}
      <Paper sx={{ p: 3, mb: 3, bgcolor: '#1E293B', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 3 }}>
        <Grid container spacing= {2} alignItems="center">
          {/* Search TextField */}
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              size="small"
              placeholder="ค้นหาชื่อรายการ / หมายเหตุ..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          {/* Type Filter */}
          <Grid item xs={6} sm={3} md={2}>
            <TextField
              select
              fullWidth
              size="small"
              label="ประเภท"
              value={type}
              onChange={(e) => { setType(e.target.value); setPage(1); }}
            >
              <MenuItem value="">ทั้งหมด</MenuItem>
              <MenuItem value="income">รายรับ (+)</MenuItem>
              <MenuItem value="expense">รายจ่าย (-)</MenuItem>
            </TextField>
          </Grid>

          {/* Category Filter */}
          <Grid item xs={6} sm={3} md={2}>
            <TextField
              select
              fullWidth
              size="small"
              label="หมวดหมู่"
              value={categoryId}
              onChange={(e) => { setCategoryId(e.target.value); setPage(1); }}
            >
              <MenuItem value="">ทุกหมวดหมู่</MenuItem>
              {categories.map((cat) => (
                <MenuItem key={cat.id} value={cat.id}>
                  {cat.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Start Date */}
          <Grid item xs={6} sm={3} md={2}>
            <TextField
              fullWidth
              size="small"
              label="ตั้งแต่วันที่"
              type="date"
              value={startDate}
              onChange={(e) => { setStartDate(e.target.value); setPage(1); }}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          {/* End Date */}
          <Grid item xs={6} sm={3} md={2}>
            <TextField
              fullWidth
              size="small"
              label="ถึงวันที่"
              type="date"
              value={endDate}
              onChange={(e) => { setEndDate(e.target.value); setPage(1); }}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          {/* Reset Filters */}
          <Grid item xs={12} md={1} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
            <Tooltip title="ล้างตัวกรองทั้งหมด">
              <IconButton color="secondary" onClick={handleResetFilters}>
                <FilterAltOffIcon />
              </IconButton>
            </Tooltip>
          </Grid>
        </Grid>
      </Paper>

      {/* Transactions Data Table */}
      <TableContainer component={Paper} sx={{ bgcolor: '#1E293B', borderRadius: 3, border: '1px solid rgba(255, 255, 255, 0.08)' }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress size={40} color="primary" />
          </Box>
        ) : transactions.length === 0 ? (
          /* Empty State */
          <Box sx={{ p: 6, textAlign: 'center' }}>
            <ReceiptLongIcon sx={{ fontSize: 64, color: 'text.secondary', opacity: 0.5, mb: 1 }} />
            <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 600 }}>
              ไม่พบรายการการเงิน
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              ลองปรับการค้นหาหรือกดเพิ่มรายการใหม่
            </Typography>
          </Box>
        ) : (
          <Table>
            <TableHead sx={{ bgcolor: 'rgba(15, 23, 42, 0.8)' }}>
              <TableRow>
                <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>วันที่</TableCell>
                <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>ชื่อรายการ / หมายเหตุ</TableCell>
                <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>หมวดหมู่</TableCell>
                <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>ประเภท</TableCell>
                <TableCell align="right" sx={{ color: 'text.secondary', fontWeight: 600 }}>จำนวนเงิน</TableCell>
                <TableCell align="center" sx={{ color: 'text.secondary', fontWeight: 600 }}>จัดการ</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.map((row) => {
                const isIncome = row.type === 'income';
                return (
                  <TableRow key={row.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell sx={{ color: '#F8FAFC' }}>
                      {new Date(row.date).toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#F8FAFC' }}>
                        {row.title}
                      </Typography>
                      {row.note && (
                        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                          {row.note}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      {row.category ? (
                        <Chip
                          label={row.category.name}
                          size="small"
                          sx={{
                            bgcolor: row.category.color ? `${row.category.color}25` : 'rgba(255, 255, 255, 0.1)',
                            color: row.category.color || '#F8FAFC',
                            fontWeight: 600,
                            borderRadius: 1.5,
                          }}
                        />
                      ) : (
                        <Typography variant="caption" color="text.secondary">
                          - ไม่ระบุ -
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={isIncome ? <ArrowUpwardIcon fontSize="small" /> : <ArrowDownwardIcon fontSize="small" />}
                        label={isIncome ? 'รายรับ' : 'รายจ่าย'}
                        size="small"
                        color={isIncome ? 'success' : 'error'}
                        variant="outlined"
                        sx={{ borderRadius: 1.5, fontWeight: 600 }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: 700,
                          color: isIncome ? 'success.main' : 'error.main',
                        }}
                      >
                        {isIncome ? '+' : '-'}{row.amount.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ฿
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="แก้ไข">
                        <IconButton
                          color="primary"
                          size="small"
                          onClick={() => navigate(`/transactions/${row.id}/edit`)}
                          sx={{ mr: 0.5 }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="ลบรายการ">
                        <IconButton
                          color="error"
                          size="small"
                          onClick={() => setDeleteTarget(row)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}

        {/* Pagination Footer */}
        {pagination.total_pages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 2.5 }}>
            <Pagination
              count={pagination.total_pages}
              page={page}
              onChange={(e, val) => setPage(val)}
              color="primary"
              shape="rounded"
            />
          </Box>
        )}
      </TableContainer>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        PaperProps={{
          sx: { bgcolor: '#1E293B', borderRadius: 3, p: 1 },
        }}
      >
        <DialogTitle sx={{ fontWeight: 700, color: '#F8FAFC' }}>
          ยืนยันการลบรายการการเงิน?
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: 'text.secondary' }}>
            คุณกำลังจะลบรายการ <strong style={{ color: '#F8FAFC' }}>"{deleteTarget?.title}"</strong> จำนวนเงิน{' '}
            <strong style={{ color: '#EF4444' }}>{deleteTarget?.amount?.toLocaleString('th-TH')} ฿</strong> ออกจากระบบ ข้อมูลที่ถูกลบไม่สามารถกู้คืนได้
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDeleteTarget(null)} color="inherit">
            ยกเลิก
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            disabled={deleting}
            startIcon={deleting ? <CircularProgress size={18} color="inherit" /> : <DeleteIcon />}
          >
            {deleting ? 'กำลังลบ...' : 'ลบรายการ'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TransactionsPage;
