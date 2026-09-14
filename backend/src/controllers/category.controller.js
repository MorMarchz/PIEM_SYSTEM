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

/**
 * POST /api/v1/categories
 * Create a new category
 */
export const createCategory = async (req, res, next) => {
  try {
    const { name, type, icon, color } = req.body;

    if (!name || !type) {
      return res.status(400).json({
        success: false,
        error_code: 'VALIDATION_ERROR',
        message: 'ชื่อหมวดหมู่และประเภทเป็นข้อมูลที่จำเป็น',
      });
    }

    const lowerType = type.toLowerCase();
    if (lowerType !== 'income' && lowerType !== 'expense') {
      return res.status(400).json({
        success: false,
        error_code: 'VALIDATION_ERROR',
        message: 'ประเภทหมวดหมู่ต้องเป็น income หรือ expense เท่านั้น',
      });
    }

    const [result] = await pool.query(
      'INSERT INTO categories (name, type, icon, color) VALUES (?, ?, ?, ?)',
      [name.trim(), lowerType, icon || 'MoreHoriz', color || '#6B7280']
    );

    const [newCategory] = await pool.query(
      'SELECT id, name, type, icon, color, created_at FROM categories WHERE id = ?',
      [result.insertId]
    );

    return res.status(201).json({
      success: true,
      message: 'สร้างหมวดหมู่ใหม่เรียบร้อยแล้ว',
      data: newCategory[0],
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/v1/categories/:id
 * Update an existing category
 */
export const updateCategory = async (req, res, next) => {
  try {
    const categoryId = parseInt(req.params.id, 10);
    if (isNaN(categoryId) || categoryId <= 0) {
      return res.status(400).json({
        success: false,
        error_code: 'VALIDATION_ERROR',
        message: 'Invalid category ID',
      });
    }

    const { name, type, icon, color } = req.body;

    const [existing] = await pool.query('SELECT id FROM categories WHERE id = ?', [categoryId]);
    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        error_code: 'CATEGORY_NOT_FOUND',
        message: 'ไม่พบหมวดหมู่ที่ต้องการแก้ไข',
      });
    }

    const fields = [];
    const params = [];

    if (name) { fields.push('name = ?'); params.push(name.trim()); }
    if (type) {
      const lowerType = type.toLowerCase();
      if (lowerType !== 'income' && lowerType !== 'expense') {
        return res.status(400).json({
          success: false,
          error_code: 'VALIDATION_ERROR',
          message: 'ประเภทหมวดหมู่ต้องเป็น income หรือ expense เท่านั้น',
        });
      }
      fields.push('type = ?');
      params.push(lowerType);
    }
    if (icon !== undefined) { fields.push('icon = ?'); params.push(icon); }
    if (color !== undefined) { fields.push('color = ?'); params.push(color); }

    if (fields.length === 0) {
      return res.status(400).json({
        success: false,
        error_code: 'VALIDATION_ERROR',
        message: 'ไม่มีข้อมูลที่ต้องการอัปเดต',
      });
    }

    params.push(categoryId);
    await pool.query(`UPDATE categories SET ${fields.join(', ')} WHERE id = ?`, params);

    const [updated] = await pool.query(
      'SELECT id, name, type, icon, color, created_at FROM categories WHERE id = ?',
      [categoryId]
    );

    return res.status(200).json({
      success: true,
      message: 'อัปเดตหมวดหมู่เรียบร้อยแล้ว',
      data: updated[0],
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/v1/categories/:id
 * Delete a category (transactions.category_id set to NULL via FK ON DELETE SET NULL)
 */
export const deleteCategory = async (req, res, next) => {
  try {
    const categoryId = parseInt(req.params.id, 10);
    if (isNaN(categoryId) || categoryId <= 0) {
      return res.status(400).json({
        success: false,
        error_code: 'VALIDATION_ERROR',
        message: 'Invalid category ID',
      });
    }

    const [existing] = await pool.query('SELECT id, name FROM categories WHERE id = ?', [categoryId]);
    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        error_code: 'CATEGORY_NOT_FOUND',
        message: 'ไม่พบหมวดหมู่ที่ต้องการลบ',
      });
    }

    await pool.query('DELETE FROM categories WHERE id = ?', [categoryId]);

    return res.status(200).json({
      success: true,
      message: `ลบหมวดหมู่ "${existing[0].name}" เรียบร้อยแล้ว`,
    });
  } catch (error) {
    next(error);
  }
};
