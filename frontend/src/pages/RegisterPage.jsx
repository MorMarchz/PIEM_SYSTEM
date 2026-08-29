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
  Avatar,
  Link,
  Container,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';
import { useAuth } from '../context/AuthContext';

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

    // Client-side Validations
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
      setSuccessMessage('สมัครสมาชิกสำเร็จแล้ว! กำลังนำคุณไปยังหน้าเข้าสู่ระบบ...');
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
        bgcolor: '#0F172A',
        backgroundImage: 'radial-gradient(circle at 50% 20%, rgba(236, 72, 153, 0.15) 0%, transparent 60%)',
        p: 2,
      }}
    >
      <Container maxWidth="xs">
        <Paper
          elevation={12}
          sx={{
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            background: 'rgba(30, 41, 59, 0.85)',
            backdropFilter: 'blur(16px)',
            borderRadius: 4,
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)',
          }}
        >
          {/* Logo & Header */}
          <Avatar
            sx={{
              m: 1,
              bgcolor: 'secondary.main',
              width: 52,
              height: 52,
              boxShadow: '0 6px 20px rgba(236, 72, 153, 0.5)',
            }}
          >
            <PersonAddOutlinedIcon fontSize="large" />
          </Avatar>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#F8FAFC', mt: 1 }}>
            สมัครสมาชิกใหม่
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3, textAlign: 'center' }}>
            สร้างบัญชีใช้งานเพื่อเริ่มต้นบันทึกการเงินส่วนบุคคล
          </Typography>

          {/* Alert Messages */}
          {errorMessage && (
            <Alert severity="error" sx={{ width: '100%', mb: 2, borderRadius: 2 }}>
              {errorMessage}
            </Alert>
          )}
          {successMessage && (
            <Alert severity="success" sx={{ width: '100%', mb: 2, borderRadius: 2 }}>
              {successMessage}
            </Alert>
          )}

          {/* Register Form */}
          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            <TextField
              margin="dense"
              required
              fullWidth
              id="display_name"
              label="ชื่อที่ต้องการแสดง (Display Name)"
              name="display_name"
              autoFocus
              value={formData.display_name}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonOutlineIcon color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              required
              fullWidth
              id="email"
              label="อีเมล (Email)"
              name="email"
              type="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailOutlinedIcon color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              required
              fullWidth
              name="password"
              label="รหัสผ่าน (อย่างน้อย 8 ตัวอักษร)"
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={formData.password}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlinedIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              required
              fullWidth
              name="confirm_password"
              label="ยืนยันรหัสผ่าน (Confirm Password)"
              type={showPassword ? 'text' : 'password'}
              id="confirm_password"
              value={formData.confirm_password}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlinedIcon color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 3 }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={submitting}
              sx={{
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 600,
                borderRadius: 2.5,
                background: 'linear-gradient(135deg, #EC4899 0%, #DB2777 100%)',
                boxShadow: '0 4px 14px rgba(236, 72, 153, 0.4)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #DB2777 0%, #BE185D 100%)',
                },
              }}
            >
              {submitting ? <CircularProgress size={26} color="inherit" /> : 'ลงทะเบียนสมัครสมาชิก'}
            </Button>

            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                มีบัญชีใช้งานอยู่แล้วใช่หรือไม่?{' '}
                <Link
                  component={RouterLink}
                  to="/login"
                  underline="hover"
                  sx={{ color: 'secondary.light', fontWeight: 600 }}
                >
                  เข้าสู่ระบบที่นี่
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default RegisterPage;
