import bcrypt from 'bcryptjs';
import pool from '../config/db.js';

/**
 * GET /api/v1/users/me
 * Get current authenticated user profile
 */
export const getProfile = async (req, res, next) => {
  try {
    const userId = req.user.id; // Injected by authenticateToken middleware

    const [users] = await pool.query(
      'SELECT id, email, display_name, created_at, updated_at FROM users WHERE id = ? LIMIT 1',
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
      message: 'Profile retrieved successfully',
      data: {
        user_id: user.id,
        email: user.email,
        display_name: user.display_name,
        created_at: user.created_at,
        updated_at: user.updated_at,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/v1/users/me
 * Update current authenticated user profile (display_name)
 */
export const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user.id; // Injected by authenticateToken middleware
    const { display_name } = req.body;

    if (!display_name || typeof display_name !== 'string' || display_name.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error_code: 'VALIDATION_ERROR',
        message: 'display_name is required and must be a valid string',
      });
    }

    const trimmedDisplayName = display_name.trim();
    if (trimmedDisplayName.length > 100) {
      return res.status(400).json({
        success: false,
        error_code: 'VALIDATION_ERROR',
        message: 'display_name must not exceed 100 characters',
      });
    }

    // Update user profile in database
    const [result] = await pool.query(
      'UPDATE users SET display_name = ? WHERE id = ?',
      [trimmedDisplayName, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error_code: 'USER_NOT_FOUND',
        message: 'User account not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user_id: userId,
        display_name: trimmedDisplayName,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/v1/users/me/password
 * Change password for current authenticated user
 */
export const updatePassword = async (req, res, next) => {
  try {
    const userId = req.user.id; // Injected by authenticateToken middleware
    const { current_password, new_password } = req.body;

    if (!current_password || !new_password) {
      return res.status(400).json({
        success: false,
        error_code: 'VALIDATION_ERROR',
        message: 'Both current_password and new_password are required',
      });
    }

    if (typeof new_password !== 'string' || new_password.length < 8) {
      return res.status(400).json({
        success: false,
        error_code: 'VALIDATION_ERROR',
        message: 'new_password must be at least 8 characters long',
      });
    }

    // Fetch user password_hash
    const [users] = await pool.query(
      'SELECT password_hash FROM users WHERE id = ? LIMIT 1',
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

    // Verify current_password
    const isPasswordValid = await bcrypt.compare(current_password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        error_code: 'INVALID_CURRENT_PASSWORD',
        message: 'Current password is incorrect',
      });
    }

    // Hash new password and update database
    const newPasswordHash = await bcrypt.hash(new_password, 10);
    await pool.query(
      'UPDATE users SET password_hash = ? WHERE id = ?',
      [newPasswordHash, userId]
    );

    return res.status(200).json({
      success: true,
      message: 'Password updated successfully',
    });
  } catch (error) {
    next(error);
  }
};
