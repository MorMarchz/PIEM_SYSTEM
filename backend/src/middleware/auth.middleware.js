import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Authentication Middleware
 * Verifies JWT Access Token from 'Authorization: Bearer <token>' Header
 * Attaches decoded user payload ({ id, email }) to req.user
 */
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Extract token after 'Bearer'

  if (!token) {
    return res.status(401).json({
      success: false,
      error_code: 'AUTH_UNAUTHORIZED',
      message: 'Access token required',
    });
  }

  const jwtSecret = process.env.JWT_SECRET || 'supersecretjwtkey_piem_system_2026';

  jwt.verify(token, jwtSecret, (err, decodedUser) => {
    if (err) {
      return res.status(401).json({
        success: false,
        error_code: 'AUTH_TOKEN_EXPIRED',
        message: 'Invalid or expired access token',
      });
    }

    // Attach decoded user payload to request (Strict Row-Level Data Isolation)
    req.user = {
      id: decodedUser.id,
      email: decodedUser.email,
    };

    next();
  });
};
