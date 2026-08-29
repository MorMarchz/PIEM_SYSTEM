import { Router } from 'express';
import {
  getCategories,
  getCategoryById,
} from '../controllers/category.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = Router();

// Protected Category Routes
router.get('/', authenticateToken, getCategories);
router.get('/:id', authenticateToken, getCategoryById);

export default router;
