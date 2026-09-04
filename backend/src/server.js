import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import pool, { checkDbConnection } from './config/db.js';
import { notFoundHandler, errorHandler } from './middleware/error.middleware.js';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import categoryRoutes from './routes/category.routes.js';
import transactionRoutes from './routes/transaction.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';
import reportRoutes from './routes/report.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Core Middlewares
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:5173',
  'https://piem-system.vercel.app',
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. mobile apps, curl, Postman)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Healthcheck Endpoint
app.get('/api/health', async (req, res) => {
  const dbCheck = await checkDbConnection();
  
  res.status(dbCheck.connected ? 200 : 503).json({
    success: dbCheck.connected,
    message: dbCheck.connected ? 'PIEM Backend API Service is healthy' : 'Database connection unavailable',
    timestamp: new Date().toISOString(),
    db_status: dbCheck.connected ? 'connected' : 'disconnected',
    ...(dbCheck.error && { db_error: dbCheck.error }),
  });
});

// API v1 Routes
app.get('/api/v1', (req, res) => {
  res.json({
    success: true,
    message: 'Personal Income & Expense Management System API v1',
    version: '1.0.0',
  });
});

// Module Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/transactions', transactionRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);
app.use('/api/v1/reports', reportRoutes);

import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicPath = path.join(__dirname, '../public');

// Serve Static Frontend Assets & SPA Fallback in Production Mode
if (fs.existsSync(publicPath)) {
  app.use(express.static(publicPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(publicPath, 'index.html'));
  });
}

// Fallback Handlers
app.use(notFoundHandler);
app.use(errorHandler);

// Start Express Server
app.listen(PORT, () => {
  console.log(`==================================================`);
  console.log(`🚀 PIEM Backend Server running on port ${PORT}`);
  console.log(`🏥 Health Check URL: http://localhost:${PORT}/api/health`);
  console.log(`==================================================`);
});

export default app;
