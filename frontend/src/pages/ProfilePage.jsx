import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Alert,
  Avatar,
  CircularProgress,
  IconButton,
  InputAdornment,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/PersonRounded';
import LockIcon from '@mui/icons-material/LockRounded';
import SaveIcon from '@mui/icons-material/SaveRounded';
import BadgeIcon from '@mui/icons-material/BadgeRounded';
import ShieldPersonIcon from '@mui/icons-material/ShieldRounded';
import SensorsIcon from '@mui/icons-material/SensorsRounded';
import LanguageIcon from '@mui/icons-material/LanguageRounded';
import PaymentsIcon from '@mui/icons-material/PaymentsRounded';
import Visibility from '@mui/icons-material/VisibilityRounded';
import VisibilityOff from '@mui/icons-material/VisibilityOffRounded';
import { useAuth } from '../context/AuthContext';
import { APP_VERSION } from '../config/version';
import api from '../services/api';

const ProfilePage = () => {
  const { user, checkAuthStatus } = useAuth();

  // Profile Form State
  const [displayName, setDisplayName] = useState(user?.display_name || '');
  const [submittingProfile, setSubmittingProfile] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');

  // Password Form State
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [submittingPassword, setSubmittingPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const userDisplayName = user?.display_name || 'March';
  const userEmail = user?.email || 'sorawich0027@gmail.com';
  const userInitial = userDisplayName.charAt(0).toUpperCase();

  // Handle Edit Profile Submission
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!displayName.trim()) {
      setProfileError('กรุณาระบุชื่อที่ต้องการแสดง');
      return;
    }

    setSubmittingProfile(true);
    setProfileSuccess('');
    setProfileError('');

    try {
      const response = await api.patch('/users/me', { display_name: displayName.trim() });
      if (response.data?.success) {
        setProfileSuccess('✓ บันทึกข้อมูลส่วนตัวเรียบร้อยแล้ว');
        await checkAuthStatus();
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'เกิดข้อผิดพลาดในการอัปเดตโปรไฟล์';
      setProfileError(msg);
    } finally {
      setSubmittingProfile(false);
    }
  };

  // Handle Password Change Submission
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    const { current_password, new_password, confirm_password } = passwordData;

    if (!current_password || !new_password || !confirm_password) {
      setPasswordError('กรุณากรอกรหัสผ่านให้ครบถ้วนทุกช่อง');
      return;
    }

    if (new_password.length < 8) {
      setPasswordError('รหัสผ่านใหม่ต้องมีความยาวอย่างน้อย 8 ตัวอักษร');
      return;
    }

    if (new_password !== confirm_password) {
      setPasswordError('รหัสผ่านใหม่และยืนยันรหัสผ่านไม่ตรงกัน');
      return;
    }

    setSubmittingPassword(true);
    setPasswordSuccess('');
    setPasswordError('');

    try {
      const response = await api.patch('/users/me/password', {
        current_password,
        new_password,
      });

      if (response.data?.success) {
        setPasswordSuccess('✓ เปลี่ยนรหัสผ่านสำเร็จแล้ว!');
        setPasswordData({ current_password: '', new_password: '', confirm_password: '' });
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน';
      setPasswordError(msg);
    } finally {
      setSubmittingPassword(false);
    }
  };

  return (
    <Box sx={{ pb: { xs: 5, md: 8 }, maxWidth: 860, mx: 'auto' }}>
      {/* Header Section */}
      <Box sx={{ pt: 1, pb: 2.5, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="caption" sx={{ color: '#6366F1', fontWeight: 700, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            User Account
          </Typography>
          <Typography variant="caption" sx={{ color: '#475569' }}>•</Typography>
          <Typography variant="caption" sx={{ color: '#94A3B8', fontWeight: 600, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Identity & Authentication
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, flexDirection: { xs: 'column', sm: 'row' }, gap: 1.5 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#F1F5F9', fontSize: { xs: '1.25rem', sm: '1.45rem' }, letterSpacing: '-0.02em' }}>
            โปรไฟล์ส่วนตัว
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 1.5, py: 0.4, borderRadius: '9999px', bgcolor: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
            <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#10B981', boxShadow: '0 0 6px #10B981' }} />
            <Typography variant="caption" sx={{ color: '#94A3B8', fontSize: '0.72rem', fontWeight: 500 }}>
              เซสชันปัจจุบันเข้ารหัสแบบ End-to-End
            </Typography>
          </Box>
        </Box>
        <Typography variant="body2" sx={{ color: '#94A3B8', fontSize: { xs: '0.78rem', sm: '0.85rem' } }}>
          จัดการข้อมูลบัญชีผู้ใช้และการตั้งค่าความปลอดภัย
        </Typography>
      </Box>

      {/* Profile Overview Card */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 3 },
          mb: 3,
          bgcolor: '#131C2E',
          borderRadius: '14px',
          border: '1px solid rgba(255, 255, 255, 0.07)',
          boxShadow: 'inset 0 1px 0 0 rgba(255, 255, 255, 0.05)',
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'flex-start', sm: 'center' }, justifyContent: 'space-between', gap: 2 }}>
          {/* Left: Avatar & Meta */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ position: 'relative', flexShrink: 0 }}>
              <Avatar sx={{ bgcolor: '#6366F1', color: '#fff', width: { xs: 48, sm: 56 }, height: { xs: 48, sm: 56 }, fontSize: { xs: '1.25rem', sm: '1.5rem' }, fontWeight: 700, boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)' }}>
                {userInitial}
              </Avatar>
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  bgcolor: '#10B981',
                  border: '2px solid #131C2E',
                  boxShadow: '0 0 8px rgba(16, 185, 129, 0.6)',
                }}
              />
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#F1F5F9', fontSize: { xs: '1rem', sm: '1.15rem' } }}>
                  {userDisplayName}
                </Typography>
                <Box sx={{ px: 0.75, py: 0.15, borderRadius: '4px', bgcolor: 'rgba(99, 102, 241, 0.15)', color: '#C0C1FF', fontSize: '0.625rem', fontWeight: 700, textTransform: 'uppercase' }}>
                  System Admin
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                <Typography variant="caption" className="tabular-nums" sx={{ color: '#94A3B8', fontSize: '0.75rem' }}>
                  {userEmail}
                </Typography>
                <Typography variant="caption" sx={{ color: '#475569', display: { xs: 'none', sm: 'inline' } }}>•</Typography>
                <Box sx={{ px: 1, py: 0.1, borderRadius: '9999px', bgcolor: 'rgba(16, 185, 129, 0.12)', color: '#4EDEA3', fontSize: '0.65rem', fontWeight: 600 }}>
                  Pro Plan
                </Box>
              </Box>
            </Box>
          </Box>

          {/* Right: Diagnostics */}
          <Box sx={{ display: 'flex', flexDirection: { xs: 'row', sm: 'column' }, alignItems: { xs: 'center', sm: 'flex-end' }, justifyContent: 'space-between', width: { xs: '100%', sm: 'auto' }, gap: 1, pt: { xs: 1, sm: 0 }, borderTop: { xs: '1px solid rgba(255, 255, 255, 0.05)', sm: 'none' } }}>
            <Box sx={{ px: 1, py: 0.2, borderRadius: '4px', bgcolor: '#222D42', color: '#94A3B8', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase' }}>
              App {APP_VERSION}
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, color: '#64748B', fontSize: '0.72rem' }}>
              <SensorsIcon sx={{ color: '#10B981', fontSize: 14 }} />
              <span>Bangkok TH <Typography component="span" sx={{ color: '#10B981', fontSize: '0.72rem', fontWeight: 600 }}>(14ms)</Typography></span>
            </Box>
          </Box>
        </Box>
      </Paper>

      {/* Main Content Panels */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Section 01: Edit Personal Information */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, sm: 3 },
            bgcolor: '#131C2E',
            borderRadius: '14px',
            border: '1px solid rgba(255, 255, 255, 0.07)',
            boxShadow: 'inset 0 1px 0 0 rgba(255, 255, 255, 0.05)',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 2, borderBottom: '1px solid rgba(255, 255, 255, 0.05)', mb: 2.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
              <Box sx={{ width: 32, height: 32, borderRadius: '8px', bgcolor: 'rgba(99, 102, 241, 0.15)', color: '#C0C1FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <BadgeIcon sx={{ fontSize: 18 }} />
              </Box>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#F1F5F9', fontSize: { xs: '0.9rem', sm: '0.95rem' } }}>
                  แก้ไขข้อมูลส่วนตัว
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748B', fontSize: '0.7rem' }}>
                  Personal Information
                </Typography>
              </Box>
            </Box>
            <Box sx={{ px: 1, py: 0.25, borderRadius: '4px', bgcolor: '#0A0E16', color: '#64748B', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase' }}>
              Section 01
            </Box>
          </Box>

          {profileSuccess && (
            <Alert severity="success" sx={{ mb: 2, bgcolor: 'rgba(16, 185, 129, 0.15)', color: '#4EDEA3', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
              {profileSuccess}
            </Alert>
          )}

          {profileError && (
            <Alert severity="error" sx={{ mb: 2, bgcolor: 'rgba(244, 63, 94, 0.15)', color: '#FFB2B7', border: '1px solid rgba(244, 63, 94, 0.3)' }}>
              {profileError}
            </Alert>
          )}

          <Box component="form" onSubmit={handleProfileSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Readonly Email */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="caption" sx={{ color: '#94A3B8', fontWeight: 600, fontSize: '0.78rem' }}>
                  อีเมล <Typography component="span" sx={{ color: '#64748B', fontSize: '0.7rem' }}>(แสดงอย่างเดียว)</Typography>
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748B', fontSize: '0.625rem', textTransform: 'uppercase' }}>
                  Primary ID
                </Typography>
              </Box>
              <TextField
                size="small"
                fullWidth
                value={userEmail}
                InputProps={{
                  readOnly: true,
                  endAdornment: (
                    <InputAdornment position="end">
                      <LockIcon sx={{ color: '#64748B', fontSize: 18 }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor: '#0A0E16',
                    color: '#64748B',
                    fontFamily: 'monospace',
                  },
                }}
              />
            </Box>

            {/* Display Name */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
              <Typography variant="caption" sx={{ color: '#94A3B8', fontWeight: 600, fontSize: '0.78rem' }}>
                ชื่อที่ต้องการแสดง (Display Name)
              </Typography>
              <TextField
                size="small"
                fullWidth
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="ชื่อของคุณ"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <PersonIcon sx={{ color: '#64748B', fontSize: 18 }} />
                    </InputAdornment>
                  ),
                }}
              />
              <Typography variant="caption" sx={{ color: '#64748B', fontSize: '0.7rem' }}>
                ชื่อนี้จะปรากฏบนบันทึกธุรกรรม ประวัติการนำส่งรายงาน และแดชบอร์ด
              </Typography>
            </Box>

            {/* Preferences Mini Cards */}
            <Grid container spacing={1.5}>
              <Grid item xs={12} sm={6}>
                <Box sx={{ p: 1.25, borderRadius: '10px', bgcolor: '#0A0E16', border: '1px solid rgba(255, 255, 255, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LanguageIcon sx={{ color: '#6366F1', fontSize: 18 }} />
                    <Typography variant="body2" sx={{ color: '#F1F5F9', fontSize: '0.8rem' }}>
                      ภาษาอินเทอร์เฟซ
                    </Typography>
                  </Box>
                  <Box sx={{ px: 1, py: 0.2, borderRadius: '4px', bgcolor: '#1E293B', color: '#F1F5F9', fontSize: '0.7rem', fontWeight: 600 }}>
                    ไทย (TH)
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ p: 1.25, borderRadius: '10px', bgcolor: '#0A0E16', border: '1px solid rgba(255, 255, 255, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PaymentsIcon sx={{ color: '#10B981', fontSize: 18 }} />
                    <Typography variant="body2" sx={{ color: '#F1F5F9', fontSize: '0.8rem' }}>
                      สกุลเงินหลัก
                    </Typography>
                  </Box>
                  <Box sx={{ px: 1, py: 0.2, borderRadius: '4px', bgcolor: '#1E293B', color: '#4EDEA3', fontSize: '0.7rem', fontWeight: 700 }}>
                    THB (฿)
                  </Box>
                </Box>
              </Grid>
            </Grid>

            {/* Save Button */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 1 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={submittingProfile}
                startIcon={<SaveIcon sx={{ fontSize: 18 }} />}
                sx={{
                  height: 36,
                  fontSize: '0.825rem',
                  fontWeight: 600,
                  px: 2.5,
                  width: { xs: '100%', sm: 'auto' },
                }}
              >
                {submittingProfile ? <CircularProgress size={20} color="inherit" /> : 'บันทึกข้อมูล'}
              </Button>
            </Box>
          </Box>
        </Paper>

        {/* Section 02: Change Password */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, sm: 3 },
            bgcolor: '#131C2E',
            borderRadius: '14px',
            border: '1px solid rgba(255, 255, 255, 0.07)',
            boxShadow: 'inset 0 1px 0 0 rgba(255, 255, 255, 0.05)',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 2, borderBottom: '1px solid rgba(255, 255, 255, 0.05)', mb: 2.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
              <Box sx={{ width: 32, height: 32, borderRadius: '8px', bgcolor: 'rgba(244, 63, 94, 0.15)', color: '#FFB2B7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShieldPersonIcon sx={{ fontSize: 18 }} />
              </Box>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#F1F5F9', fontSize: { xs: '0.9rem', sm: '0.95rem' } }}>
                  เปลี่ยนรหัสผ่าน
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748B', fontSize: '0.7rem' }}>
                  Security & Authentication
                </Typography>
              </Box>
            </Box>
            <Box sx={{ px: 1, py: 0.25, borderRadius: '4px', bgcolor: '#0A0E16', color: '#64748B', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase' }}>
              Section 02
            </Box>
          </Box>

          {passwordSuccess && (
            <Alert severity="success" sx={{ mb: 2, bgcolor: 'rgba(16, 185, 129, 0.15)', color: '#4EDEA3', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
              {passwordSuccess}
            </Alert>
          )}

          {passwordError && (
            <Alert severity="error" sx={{ mb: 2, bgcolor: 'rgba(244, 63, 94, 0.15)', color: '#FFB2B7', border: '1px solid rgba(244, 63, 94, 0.3)' }}>
              {passwordError}
            </Alert>
          )}

          <Box component="form" onSubmit={handlePasswordSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="รหัสผ่านปัจจุบัน *"
              type={showCurrentPassword ? 'text' : 'password'}
              size="small"
              fullWidth
              value={passwordData.current_password}
              onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setShowCurrentPassword(!showCurrentPassword)} sx={{ color: '#64748B' }}>
                      {showCurrentPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              required
            />

            <TextField
              label="รหัสผ่านใหม่ (อย่างน้อย 8 ตัวอักษร) *"
              type={showNewPassword ? 'text' : 'password'}
              size="small"
              fullWidth
              value={passwordData.new_password}
              onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setShowNewPassword(!showNewPassword)} sx={{ color: '#64748B' }}>
                      {showNewPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              required
            />

            <TextField
              label="ยืนยันรหัสผ่านใหม่ *"
              type="password"
              size="small"
              fullWidth
              value={passwordData.confirm_password}
              onChange={(e) => setPasswordData({ ...passwordData, confirm_password: e.target.value })}
              required
            />

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 1 }}>
              <Button
                type="submit"
                variant="contained"
                disabled={submittingPassword}
                sx={{
                  height: 36,
                  fontSize: '0.825rem',
                  fontWeight: 600,
                  px: 2.5,
                  width: { xs: '100%', sm: 'auto' },
                  bgcolor: '#F43F5E',
                  color: '#fff',
                  '&:hover': { bgcolor: '#E11D48' },
                }}
              >
                {submittingPassword ? <CircularProgress size={20} color="inherit" /> : 'เปลี่ยนรหัสผ่าน'}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default ProfilePage;
