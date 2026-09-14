import { Router } from 'express';
import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/category.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = Router();

// Protected Category Routes
router.get('/', authenticateToken, getCategories);
router.get('/:id', authenticateToken, getCategoryById);
router.post('/', authenticateToken, createCategory);
router.patch('/:id', authenticateToken, updateCategory);
router.delete('/:id', authenticateToken, deleteCategory);

export default router;
