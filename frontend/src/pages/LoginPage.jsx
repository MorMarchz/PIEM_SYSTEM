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
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWalletRounded';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import { useAuth } from '../context/AuthContext';
import { APP_VERSION } from '../config/version';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errorMessage) setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setErrorMessage('กรุณากรอกอีเมลและรหัสผ่านให้ครบถ้วน');
      return;
    }

    setSubmitting(true);
    setErrorMessage('');

    const result = await login(formData.email, formData.password);
    setSubmitting(false);

    if (result.success) {
      navigate('/dashboard', { replace: true });
    } else {
      setErrorMessage(result.message || 'อีเมลหรือรหัสผ่านไม่ถูกต้อง');
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
          bgcolor: 'rgba(99, 102, 241, 0.12)',
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
              bgcolor: '#6366F1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 24px rgba(99, 102, 241, 0.45)',
              mb: 2,
            }}
          >
            <AccountBalanceWalletIcon sx={{ color: '#fff', fontSize: 26 }} />
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#F1F5F9', letterSpacing: '-0.02em' }}>
              PI&EM
            </Typography>
            <Box sx={{ px: 1, py: 0.2, borderRadius: '4px', bgcolor: 'rgba(99, 102, 241, 0.15)', color: '#C0C1FF', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase' }}>
              Console
            </Box>
          </Box>

          <Typography variant="body2" sx={{ color: '#94A3B8', mb: 3, textAlign: 'center', fontSize: '0.85rem' }}>
            เข้าสู่ระบบเพื่อจัดการและตรวจสอบข้อมูลการเงินส่วนบุคคล
          </Typography>

          {/* Alert Message */}
          {errorMessage && (
            <Alert severity="error" sx={{ width: '100%', mb: 2.5, bgcolor: 'rgba(244, 63, 94, 0.15)', color: '#FFB2B7', border: '1px solid rgba(244, 63, 94, 0.3)', borderRadius: '10px' }}>
              {errorMessage}
            </Alert>
          )}

          {/* Login Form */}
          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              required
              fullWidth
              id="email"
              label="อีเมล (Email)"
              name="email"
              autoComplete="email"
              autoFocus
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
              label="รหัสผ่าน (Password)"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
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
              {submitting ? <CircularProgress size={22} color="inherit" /> : 'เข้าสู่ระบบ'}
            </Button>

            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2 }}>
              <Typography variant="body2" sx={{ color: '#94A3B8', fontSize: '0.825rem' }}>
                ยังไม่มีบัญชีใช้งาน?{' '}
                <Link component={RouterLink} to="/register" sx={{ color: '#818CF8', fontWeight: 600, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                  สมัครสมาชิกใหม่
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

export default LoginPage;
