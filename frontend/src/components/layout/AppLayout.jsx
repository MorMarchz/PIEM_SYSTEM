import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem as MuiMenuItem,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Alert,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/DashboardRounded';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLongRounded';
import CategoryIcon from '@mui/icons-material/CategoryRounded';
import AssessmentIcon from '@mui/icons-material/AssessmentRounded';
import PersonIcon from '@mui/icons-material/AccountCircleRounded';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWalletRounded';
import LogoutIcon from '@mui/icons-material/LogoutRounded';
import AddCircleIcon from '@mui/icons-material/AddCircleRounded';
import MenuIcon from '@mui/icons-material/MenuRounded';
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMoreRounded';
import CloseIcon from '@mui/icons-material/CloseRounded';
import { useAuth } from '../../context/AuthContext';
import { APP_VERSION } from '../../config/version';
import api from '../../services/api';

const DRAWER_WIDTH = 240;

const navItems = [
  { text: 'แดชบอร์ด', path: '/dashboard', icon: <DashboardIcon sx={{ fontSize: 20 }} /> },
  { text: 'รายการการเงิน', path: '/transactions', icon: <ReceiptLongIcon sx={{ fontSize: 20 }} /> },
  { text: 'หมวดหมู่', path: '/categories', icon: <CategoryIcon sx={{ fontSize: 20 }} /> },
  { text: 'รายงานสรุป', path: '/reports', icon: <AssessmentIcon sx={{ fontSize: 20 }} /> },
  { text: 'โปรไฟล์ส่วนตัว', path: '/profile', icon: <PersonIcon sx={{ fontSize: 20 }} /> },
];

