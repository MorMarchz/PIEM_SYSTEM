import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import pool, { checkDbConnection } from './config/db.js';
import { notFoundHandler, errorHandler } from './middleware/error.middleware.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Core Middlewares
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
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

// Root API Endpoint Info
app.get('/api/v1', (req, res) => {
  res.json({
    success: true,
    message: 'Personal Income & Expense Management System API v1',
    version: '1.0.0',
  });
});

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
