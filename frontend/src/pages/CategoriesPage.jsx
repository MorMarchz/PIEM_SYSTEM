import React, { useState, useEffect, useCallback, useRef } from 'react';
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
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircleRounded';
import EditIcon from '@mui/icons-material/EditRounded';
import DeleteIcon from '@mui/icons-material/DeleteRounded';
import TrendingUpIcon from '@mui/icons-material/TrendingUpRounded';
import TrendingDownIcon from '@mui/icons-material/TrendingDownRounded';
import CloseIcon from '@mui/icons-material/CloseRounded';
import CloudUploadIcon from '@mui/icons-material/CloudUploadRounded';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotionsRounded';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlineRounded';
import api from '../services/api';
import CategoryIcon from '../components/common/CategoryIcon';

const EMOJI_OPTIONS = [
  '💼', '🍔', '🎨', '💻', '🚆', '🏠', '🛒', '🎮', '🏥', '🎓',
  '💰', '📈', '☕', '✈️', '🎁', '⚡', '🎬', '📚', '🏋️', '✨',
  '🚗', '🛵', '🍿', '💡', '🐾', '📱', '👕', '🏖️', '🛠️', '🪙',
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
  const [iconMode, setIconMode] = useState('emoji'); // 'emoji' | 'upload'
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

  const fileInputRef = useRef(null);

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

  const isImageIcon = (iconStr) => {
    if (!iconStr) return false;
    return (
      iconStr.startsWith('data:image/') ||
      iconStr.startsWith('http://') ||
      iconStr.startsWith('https://') ||
      /\.(png|jpe?g|svg|webp|gif)$/i.test(iconStr)
    );
  };

  const handleOpenCreate = () => {
    setEditTarget(null);
    setFormData(EMPTY_FORM);
    setIconMode('emoji');
    setFormError('');
    setFormOpen(true);
  };

  const handleOpenEdit = (cat) => {
    setEditTarget(cat);
    const initialIcon = cat.icon || '🍔';
    setFormData({
      name: cat.name || '',
      type: cat.type || 'expense',
      icon: initialIcon,
      color: cat.color || '#6366F1',
    });
    setIconMode(isImageIcon(initialIcon) ? 'upload' : 'emoji');
    setFormError('');
    setFormOpen(true);
  };

  // Helper to resize uploaded image to 128x128 WebP/PNG Data URI
  const handleImageFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setFormError('กรุณาเลือกไฟล์รูปภาพ (PNG, JPG, SVG, WebP)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setFormError('ขนาดไฟล์รูปภาพต้องไม่เกิน 5 MB');
      return;
    }

    setUploadingImage(true);
    setFormError('');

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const maxDim = 128;
          canvas.width = maxDim;
          canvas.height = maxDim;
          const ctx = canvas.getContext('2d');

          // Center crop to square
          const minSide = Math.min(img.width, img.height);
          const startX = (img.width - minSide) / 2;
          const startY = (img.height - minSide) / 2;

          ctx.clearRect(0, 0, maxDim, maxDim);
          ctx.drawImage(img, startX, startY, minSide, minSide, 0, 0, maxDim, maxDim);

          // Export as WebP (fallback to PNG if unsupported)
          let dataUrl = canvas.toDataURL('image/webp', 0.88);
          if (!dataUrl.startsWith('data:image/webp')) {
            dataUrl = canvas.toDataURL('image/png');
          }

          setFormData((prev) => ({ ...prev, icon: dataUrl }));
        } catch (err) {
          console.error('[CategoriesPage]: Image process error:', err);
          setFormError('ไม่สามารถประมวลผลรูปภาพได้');
        } finally {
          setUploadingImage(false);
        }
      };
      img.onerror = () => {
        setFormError('ไม่สามารถเปิดไฟล์รูปภาพนี้ได้');
        setUploadingImage(false);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
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
            จัดการหมวดหมู่รายรับและรายจ่าย พร้อมไอคอนกำหนดเองเพื่อวิเคราะห์พฤติกรรมการเงินได้แม่นยำ
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

      {/* Categories Grid */}
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
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, minWidth: 0, flex: 1, mr: 1 }}>
                        <Box
                          sx={{
                            width: 40,
                            height: 40,
                            minWidth: 40,
                            borderRadius: '10px',
                            bgcolor: iconBg,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            overflow: 'hidden',
                            flexShrink: 0,
                          }}
                        >
                          <CategoryIcon icon={cat.icon} name={cat.name} size="1.4rem" />
                        </Box>
                        <Box sx={{ minWidth: 0, flex: 1 }}>
                          <Typography
                            variant="subtitle1"
                            sx={{
                              fontWeight: 700,
                              color: '#F1F5F9',
                              fontSize: '0.9rem',
                              lineHeight: 1.2,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {cat.name}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#64748B', fontSize: '0.675rem', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block' }}>
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

            {/* Icon Selection Mode (Emoji or Custom Upload) */}
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="caption" sx={{ color: '#94A3B8', fontWeight: 600 }}>
                  ไอคอนหมวดหมู่
                </Typography>
                <ToggleButtonGroup
                  value={iconMode}
                  exclusive
                  onChange={(e, newMode) => {
                    if (newMode) setIconMode(newMode);
                  }}
                  size="small"
                  sx={{
                    bgcolor: '#0A0E16',
                    borderRadius: '8px',
                    '& .MuiToggleButton-root': {
                      py: 0.25,
                      px: 1,
                      fontSize: '0.7rem',
                      textTransform: 'none',
                      color: '#94A3B8',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      '&.Mui-selected': {
                        bgcolor: 'rgba(99, 102, 241, 0.2)',
                        color: '#C0C1FF',
                        borderColor: 'rgba(99, 102, 241, 0.5)',
                      },
                    },
                  }}
                >
                  <ToggleButton value="emoji">
                    <EmojiEmotionsIcon sx={{ fontSize: 14, mr: 0.5 }} />
                    Emoji
                  </ToggleButton>
                  <ToggleButton value="upload">
                    <CloudUploadIcon sx={{ fontSize: 14, mr: 0.5 }} />
                    อัปโหลดรูป
                  </ToggleButton>
                </ToggleButtonGroup>
              </Box>

              {/* Preview Current Selected Icon */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 1.25, mb: 1.5, bgcolor: '#0A0E16', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: '10px',
                    bgcolor: 'rgba(99, 102, 241, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    border: '1px solid rgba(99, 102, 241, 0.3)',
                  }}
                >
                  <CategoryIcon icon={formData.icon} name={formData.name} size="1.6rem" />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="caption" sx={{ color: '#F1F5F9', fontWeight: 600, display: 'block' }}>
                    พรีวิวไอคอนปัจจุบัน
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#64748B', fontSize: '0.7rem' }}>
                    {isImageIcon(formData.icon) ? 'รูปภาพกำหนดเอง (Custom Image)' : 'อิโมจิมาตรฐาน'}
                  </Typography>
                </Box>
                {isImageIcon(formData.icon) && (
                  <Button
                    size="small"
                    variant="text"
                    color="error"
                    onClick={() => setFormData({ ...formData, icon: '🍔' })}
                    startIcon={<DeleteOutlineIcon sx={{ fontSize: 14 }} />}
                    sx={{ fontSize: '0.7rem', py: 0.2 }}
                  >
                    ล้างรูป
                  </Button>
                )}
              </Box>

              {/* Mode A: Emoji Selection Grid */}
              {iconMode === 'emoji' && (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, maxHeight: 130, overflowY: 'auto', p: 0.5, bgcolor: 'rgba(255, 255, 255, 0.02)', borderRadius: '8px' }}>
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
              )}

              {/* Mode B: Custom Image Upload Box */}
              {iconMode === 'upload' && (
                <Box>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/png, image/jpeg, image/webp, image/svg+xml, image/gif"
                    style={{ display: 'none' }}
                    onChange={handleImageFileChange}
                  />
                  <Box
                    onClick={() => fileInputRef.current?.click()}
                    sx={{
                      p: 2.5,
                      borderRadius: '10px',
                      border: '2px dashed rgba(99, 102, 241, 0.4)',
                      bgcolor: 'rgba(99, 102, 241, 0.04)',
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        borderColor: '#6366F1',
                        bgcolor: 'rgba(99, 102, 241, 0.08)',
                      },
                    }}
                  >
                    {uploadingImage ? (
                      <CircularProgress size={24} sx={{ color: '#6366F1', my: 1 }} />
                    ) : (
                      <>
                        <CloudUploadIcon sx={{ fontSize: 32, color: '#818CF8', mb: 0.5 }} />
                        <Typography variant="body2" sx={{ color: '#F1F5F9', fontWeight: 600, fontSize: '0.825rem' }}>
                          คลิกเพื่อเลือกไฟล์รูปภาพ
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#64748B', display: 'block', mt: 0.25 }}>
                          รองรับ PNG, JPG, SVG, WebP (ครอบตัดจัตุรัสอัตโนมัติ)
                        </Typography>
                      </>
                    )}
                  </Box>
                </Box>
              )}
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
            disabled={submitting || uploadingImage}
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
            คุณต้องการลบหมวดหมู่ <strong style={{ color: '#F1F5F9' }}>"{deleteTarget?.name}"</strong> ใช่หรือไม่?
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
