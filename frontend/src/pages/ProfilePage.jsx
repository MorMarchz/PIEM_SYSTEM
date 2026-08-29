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
  Divider,
  CircularProgress,
  IconButton,
  InputAdornment,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import SaveIcon from '@mui/icons-material/Save';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useAuth } from '../context/AuthContext';
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

  const userInitial = user?.display_name ? user.display_name.charAt(0).toUpperCase() : 'U';

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
        setProfileSuccess('อัปเดตข้อมูลส่วนตัวเรียบร้อยแล้ว');
        await checkAuthStatus(); // Refresh AuthContext user state
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
        setPasswordSuccess('เปลี่ยนรหัสผ่านสำเร็จแล้ว!');
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
    <Box sx={{ animation: 'fadeIn 0.3s ease-in-out', maxWidth: 800, mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#F8FAFC' }}>
          จัดการโปรไฟล์ผู้ใช้
        </Typography>
        <Typography variant="body2" color="text.secondary">
          ดูและแก้ไขข้อมูลส่วนตัว รวมถึงตั้งค่ารหัสผ่านเข้าใช้งานระบบ
        </Typography>
      </Box>

      {/* Profile Overview Header Card */}
      <Paper
        elevation={3}
        sx={{
          p: 3,
          mb: 4,
          bgcolor: '#1E293B',
          borderRadius: 3,
          border: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          gap: 3,
        }}
      >
        <Avatar
          sx={{
            width: 72,
            height: 72,
            bgcolor: 'primary.main',
            fontSize: '2rem',
            fontWeight: 700,
            boxShadow: '0 6px 20px rgba(99, 102, 241, 0.4)',
          }}
        >
          {userInitial}
        </Avatar>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#F8FAFC' }}>
            {user?.display_name || 'ผู้ใช้งาน'}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.25 }}>
            อีเมล: <span style={{ color: '#F8FAFC' }}>{user?.email}</span>
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 0.5 }}>
            สิทธิ์การใช้งาน: Standard User
          </Typography>
        </Box>
      </Paper>

      <Grid container spacing={4}>
        {/* Edit Profile Form */}
        <Grid item xs={12}>
          <Paper
            elevation={3}
            sx={{
              p: 3.5,
              bgcolor: '#1E293B',
              borderRadius: 3,
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
              <PersonIcon color="primary" />
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#F8FAFC' }}>
                แก้ไขข้อมูลส่วนตัว
              </Typography>
            </Box>
            <Divider sx={{ mb: 3, borderColor: 'rgba(255, 255, 255, 0.08)' }} />

            {profileSuccess && (
              <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>
                {profileSuccess}
              </Alert>
            )}
            {profileError && (
              <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
                {profileError}
              </Alert>
            )}

            <Box component="form" onSubmit={handleProfileSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    disabled
                    fullWidth
                    label="อีเมล (ไม่สามารถเปลี่ยนได้)"
                    value={user?.email || ''}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    label="ชื่อที่ต้องการแสดง (Display Name)"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={submittingProfile}
                    startIcon={submittingProfile ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                  >
                    {submittingProfile ? 'กำลังบันทึก...' : 'บันทึกการเปลี่ยนแปลง'}
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Grid>

        {/* Change Password Form */}
        <Grid item xs={12}>
          <Paper
            elevation={3}
            sx={{
              p: 3.5,
              bgcolor: '#1E293B',
              borderRadius: 3,
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
              <LockIcon color="secondary" />
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#F8FAFC' }}>
                เปลี่ยนรหัสผ่าน
              </Typography>
            </Box>
            <Divider sx={{ mb: 3, borderColor: 'rgba(255, 255, 255, 0.08)' }} />

            {passwordSuccess && (
              <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>
                {passwordSuccess}
              </Alert>
            )}
            {passwordError && (
              <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
                {passwordError}
              </Alert>
            )}

            <Box component="form" onSubmit={handlePasswordSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    label="รหัสผ่านปัจจุบัน (Current Password)"
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={passwordData.current_password}
                    onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setShowCurrentPassword(!showCurrentPassword)} edge="end">
                            {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    label="รหัสผ่านใหม่ (อย่างน้อย 8 ตัวอักษร)"
                    type={showNewPassword ? 'text' : 'password'}
                    value={passwordData.new_password}
                    onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setShowNewPassword(!showNewPassword)} edge="end">
                            {showNewPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    label="ยืนยันรหัสผ่านใหม่ (Confirm Password)"
                    type={showNewPassword ? 'text' : 'password'}
                    value={passwordData.confirm_password}
                    onChange={(e) => setPasswordData({ ...passwordData, confirm_password: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="secondary"
                    disabled={submittingPassword}
                    startIcon={submittingPassword ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                  >
                    {submittingPassword ? 'กำลังอัปเดต...' : 'เปลี่ยนรหัสผ่าน'}
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProfilePage;
