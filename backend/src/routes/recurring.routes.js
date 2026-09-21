import express from 'express';
import {
  getRecurringList,
  createRecurring,
  updateRecurring,
  deleteRecurring,
} from '../controllers/recurring.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = express.Router();

// Apply auth middleware to all recurring routes
router.use(authenticateToken);

router.get('/', getRecurringList);
router.post('/', createRecurring);
router.patch('/:id', updateRecurring);
router.delete('/:id', deleteRecurring);

export default router;
