import { Router } from 'express';
import {
  getDashboardSummary,
  getDashboardCharts,
} from '../controllers/dashboard.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = Router();

// Protected Dashboard Routes
router.get('/summary', authenticateToken, getDashboardSummary);
router.get('/charts', authenticateToken, getDashboardCharts);

export default router;
