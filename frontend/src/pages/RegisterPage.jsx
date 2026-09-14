import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  IconButton,
  InputAdornment,
  CircularProgress,
  Link,
  Container,
} from '@mui/material';
import Visibility from '@mui/icons-material/VisibilityRounded';
import VisibilityOff from '@mui/icons-material/VisibilityOffRounded';
import PersonOutlineIcon from '@mui/icons-material/PersonOutlineRounded';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWalletRounded';
import { useAuth } from '../context/AuthContext';
import { APP_VERSION } from '../config/version';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    display_name: '',
    email: '',
    password: '',
    confirm_password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errorMessage) setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { display_name, email, password, confirm_password } = formData;

    if (!display_name.trim() || !email || !password || !confirm_password) {
      setErrorMessage('กรุณากรอกข้อมูลให้ครบถ้วนทุกช่อง');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage('รูปแบบอีเมลไม่ถูกต้อง');
      return;
    }

    if (password.length < 8) {
      setErrorMessage('รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร');
      return;
    }

    if (password !== confirm_password) {
      setErrorMessage('รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน');
      return;
    }

    setSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    const result = await register(email, password, display_name.trim());
    setSubmitting(false);

    if (result.success) {
      setSuccessMessage('✓ สมัครสมาชิกสำเร็จแล้ว! กำลังนำคุณไปยังหน้าเข้าสู่ระบบ...');
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } else {
      setErrorMessage(result.message || 'เกิดข้อผิดพลาดในการสมัครสมาชิก');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#080C14',
        position: 'relative',
        overflow: 'hidden',
        p: 2,
      }}
    >
      {/* Ambient background glow */}
      <Box
        sx={{
          position: 'absolute',
          top: '20%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 500,
          height: 350,
          borderRadius: '50%',
          bgcolor: 'rgba(16, 185, 129, 0.1)',
          filter: 'blur(90px)',
          pointerEvents: 'none',
        }}
      />

      <Container maxWidth="xs" sx={{ position: 'relative', zIndex: 1 }}>
        <Paper
          elevation={0}
          sx={{
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            bgcolor: '#131C2E',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow: '0 24px 60px rgba(0, 0, 0, 0.8), inset 0 1px 0 0 rgba(255, 255, 255, 0.06)',
          }}
        >
          {/* Logo & Header */}
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: '12px',
              bgcolor: '#10B981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 24px rgba(16, 185, 129, 0.4)',
              mb: 2,
            }}
          >
            <AccountBalanceWalletIcon sx={{ color: '#002113', fontSize: 26 }} />
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#F1F5F9', letterSpacing: '-0.02em' }}>
              สมัครสมาชิกใหม่
            </Typography>
          </Box>

          <Typography variant="body2" sx={{ color: '#94A3B8', mb: 3, textAlign: 'center', fontSize: '0.85rem' }}>
            สร้างบัญชีใช้งานเพื่อเริ่มต้นบันทึกการเงินส่วนบุคคล
          </Typography>

          {/* Alert Messages */}
          {errorMessage && (
            <Alert severity="error" sx={{ width: '100%', mb: 2, bgcolor: 'rgba(244, 63, 94, 0.15)', color: '#FFB2B7', border: '1px solid rgba(244, 63, 94, 0.3)', borderRadius: '10px' }}>
              {errorMessage}
            </Alert>
          )}

          {successMessage && (
            <Alert severity="success" sx={{ width: '100%', mb: 2, bgcolor: 'rgba(16, 185, 129, 0.15)', color: '#4EDEA3', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '10px' }}>
              {successMessage}
            </Alert>
          )}

          {/* Register Form */}
          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              required
              fullWidth
              id="display_name"
              label="ชื่อที่ต้องการแสดง (Display Name)"
              name="display_name"
              autoFocus
              size="small"
              value={formData.display_name}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonOutlineIcon sx={{ color: '#64748B', fontSize: 18 }} />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              required
              fullWidth
              id="email"
              label="อีเมล (Email)"
              name="email"
              autoComplete="email"
              size="small"
              value={formData.email}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailOutlinedIcon sx={{ color: '#64748B', fontSize: 18 }} />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              required
              fullWidth
              name="password"
              label="รหัสผ่าน (อย่างน้อย 8 ตัวอักษร)"
              type={showPassword ? 'text' : 'password'}
              id="password"
              size="small"
              value={formData.password}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlinedIcon sx={{ color: '#64748B', fontSize: 18 }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      size="small"
                      sx={{ color: '#64748B' }}
                    >
                      {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              required
              fullWidth
              name="confirm_password"
              label="ยืนยันรหัสผ่าน"
              type="password"
              id="confirm_password"
              size="small"
              value={formData.confirm_password}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlinedIcon sx={{ color: '#64748B', fontSize: 18 }} />
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={submitting}
              sx={{
                mt: 1,
                py: 1,
                fontSize: '0.875rem',
                fontWeight: 600,
              }}
            >
              {submitting ? <CircularProgress size={22} color="inherit" /> : 'สร้างบัญชีผู้ใช้'}
            </Button>

            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2 }}>
              <Typography variant="body2" sx={{ color: '#94A3B8', fontSize: '0.825rem' }}>
                มีบัญชีใช้งานอยู่แล้ว?{' '}
                <Link component={RouterLink} to="/login" sx={{ color: '#818CF8', fontWeight: 600, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                  เข้าสู่ระบบ
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>

        <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', color: '#475569', mt: 3, fontSize: '0.72rem' }}>
          PI&EM Personal Finance System • {APP_VERSION}
        </Typography>
      </Container>
    </Box>
  );
};

export default RegisterPage;
