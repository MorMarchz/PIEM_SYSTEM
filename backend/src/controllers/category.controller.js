import pool from '../config/db.js';

/**
 * GET /api/v1/categories
 * Get list of financial categories (optional filter by type=income|expense)
 */
export const getCategories = async (req, res, next) => {
  try {
    const { type } = req.query;

    let query = 'SELECT id, name, type, icon, color, created_at FROM categories';
    const params = [];

    if (type) {
      const lowerType = type.toLowerCase();
      if (lowerType !== 'income' && lowerType !== 'expense') {
        return res.status(400).json({
          success: false,
          error_code: 'VALIDATION_ERROR',
          message: 'Category type filter must be either "income" or "expense"',
        });
      }
      query += ' WHERE type = ?';
      params.push(lowerType);
    }

    query += ' ORDER BY type ASC, id ASC';

    const [categories] = await pool.query(query, params);

    return res.status(200).json({
      success: true,
      message: 'Categories retrieved successfully',
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/v1/categories/:id
 * Get single category details by ID
 */
export const getCategoryById = async (req, res, next) => {
  try {
    const categoryId = parseInt(req.params.id, 10);

    if (isNaN(categoryId) || categoryId <= 0) {
      return res.status(400).json({
        success: false,
        error_code: 'VALIDATION_ERROR',
        message: 'Invalid category ID',
      });
    }

    const [categories] = await pool.query(
      'SELECT id, name, type, icon, color, created_at FROM categories WHERE id = ? LIMIT 1',
      [categoryId]
    );

    if (categories.length === 0) {
      return res.status(404).json({
        success: false,
        error_code: 'CATEGORY_NOT_FOUND',
        message: 'Category not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Category retrieved successfully',
      data: categories[0],
    });
  } catch (error) {
    next(error);
  }
};
