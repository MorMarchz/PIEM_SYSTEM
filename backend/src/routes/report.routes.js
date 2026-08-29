import { Router } from 'express';
import { getReportSummary } from '../controllers/dashboard.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = Router();

// Protected Report Routes
router.get('/summary', authenticateToken, getReportSummary);

export default router;
