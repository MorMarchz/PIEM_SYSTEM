import { Router } from 'express';
import {
  getProfile,
  updateProfile,
  updatePassword,
} from '../controllers/user.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = Router();

// Protected User Profile Routes
router.get('/me', authenticateToken, getProfile);
router.patch('/me', authenticateToken, updateProfile);
router.patch('/me/password', authenticateToken, updatePassword);

export default router;
