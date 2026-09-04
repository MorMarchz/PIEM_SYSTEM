import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/db.js';
import { logAuditEvent } from '../services/audit.service.js';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey_piem_system_2026';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '15m';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'supersecretrefreshkey_piem_system_2026';
const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || '7d';

/**
 * Helper to generate JWT Access Token
 */
const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

/**
 * Helper to generate JWT Refresh Token
 */
const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email },
    REFRESH_TOKEN_SECRET,
    { expiresIn: REFRESH_TOKEN_EXPIRES_IN }
  );
};

/**
 * POST /api/v1/auth/register
 * Register a new user account
 */
export const register = async (req, res, next) => {
  try {
    const { email, password, display_name } = req.body;

    // 1. Validation
    if (!email || !password || !display_name) {
      return res.status(400).json({
        success: false,
        error_code: 'VALIDATION_ERROR',
        message: 'Email, password, and display_name are required',
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error_code: 'VALIDATION_ERROR',
        message: 'Invalid email format',
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        error_code: 'VALIDATION_ERROR',
        message: 'Password must be at least 8 characters long',
      });
    }

    // 2. Check existing email
    const [existingUsers] = await pool.query(
      'SELECT id FROM users WHERE LOWER(email) = LOWER(?) LIMIT 1',
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(409).json({
        success: false,
        error_code: 'EMAIL_ALREADY_EXISTS',
        message: 'Email address is already registered',
      });
    }

    // 3. Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // 4. Insert new user
    const [result] = await pool.query(
      'INSERT INTO users (email, password_hash, display_name) VALUES (?, ?, ?)',
      [email.toLowerCase(), passwordHash, display_name.trim()]
    );

    const newUserId = result.insertId;

    // Log REGISTER Audit Event
    logAuditEvent({
      actor_user_id: newUserId,
      action: 'REGISTER',
      entity_type: 'users',
      entity_id: newUserId,
      new_value: { email: email.toLowerCase(), display_name: display_name.trim() },
      req,
    });

    return res.status(201).json({
      success: true,
      message: 'User account created successfully',
      data: {
        user_id: newUserId,
        email: email.toLowerCase(),
        display_name: display_name.trim(),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/v1/auth/login
 * User login with credentials, issues JWT access token & HTTP-Only refresh cookie
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error_code: 'VALIDATION_ERROR',
        message: 'Email and password are required',
      });
    }

    // Find user by email
    const [users] = await pool.query(
      'SELECT id, email, password_hash, display_name FROM users WHERE LOWER(email) = LOWER(?) LIMIT 1',
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        error_code: 'AUTH_INVALID_CREDENTIALS',
        message: 'Invalid email or password',
      });
    }

    const user = users[0];

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error_code: 'AUTH_INVALID_CREDENTIALS',
        message: 'Invalid email or password',
      });
    }

    // Generate Tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Set Refresh Token in HTTP-Only Cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // 'none' required for Cross-Origin (Vercel + Render)
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Log LOGIN Audit Event
    logAuditEvent({
      actor_user_id: user.id,
      action: 'LOGIN',
      entity_type: 'users',
      entity_id: user.id,
      new_value: { email: user.email },
      req,
    });

    return res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      data: {
        access_token: accessToken,
        user: {
          id: user.id,
          email: user.email,
          display_name: user.display_name,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/v1/auth/logout
 * Clear refresh token cookie and end session
 */
export const logout = async (req, res, next) => {
  try {
    const userId = req.user?.id || null;

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // 'none' required for Cross-Origin (Vercel + Render)
    });

    // Log LOGOUT Audit Event
    logAuditEvent({
      actor_user_id: userId,
      action: 'LOGOUT',
      entity_type: 'users',
      entity_id: userId,
      req,
    });

    return res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/v1/auth/me
 * Get authenticated user profile details
 */
export const getMe = async (req, res, next) => {
  try {
    const userId = req.user.id; // Extracted from authenticateToken

    const [users] = await pool.query(
      'SELECT id, email, display_name, created_at FROM users WHERE id = ? LIMIT 1',
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        error_code: 'USER_NOT_FOUND',
        message: 'User account not found',
      });
    }

    const user = users[0];

    return res.status(200).json({
      success: true,
      data: {
        user_id: user.id,
        email: user.email,
        display_name: user.display_name,
        created_at: user.created_at,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/v1/auth/refresh
 * Refresh access token using HTTP-Only refresh cookie
 */
export const refreshToken = async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        error_code: 'AUTH_UNAUTHORIZED',
        message: 'Refresh token cookie missing',
      });
    }

    jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({
          success: false,
          error_code: 'AUTH_TOKEN_EXPIRED',
          message: 'Invalid or expired refresh token',
        });
      }

      const newAccessToken = generateAccessToken({ id: decoded.id, email: decoded.email });

      return res.status(200).json({
        success: true,
        data: {
          access_token: newAccessToken,
        },
      });
    });
  } catch (error) {
    next(error);
  }
};
