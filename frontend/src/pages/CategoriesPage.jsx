import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Alert,
  CircularProgress,
} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircleRounded';
import EditIcon from '@mui/icons-material/EditRounded';
import DeleteIcon from '@mui/icons-material/DeleteRounded';
import TrendingUpIcon from '@mui/icons-material/TrendingUpRounded';
import TrendingDownIcon from '@mui/icons-material/TrendingDownRounded';
import CloseIcon from '@mui/icons-material/CloseRounded';
import api from '../services/api';
import { APP_VERSION } from '../config/version';

const EMOJI_OPTIONS = [
  '💼', '🍔', '🎨', '💻', '🚆', '🏠', '🛒', '🎮', '🏥', '🎓',
  '💰', '📈', '☕', '✈️', '🎁', '⚡', '🎬', '📚', '🏋️', '✨',
];

const EMPTY_FORM = { name: '', type: 'expense', icon: '🍔', color: '#6366F1' };

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [filterType, setFilterType] = useState('all');
  const [loading, setLoading] = useState(true);

  // Dialog states
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/categories');
      if (response.data?.success) {
        setCategories(Array.isArray(response.data.data) ? response.data.data : []);
      }
    } catch (err) {
      console.error('[CategoriesPage]: Failed to fetch categories:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const filteredCategories = categories.filter((cat) => {
    if (filterType === 'all') return true;
    return cat.type === filterType;
  });

  const incomeCount = categories.filter((c) => c.type === 'income').length;
  const expenseCount = categories.filter((c) => c.type === 'expense').length;

  const handleOpenCreate = () => {
    setEditTarget(null);
    setFormData(EMPTY_FORM);
    setFormError('');
    setFormOpen(true);
  };

  const handleOpenEdit = (cat) => {
    setEditTarget(cat);
    setFormData({
      name: cat.name || '',
      type: cat.type || 'expense',
      icon: cat.icon || '🍔',
      color: cat.color || '#6366F1',
    });
    setFormError('');
    setFormOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setFormError('กรุณากรอกชื่อหมวดหมู่');
      return;
    }

    setSubmitting(true);
    setFormError('');
    try {
      if (editTarget) {
        await api.patch(`/categories/${editTarget.id}`, formData);
      } else {
        await api.post('/categories', formData);
      }
      setFormOpen(false);
      fetchCategories();
      window.dispatchEvent(new CustomEvent('transactionUpdated'));
    } catch (err) {
      console.error('[CategoriesPage]: Form submit error:', err);
      setFormError(err.response?.data?.message || 'เกิดข้อผิดพลาดในการบันทึกหมวดหมู่');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setSubmitting(true);
    try {
      await api.delete(`/categories/${deleteTarget.id}`);
      setDeleteOpen(false);
      setDeleteTarget(null);
      fetchCategories();
      window.dispatchEvent(new CustomEvent('transactionUpdated'));
    } catch (err) {
      console.error('[CategoriesPage]: Delete category error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ pb: { xs: 4, md: 6 } }}>
      {/* Top Header Strip */}
      <Box sx={{ pt: 1, pb: 2.5, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ px: 1, py: 0.25, borderRadius: '6px', bgcolor: 'rgba(99, 102, 241, 0.15)', color: '#C0C1FF', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Classification & Taxonomies
            </Box>
            <Box sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: '#475569' }} />
            <Typography variant="caption" className="tabular-nums" sx={{ color: '#64748B', fontSize: '0.72rem' }}>
              v2.4.0 Live
            </Typography>
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#F1F5F9', fontSize: { xs: '1.25rem', sm: '1.45rem' }, letterSpacing: '-0.02em' }}>
            หมวดหมู่การเงิน
          </Typography>
          <Typography variant="body2" sx={{ color: '#94A3B8', fontSize: { xs: '0.78rem', sm: '0.85rem' } }}>
            จัดการหมวดหมู่รายรับและรายจ่ายเพื่อวิเคราะห์พฤติกรรมการเงินได้แม่นยำ
          </Typography>
        </Box>

        <Button
          variant="contained"
          color="primary"
          onClick={handleOpenCreate}
          startIcon={<AddCircleIcon sx={{ fontSize: 18 }} />}
          sx={{
            height: 36,
            fontSize: '0.825rem',
            fontWeight: 600,
            width: { xs: '100%', sm: 'auto' },
          }}
        >
          เพิ่มหมวดหมู่ใหม่
        </Button>
      </Box>

      {/* Filter Tabs & Quick Counters Shelf */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'stretch', sm: 'center' }, justifyContent: 'space-between', gap: 1.5, mb: 3 }}>
        {/* Filter Pills */}
        <Box sx={{ display: 'flex', p: 0.5, bgcolor: '#0A0E16', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.06)', overflowX: 'auto' }}>
          <Button
            onClick={() => setFilterType('all')}
            sx={{
              py: 0.5,
              px: { xs: 1.25, sm: 1.75 },
              borderRadius: '8px',
              fontSize: { xs: '0.78rem', sm: '0.825rem' },
              fontWeight: 600,
              bgcolor: filterType === 'all' ? '#6366F1' : 'transparent',
              color: filterType === 'all' ? '#FFFFFF' : '#94A3B8',
              gap: 0.75,
              flex: { xs: 1, sm: 'none' },
              '&:hover': { bgcolor: filterType === 'all' ? '#4F46E5' : 'rgba(255, 255, 255, 0.04)' },
            }}
          >
            <span>ทั้งหมด</span>
            <Box sx={{ px: 0.75, py: 0.1, borderRadius: '9999px', bgcolor: 'rgba(255, 255, 255, 0.15)', fontSize: '0.625rem', fontWeight: 700 }}>
              {categories.length}
            </Box>
          </Button>

          <Button
            onClick={() => setFilterType('income')}
            sx={{
              py: 0.5,
              px: { xs: 1.25, sm: 1.75 },
              borderRadius: '8px',
              fontSize: { xs: '0.78rem', sm: '0.825rem' },
              fontWeight: 600,
              bgcolor: filterType === 'income' ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
              color: filterType === 'income' ? '#4EDEA3' : '#94A3B8',
              gap: 0.75,
              flex: { xs: 1, sm: 'none' },
              '&:hover': { bgcolor: 'rgba(16, 185, 129, 0.1)' },
            }}
          >
            <Box sx={{ width: 5, height: 5, borderRadius: '50%', bgcolor: '#10B981' }} />
            <span>รายรับ</span>
            <Box sx={{ px: 0.75, py: 0.1, borderRadius: '9999px', bgcolor: 'rgba(255, 255, 255, 0.08)', fontSize: '0.625rem', fontWeight: 700 }}>
              {incomeCount}
            </Box>
          </Button>

          <Button
            onClick={() => setFilterType('expense')}
            sx={{
              py: 0.5,
              px: { xs: 1.25, sm: 1.75 },
              borderRadius: '8px',
              fontSize: { xs: '0.78rem', sm: '0.825rem' },
              fontWeight: 600,
              bgcolor: filterType === 'expense' ? 'rgba(244, 63, 94, 0.15)' : 'transparent',
              color: filterType === 'expense' ? '#FFB2B7' : '#94A3B8',
              gap: 0.75,
              flex: { xs: 1, sm: 'none' },
              '&:hover': { bgcolor: 'rgba(244, 63, 94, 0.1)' },
            }}
          >
            <Box sx={{ width: 5, height: 5, borderRadius: '50%', bgcolor: '#F43F5E' }} />
            <span>รายจ่าย</span>
            <Box sx={{ px: 0.75, py: 0.1, borderRadius: '9999px', bgcolor: 'rgba(255, 255, 255, 0.08)', fontSize: '0.625rem', fontWeight: 700 }}>
              {expenseCount}
            </Box>
          </Button>
        </Box>

        {/* Status Indicators */}
        <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 1.5, py: 0.5, borderRadius: '10px', bgcolor: '#131C2E', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
            <TrendingUpIcon sx={{ color: '#10B981', fontSize: 16 }} />
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography variant="caption" sx={{ color: '#64748B', fontSize: '0.625rem', textTransform: 'uppercase' }}>
                หมวดรายรับ
              </Typography>
              <Typography variant="caption" className="tabular-nums" sx={{ color: '#10B981', fontWeight: 700, fontSize: '0.75rem' }}>
                {incomeCount} ประเภท
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 1.5, py: 0.5, borderRadius: '10px', bgcolor: '#131C2E', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
            <TrendingDownIcon sx={{ color: '#F43F5E', fontSize: 16 }} />
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography variant="caption" sx={{ color: '#64748B', fontSize: '0.625rem', textTransform: 'uppercase' }}>
                หมวดรายจ่าย
              </Typography>
              <Typography variant="caption" className="tabular-nums" sx={{ color: '#F43F5E', fontWeight: 700, fontSize: '0.75rem' }}>
                {expenseCount} ประเภท
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* 4-Column Bento Categories Grid */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress size={32} color="primary" />
        </Box>
      ) : filteredCategories.length === 0 ? (
        <Paper elevation={0} sx={{ p: 6, textAlign: 'center', bgcolor: '#131C2E', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.07)' }}>
          <Typography variant="body1" sx={{ color: '#94A3B8' }}>
            ไม่พบหมวดหมู่ในประเภทนี้
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={2}>
          {filteredCategories.map((cat) => {
            const isIncome = cat.type === 'income';
            const stripeColor = isIncome ? '#10B981' : '#F43F5E';
            const iconBg = isIncome ? 'rgba(16, 185, 129, 0.12)' : 'rgba(244, 63, 94, 0.12)';

            return (
              <Grid item xs={12} sm={6} md={4} lg={3} key={cat.id}>
                <Paper
                  elevation={0}
                  sx={{
                    position: 'relative',
                    overflow: 'hidden',
                    p: 2,
                    height: '100%',
                    bgcolor: '#131C2E',
                    borderRadius: '14px',
                    border: '1px solid rgba(255, 255, 255, 0.07)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: 'inset 0 1px 0 0 rgba(255, 255, 255, 0.05)',
                    transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      borderColor: 'rgba(255, 255, 255, 0.15)',
                      boxShadow: '0 8px 24px -4px rgba(0, 0, 0, 0.6), inset 0 1px 0 0 rgba(255, 255, 255, 0.1)',
                    },
                  }}
                >
                  {/* Left Accent Stripe */}
                  <Box
                    sx={{
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      bottom: 0,
                      width: 4,
                      bgcolor: stripeColor,
                    }}
                  />

                  {/* Header: Icon, Title & Quick Actions */}
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                        <Box
                          sx={{
                            width: 38,
                            height: 38,
                            borderRadius: '10px',
                            bgcolor: iconBg,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.2rem',
                          }}
                        >
                          {cat.icon || '📁'}
                        </Box>
                        <Box>
                          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#F1F5F9', fontSize: '0.9rem', lineHeight: 1.2 }}>
                            {cat.name}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#64748B', fontSize: '0.675rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                            {isIncome ? 'Income Source' : 'Expense Category'}
                          </Typography>
                        </Box>
                      </Box>

                      {/* Edit / Delete action buttons */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25 }}>
                        <IconButton
                          size="small"
                          onClick={() => handleOpenEdit(cat)}
                          sx={{ color: '#64748B', p: 0.5, '&:hover': { color: '#F1F5F9' } }}
                        >
                          <EditIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => { setDeleteTarget(cat); setDeleteOpen(true); }}
                          sx={{ color: '#64748B', p: 0.5, '&:hover': { color: '#F43F5E' } }}
                        >
                          <DeleteIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                      </Box>
                    </Box>

                    {/* Type Badge & Info */}
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1.5 }}>
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
                          fontSize: '0.68rem',
                          fontWeight: 600,
                        }}
                      >
                        <Box sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: stripeColor }} />
                        {isIncome ? 'รายรับ' : 'รายจ่าย'}
                      </Box>

                      <Typography variant="caption" sx={{ color: '#64748B', fontSize: '0.7rem' }}>
                        ID #{cat.id}
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      )}

      {/* Add / Edit Category Dialog */}
      <Dialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
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
              {editTarget ? 'แก้ไขหมวดหมู่' : 'เพิ่มหมวดหมู่ใหม่'}
            </Typography>
          </Box>
          <IconButton size="small" onClick={() => setFormOpen(false)} sx={{ color: '#64748B' }}>
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
              onClick={() => setFormData({ ...formData, type: 'expense' })}
              sx={{
                py: 0.75,
                borderRadius: '8px',
                fontSize: { xs: '0.78rem', sm: '0.85rem' },
                fontWeight: 600,
                color: formData.type === 'expense' ? '#FFB2B7' : '#64748B',
                bgcolor: formData.type === 'expense' ? 'rgba(244, 63, 94, 0.15)' : 'transparent',
                border: formData.type === 'expense' ? '1px solid rgba(244, 63, 94, 0.3)' : '1px solid transparent',
              }}
            >
              รายจ่าย (Expense)
            </Button>
            <Button
              fullWidth
              onClick={() => setFormData({ ...formData, type: 'income' })}
              sx={{
                py: 0.75,
                borderRadius: '8px',
                fontSize: { xs: '0.78rem', sm: '0.85rem' },
                fontWeight: 600,
                color: formData.type === 'income' ? '#4EDEA3' : '#64748B',
                bgcolor: formData.type === 'income' ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
                border: formData.type === 'income' ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid transparent',
              }}
            >
              รายรับ (Income)
            </Button>
          </Box>

          <Box component="form" id="cat-modal-form" onSubmit={handleFormSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="ชื่อหมวดหมู่ *"
              placeholder="เช่น อาหาร, ค่าน้ำมัน, เงินเดือน"
              fullWidth
              size="small"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />

            {/* Emoji Selection */}
            <Box>
              <Typography variant="caption" sx={{ color: '#94A3B8', fontWeight: 600, mb: 1, display: 'block' }}>
                เลือกไอคอน Emoji
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
                {EMOJI_OPTIONS.map((emoji) => (
                  <Box
                    key={emoji}
                    onClick={() => setFormData({ ...formData, icon: emoji })}
                    sx={{
                      width: 34,
                      height: 34,
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.1rem',
                      cursor: 'pointer',
                      bgcolor: formData.icon === emoji ? 'rgba(99, 102, 241, 0.25)' : 'rgba(255, 255, 255, 0.04)',
                      border: formData.icon === emoji ? '2px solid #6366F1' : '1px solid rgba(255, 255, 255, 0.08)',
                      transition: 'all 0.15s ease',
                      '&:hover': { bgcolor: 'rgba(99, 102, 241, 0.15)' },
                    }}
                  >
                    {emoji}
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: { xs: 2, sm: 3 }, pb: 2, pt: 1, gap: 1 }}>
          <Button onClick={() => setFormOpen(false)} variant="outlined" sx={{ color: '#94A3B8' }}>
            ยกเลิก
          </Button>
          <Button
            type="submit"
            form="cat-modal-form"
            variant="contained"
            disabled={submitting}
            sx={{
              bgcolor: '#6366F1',
              color: '#fff',
              fontWeight: 600,
              minWidth: 100,
            }}
          >
            {submitting ? <CircularProgress size={20} color="inherit" /> : 'บันทึก'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
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
          ยืนยันการลบหมวดหมู่
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: '#94A3B8', fontSize: '0.85rem' }}>
            คุณต้องการลบหมวดหมู่ <strong style={{ color: '#F1F5F9' }}>"{deleteTarget?.icon} {deleteTarget?.name}"</strong> ใช่หรือไม่?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDeleteOpen(false)} sx={{ color: '#94A3B8' }}>
            ยกเลิก
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            variant="contained"
            disabled={submitting}
            sx={{
              bgcolor: '#F43F5E',
              color: '#fff',
              fontWeight: 600,
              '&:hover': { bgcolor: '#E11D48' },
            }}
          >
            {submitting ? <CircularProgress size={20} color="inherit" /> : 'ยืนยันลบ'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CategoriesPage;
