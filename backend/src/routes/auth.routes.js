import { Router } from 'express';
import {
  register,
  login,
  logout,
  getMe,
  refreshToken,
} from '../controllers/auth.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = Router();

// Public Auth Routes
router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refreshToken);

// Protected Auth Routes
router.post('/logout', authenticateToken, logout);
router.get('/me', authenticateToken, getMe);

export default router;
