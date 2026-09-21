import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  MenuItem,
  Alert,
  CircularProgress,
  ToggleButton,
  ToggleButtonGroup,
  InputAdornment,
} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import api from '../../services/api';
import {
  formatAmountWithCommas,
  parseAmountToNumber,
} from '../../utils/numberFormat';

const TransactionForm = ({ mode = 'create', initialData = null, transactionId = null }) => {
  const navigate = useNavigate();

  const [type, setType] = useState(initialData?.type || 'expense');
  const [title, setTitle] = useState(initialData?.title || '');
  const [amount, setAmount] = useState(initialData?.amount ? formatAmountWithCommas(initialData.amount) : '');
  const [categoryId, setCategoryId] = useState(initialData?.category?.id || '');
  const [date, setDate] = useState(
    initialData?.date
      ? new Date(initialData.date).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0]
  );
  const [note, setNote] = useState(initialData?.note || '');

  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Fetch categories based on selected type
  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true);
      try {
        const response = await api.get(`/categories?type=${type}`);
        if (response.data?.success) {
          // Backend ส่ง data เป็น Array โดยตรง ไม่ใช่ { categories: [] }
          setCategories(Array.isArray(response.data.data) ? response.data.data : []);
        }
      } catch (err) {
        console.error('[TransactionForm]: Failed to fetch categories:', err);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, [type]);

  // Reset category selection when transaction type changes
  const handleTypeChange = (event, newType) => {
    if (newType !== null && newType !== type) {
      setType(newType);
      setCategoryId(''); // Mitigation: clear category ID to prevent type mismatch
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('กรุณาระบุชื่อรายการ');
      return;
    }

    const numAmount = parseAmountToNumber(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setError('จำนวนเงินต้องเป็นตัวเลขที่มากกว่า 0');
      return;
    }

    if (!date) {
      setError('กรุณาระบุวันที่ทำรายการ');
      return;
    }

    setSubmitting(true);
    setError('');

    const payload = {
      title: title.trim(),
      amount: numAmount,
      type,
      category_id: categoryId ? parseInt(categoryId, 10) : null,
      date,
      note: note.trim() || null,
    };

    try {
      if (mode === 'create') {
        await api.post('/transactions', payload);
      } else {
        await api.patch(`/transactions/${transactionId}`, payload);
      }
      navigate('/transactions');
    } catch (err) {
      const msg = err.response?.data?.message || 'เกิดข้อผิดพลาดในการบันทึกรายการ';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Paper
      elevation={4}
      sx={{
        p: 4,
        maxWidth: 700,
        mx: 'auto',
        borderRadius: 3,
        bgcolor: '#1E293B',
        border: '1px solid rgba(255, 255, 255, 0.08)',
      }}
    >
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, color: '#F8FAFC' }}>
        {mode === 'create' ? 'เพิ่มรายการใหม่' : 'แก้ไขรายการการเงิน'}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {/* Type Selector Toggle */}
          <Grid item xs={12}>
            <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary', fontWeight: 600 }}>
              ประเภทรายการ
            </Typography>
            <ToggleButtonGroup
              value={type}
              exclusive
              onChange={handleTypeChange}
              fullWidth
              sx={{ bgcolor: 'rgba(15, 23, 42, 0.6)', p: 0.5, borderRadius: 2 }}
            >
              <ToggleButton
                value="income"
                sx={{
                  py: 1.2,
                  fontWeight: 600,
                  borderRadius: 2,
                  color: 'text.secondary',
                  '&.Mui-selected': {
                    bgcolor: 'success.main',
                    color: '#FFFFFF',
                    '&:hover': { bgcolor: 'success.dark' },
                  },
                }}
              >
                <AddCircleIcon sx={{ mr: 1 }} /> รายรับ (+)
              </ToggleButton>
              <ToggleButton
                value="expense"
                sx={{
                  py: 1.2,
                  fontWeight: 600,
                  borderRadius: 2,
                  color: 'text.secondary',
                  '&.Mui-selected': {
                    bgcolor: 'error.main',
                    color: '#FFFFFF',
                    '&:hover': { bgcolor: 'error.dark' },
                  },
                }}
              >
                <RemoveCircleIcon sx={{ mr: 1 }} /> รายจ่าย (-)
              </ToggleButton>
            </ToggleButtonGroup>
          </Grid>

          {/* Title */}
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label="ชื่อรายการ (เช่น ค่าอาหาร, เงินเดือน)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Grid>

          {/* Amount */}
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="จำนวนเงิน (บาท)"
              placeholder="0.00"
              value={amount}
              onChange={(e) => {
                const formatted = formatAmountWithCommas(e.target.value);
                setAmount(formatted);
              }}
              onKeyDown={(e) => {
                if (['e', 'E', '+', '-'].includes(e.key)) {
                  e.preventDefault();
                }
              }}
              InputProps={{
                endAdornment: <InputAdornment position="end">฿</InputAdornment>,
              }}
            />
          </Grid>

          {/* Date */}
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="วันที่ทำรายการ"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          {/* Category Dropdown */}
          <Grid item xs={12}>
            <TextField
              select
              fullWidth
              label="หมวดหมู่ (เลือกหรือไม่ก็ได้)"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              disabled={loadingCategories}
            >
              <MenuItem value="">
                <em>-- ไม่ระบุหมวดหมู่ --</em>
              </MenuItem>
              {categories.map((cat) => (
                <MenuItem key={cat.id} value={cat.id}>
                  {cat.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Note */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="บันทึกเพิ่มเติม (Note)"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </Grid>

          {/* Action Buttons */}
          <Grid item xs={12} sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
            <Button
              variant="outlined"
              color="inherit"
              startIcon={<CancelIcon />}
              onClick={() => navigate('/transactions')}
            >
              ยกเลิก
            </Button>
            <Button
              type="submit"
              variant="contained"
              color={type === 'income' ? 'success' : 'primary'}
              startIcon={submitting ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
              disabled={submitting}
            >
              {submitting ? 'กำลังบันทึก...' : 'บันทึกรายการ'}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default TransactionForm;