const AppLayout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  // Quick Add Transaction Modal State
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [quickType, setQuickType] = useState('expense');
  const [quickTitle, setQuickTitle] = useState('');
  const [quickAmount, setQuickAmount] = useState('');
  const [quickCategoryId, setQuickCategoryId] = useState('');
  const [quickDate, setQuickDate] = useState(new Date().toISOString().split('T')[0]);
  const [quickNote, setQuickNote] = useState('');
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [submittingQuick, setSubmittingQuick] = useState(false);
  const [quickError, setQuickError] = useState('');

  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleMenuClose();
    await logout();
    navigate('/login', { replace: true });
  };

  const openQuickAdd = async () => {
    setQuickAddOpen(true);
    setQuickError('');
    setQuickTitle('');
    setQuickAmount('');
    setQuickNote('');
    setQuickDate(new Date().toISOString().split('T')[0]);
    loadCategories(quickType);
  };

  const loadCategories = async (selectedType) => {
    setLoadingCategories(true);
    try {
      const response = await api.get(`/categories?type=${selectedType}`);
      if (response.data?.success) {
        setCategories(Array.isArray(response.data.data) ? response.data.data : []);
      }
    } catch (err) {
      console.error('[QuickAdd]: Failed to load categories:', err);
    } finally {
      setLoadingCategories(false);
    }
  };

  const handleTypeToggle = (type) => {
    setQuickType(type);
    setQuickCategoryId('');
    loadCategories(type);
  };

  const handleQuickSubmit = async (e) => {
    e.preventDefault();
    if (!quickTitle.trim()) {
      setQuickError('กรุณากรอกชื่อรายการ');
      return;
    }
    const num = parseFloat(quickAmount);
    if (isNaN(num) || num <= 0) {
      setQuickError('กรุณาระบุจำนวนเงินที่ถูกต้อง');
      return;
    }

    setSubmittingQuick(true);
    setQuickError('');
    try {
      const payload = {
        title: quickTitle.trim(),
        amount: num,
        type: quickType,
        category_id: quickCategoryId ? parseInt(quickCategoryId, 10) : null,
        date: quickDate,
        note: quickNote.trim() || null,
      };
      await api.post('/transactions', payload);
      setQuickAddOpen(false);
      window.dispatchEvent(new CustomEvent('transactionUpdated'));
    } catch (err) {
      console.error('[QuickAdd]: Error saving transaction:', err);
      setQuickError(err.response?.data?.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    } finally {
      setSubmittingQuick(false);
    }
  };

  const userDisplayName = user?.display_name || 'March';
  const userEmail = user?.email || 'sorawich0027@gmail.com';
  const userInitial = userDisplayName.charAt(0).toUpperCase();

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#0A0E16', borderRight: '1px solid rgba(255, 255, 255, 0.07)' }}>
      {/* Brand Header */}
      <Box sx={{ height: 56, px: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: '8px',
              bgcolor: 'primary.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 16px rgba(99, 102, 241, 0.4)',
            }}
          >
            <AccountBalanceWalletIcon sx={{ color: '#fff', fontSize: 18 }} />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, letterSpacing: '-0.02em', color: '#F1F5F9', fontSize: '1rem' }}>
              PI&EM
            </Typography>
            <Chip
              label={APP_VERSION}
              size="small"
              sx={{
                height: 18,
                fontSize: '0.625rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                bgcolor: 'rgba(99, 102, 241, 0.15)',
                color: '#C0C1FF',
                border: '1px solid rgba(99, 102, 241, 0.3)',
              }}
            />
          </Box>
        </Box>
      </Box>

      {/* Workspace Section Header */}
      <Box sx={{ px: 2.5, pt: 2, pb: 0.5 }}>
        <Typography
          variant="caption"
          sx={{
            fontSize: '0.65rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: '#64748B',
          }}
        >
          Workspace
        </Typography>
      </Box>

      {/* Nav List */}
      <List sx={{ px: 1.25, py: 0.5, flexGrow: 1 }}>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => {
                  navigate(item.path);
                  if (isMobile) setMobileOpen(false);
                }}
                sx={{
                  borderRadius: '8px',
                  py: 0.85,
                  px: 1.25,
                  bgcolor: isActive ? '#6366F1' : 'transparent',
                  color: isActive ? '#FFFFFF' : '#94A3B8',
                  boxShadow: isActive ? '0 2px 8px rgba(99, 102, 241, 0.35)' : 'none',
                  '&:hover': {
                    bgcolor: isActive ? '#4F46E5' : 'rgba(255, 255, 255, 0.04)',
                    color: '#F1F5F9',
                  },
                  transition: 'all 0.15s ease-in-out',
                }}
              >
                <ListItemIcon sx={{ color: isActive ? '#FFFFFF' : '#94A3B8', minWidth: 32 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontSize: '0.85rem',
                    fontWeight: isActive ? 600 : 500,
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      {/* Profile Card Widget at Bottom */}
      <Box sx={{ p: 1.5, m: 1.25, mb: 1, borderRadius: '12px', bgcolor: '#131C2E', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
        <Box
          onClick={handleMenuOpen}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            p: 0.5,
            borderRadius: '8px',
            '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.03)' },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, minWidth: 0 }}>
            <Box sx={{ position: 'relative' }}>
              <Avatar sx={{ bgcolor: 'secondary.main', color: '#002113', width: 32, height: 32, fontSize: '0.85rem', fontWeight: 700 }}>
                {userInitial}
              </Avatar>
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  bgcolor: '#10B981',
                  border: '2px solid #131C2E',
                }}
              />
            </Box>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#F1F5F9', fontSize: '0.8rem', lineHeight: 1.2, noWrap: true }}>
                {userDisplayName}
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748B', fontSize: '0.7rem', display: 'block', noWrap: true }}>
                {userEmail}
              </Typography>
            </Box>
          </Box>
          <UnfoldMoreIcon sx={{ color: '#64748B', fontSize: 18 }} />
        </Box>
      </Box>

      {/* Sidebar Footer Version Info */}
      <Box sx={{ px: 2.5, pb: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="caption" sx={{ color: '#475569', fontSize: '0.675rem', fontWeight: 500 }}>
          Version
        </Typography>
        <Typography variant="caption" className="tabular-nums" sx={{ color: '#64748B', fontSize: '0.675rem', fontWeight: 700, fontFamily: 'monospace' }}>
          {APP_VERSION}
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#080C14' }}>
      {/* Top Fixed App Bar */}
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { md: `${DRAWER_WIDTH}px` },
          height: 56,
          bgcolor: 'rgba(8, 12, 20, 0.9)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.07)',
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar sx={{ height: 56, minHeight: '56px !important', px: { xs: 1.5, sm: 2, md: 3 }, justifyContent: 'space-between' }}>
          {/* Left Breadcrumb & Live Sync */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1.5 } }}>
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ display: { md: 'none' }, mr: { xs: 0.5, sm: 1 }, p: { xs: 0.75, sm: 1 } }}
            >
              <MenuIcon />
            </IconButton>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
              <Typography variant="body2" sx={{ color: '#64748B', fontSize: { xs: '0.75rem', sm: '0.825rem' }, display: { xs: 'none', sm: 'inline' } }}>
                PI&EM
              </Typography>
              <Typography variant="body2" sx={{ color: '#475569', fontSize: { xs: '0.75rem', sm: '0.825rem' }, display: { xs: 'none', sm: 'inline' } }}>
                /
              </Typography>
              <Typography variant="body2" sx={{ color: '#F1F5F9', fontWeight: 600, fontSize: { xs: '0.8rem', sm: '0.825rem' }, noWrap: true }}>
                {navItems.find((n) => n.path === location.pathname)?.text || 'Console'}
              </Typography>
            </Box>

            <Box
              sx={{
                display: { xs: 'none', sm: 'flex' },
                alignItems: 'center',
                gap: 0.75,
                px: 1,
                py: 0.25,
                borderRadius: '9999px',
                bgcolor: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
              }}
            >
              <Box
                sx={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  bgcolor: '#10B981',
                  boxShadow: '0 0 8px #10B981',
                }}
              />
              <Typography sx={{ fontSize: '0.675rem', fontWeight: 600, color: '#F1F5F9', letterSpacing: '0.02em' }}>
                Live Sync
              </Typography>
            </Box>
          </Box>

          {/* Right Action Items */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 1.5 } }}>
            <Button
              variant="contained"
              color="primary"
              size="small"
              startIcon={<AddCircleIcon sx={{ fontSize: { xs: 16, sm: 18 } }} />}
              onClick={openQuickAdd}
              sx={{
                height: 32,
                fontSize: { xs: '0.725rem', sm: '0.8rem' },
                fontWeight: 600,
                borderRadius: '8px',
                px: { xs: 1, sm: 1.5 },
                whiteSpace: 'nowrap',
              }}
            >
              {isSmallScreen ? '+ บันทึก' : 'บันทึกรายการใหม่'}
            </Button>

            <IconButton
              size="small"
              onClick={handleMenuOpen}
              sx={{
                p: 0.5,
                border: '1px solid rgba(255, 255, 255, 0.1)',
                bgcolor: 'rgba(255, 255, 255, 0.03)',
              }}
            >
              <Avatar sx={{ width: 28, height: 28, bgcolor: '#6366F1', fontSize: '0.75rem', fontWeight: 700 }}>
                {userInitial}
              </Avatar>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* User Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            mt: 1.5,
            minWidth: 200,
            bgcolor: '#0F172A',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 16px 36px rgba(0, 0, 0, 0.7)',
          },
        }}
      >
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography variant="body2" sx={{ fontWeight: 600, color: '#F1F5F9' }}>
            {userDisplayName}
          </Typography>
          <Typography variant="caption" sx={{ color: '#64748B' }}>
            {userEmail}
          </Typography>
        </Box>
        <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.07)' }} />
        <MenuItem onClick={() => { handleMenuClose(); navigate('/profile'); }} sx={{ py: 1, fontSize: '0.85rem' }}>
          <ListItemIcon><PersonIcon fontSize="small" sx={{ color: '#94A3B8' }} /></ListItemIcon>
          โปรไฟล์ส่วนตัว
        </MenuItem>
        <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.07)' }} />
        <MenuItem onClick={handleLogout} sx={{ py: 1, fontSize: '0.85rem', color: '#F43F5E' }}>
          <ListItemIcon><LogoutIcon fontSize="small" sx={{ color: '#F43F5E' }} /></ListItemIcon>
          ออกจากระบบ
        </MenuItem>
      </Menu>

      {/* Drawer */}
      <Box component="nav" sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: DRAWER_WIDTH },
          }}
        >
          {drawerContent}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: DRAWER_WIDTH },
          }}
          open
        >
          {drawerContent}
        </Drawer>
      </Box>

      {/* Main View Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 1.5, sm: 2.5, md: 3 },
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          mt: '56px',
          minHeight: 'calc(100vh - 56px)',
          bgcolor: '#080C14',
          overflowX: 'hidden',
        }}
      >
        <Outlet />
      </Box>

      {/* Quick Add Transaction Dialog */}
      <Dialog
        open={quickAddOpen}
        onClose={() => setQuickAddOpen(false)}
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
              บันทึกรายการธุรกรรมใหม่
            </Typography>
          </Box>
          <IconButton size="small" onClick={() => setQuickAddOpen(false)} sx={{ color: '#64748B' }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ px: { xs: 2, sm: 3 }, py: 2 }}>
          {quickError && (
            <Alert severity="error" sx={{ mb: 2, bgcolor: 'rgba(244, 63, 94, 0.15)', color: '#FFB2B7', border: '1px solid rgba(244, 63, 94, 0.3)' }}>
              {quickError}
            </Alert>
          )}

          {/* Type Selector (Segmented Pill) */}
          <Box sx={{ display: 'flex', p: 0.5, bgcolor: '#0A0E16', borderRadius: '10px', mb: 2.5, border: '1px solid rgba(255, 255, 255, 0.05)' }}>
            <Button
              fullWidth
              onClick={() => handleTypeToggle('expense')}
              sx={{
                py: 0.75,
                borderRadius: '8px',
                fontSize: { xs: '0.78rem', sm: '0.85rem' },
                fontWeight: 600,
                color: quickType === 'expense' ? '#FFB2B7' : '#64748B',
                bgcolor: quickType === 'expense' ? 'rgba(244, 63, 94, 0.15)' : 'transparent',
                border: quickType === 'expense' ? '1px solid rgba(244, 63, 94, 0.3)' : '1px solid transparent',
              }}
            >
              รายจ่าย (Expense)
            </Button>
            <Button
              fullWidth
              onClick={() => handleTypeToggle('income')}
              sx={{
                py: 0.75,
                borderRadius: '8px',
                fontSize: { xs: '0.78rem', sm: '0.85rem' },
                fontWeight: 600,
                color: quickType === 'income' ? '#4EDEA3' : '#64748B',
                bgcolor: quickType === 'income' ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
                border: quickType === 'income' ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid transparent',
              }}
            >
              รายรับ (Income)
            </Button>
          </Box>

          <Box component="form" id="quick-form" onSubmit={handleQuickSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="ชื่อรายการ *"
              placeholder="เช่น ข้าวกลางวัน, ค่าเดินทาง, เงินเดือน"
              fullWidth
              size="small"
              value={quickTitle}
              onChange={(e) => setQuickTitle(e.target.value)}
              required
            />

            <TextField
              label="จำนวนเงิน (บาท) *"
              type="number"
              placeholder="0.00"
              fullWidth
              size="small"
              value={quickAmount}
              onChange={(e) => setQuickAmount(e.target.value)}
              inputProps={{ min: '0', step: '0.01' }}
              required
            />

            <TextField
              select
              label="หมวดหมู่"
              fullWidth
              size="small"
              value={quickCategoryId}
              onChange={(e) => setQuickCategoryId(e.target.value)}
              helperText={loadingCategories ? 'กำลังโหลดหมวดหมู่...' : ''}
            >
              <MuiMenuItem value="">-- ไม่ระบุหมวดหมู่ --</MuiMenuItem>
              {categories.map((c) => (
                <MuiMenuItem key={c.id} value={c.id}>
                  {c.icon ? `${c.icon} ` : ''}{c.name}
                </MuiMenuItem>
              ))}
            </TextField>

            <TextField
              label="วันที่ทำรายการ"
              type="date"
              fullWidth
              size="small"
              value={quickDate}
              onChange={(e) => setQuickDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              label="หมายเหตุเพิ่มเติม (ถ้ามี)"
              placeholder="บันทึกรายละเอียดสั้นๆ"
              multiline
              rows={2}
              fullWidth
              size="small"
              value={quickNote}
              onChange={(e) => setQuickNote(e.target.value)}
            />
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: { xs: 2, sm: 3 }, pb: 2, pt: 1, gap: 1 }}>
          <Button onClick={() => setQuickAddOpen(false)} variant="outlined" sx={{ color: '#94A3B8' }}>
            ยกเลิก
          </Button>
          <Button
            type="submit"
            form="quick-form"
            variant="contained"
            disabled={submittingQuick}
            sx={{
              bgcolor: '#6366F1',
              color: '#fff',
              fontWeight: 600,
              minWidth: { xs: 100, sm: 120 },
            }}
          >
            {submittingQuick ? <CircularProgress size={20} color="inherit" /> : 'บันทึกข้อมูล'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AppLayout;
