import pool from '../config/db.js';
import { logAuditEvent } from '../services/audit.service.js';

/**
 * Helper to fetch category by ID and check existence
 */
const getCategoryDetails = async (categoryId) => {
  const [categories] = await pool.query(
    'SELECT id, name, type, icon, color FROM categories WHERE id = ? LIMIT 1',
    [categoryId]
  );
  return categories.length > 0 ? categories[0] : null;
};

/**
 * Helper to check transaction ownership and existence
 * Returns { exists: bool, isOwner: bool, transaction: obj }
 */
const checkTransactionOwnership = async (transactionId, userId) => {
  const [rows] = await pool.query(
    'SELECT id, user_id, category_id, title, amount, type, date, note, created_at, updated_at FROM transactions WHERE id = ? LIMIT 1',
    [transactionId]
  );

  if (rows.length === 0) {
    return { exists: false, isOwner: false, transaction: null };
  }

  const transaction = rows[0];
  const isOwner = Number(transaction.user_id) === Number(userId);
  return { exists: true, isOwner, transaction };
};

/**
 * POST /api/v1/transactions
 * Create a new income or expense transaction
 */
export const createTransaction = async (req, res, next) => {
  try {
    const userId = req.user.id; // Extracted from JWT token
    const { title, amount, type, category_id, date, note } = req.body;

    // 1. Basic Validations
    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error_code: 'VALIDATION_ERROR',
        message: 'Transaction title is required',
      });
    }

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({
        success: false,
        error_code: 'VALIDATION_ERROR',
        message: 'Transaction amount must be a positive number greater than 0',
      });
    }

    const lowerType = type ? type.toLowerCase() : '';
    if (lowerType !== 'income' && lowerType !== 'expense') {
      return res.status(400).json({
        success: false,
        error_code: 'VALIDATION_ERROR',
        message: 'Transaction type must be either "income" or "expense"',
      });
    }

    if (!date || isNaN(Date.parse(date))) {
      return res.status(400).json({
        success: false,
        error_code: 'VALIDATION_ERROR',
        message: 'Valid date (YYYY-MM-DD) is required',
      });
    }

    // 2. Category Validation if provided
    let category = null;
    let targetCategoryId = null;

    if (category_id !== undefined && category_id !== null && category_id !== '') {
      targetCategoryId = parseInt(category_id, 10);
      category = await getCategoryDetails(targetCategoryId);

      if (!category) {
        return res.status(404).json({
          success: false,
          error_code: 'CATEGORY_NOT_FOUND',
          message: 'Specified category_id does not exist',
        });
      }

      if (category.type !== lowerType) {
        return res.status(400).json({
          success: false,
          error_code: 'CATEGORY_TYPE_MISMATCH',
          message: `Category "${category.name}" is type "${category.type}", which does not match transaction type "${lowerType}"`,
        });
      }
    }

    // 3. Insert transaction
    const [result] = await pool.query(
      `INSERT INTO transactions (user_id, category_id, title, amount, type, date, note)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        targetCategoryId,
        title.trim(),
        numericAmount,
        lowerType,
        date,
        note ? note.trim() : null,
      ]
    );

    const newTransactionId = result.insertId;

    // 4. Fetch created record with category details
    const [createdRows] = await pool.query(
      `SELECT t.id, t.user_id, t.title, t.amount, t.type, t.date, t.note, t.created_at, t.updated_at,
              c.id AS cat_id, c.name AS cat_name, c.type AS cat_type, c.icon AS cat_icon, c.color AS cat_color
       FROM transactions t
       LEFT JOIN categories c ON t.category_id = c.id
       WHERE t.id = ? LIMIT 1`,
      [newTransactionId]
    );

    const row = createdRows[0];

    const createdData = {
      id: row.id,
      user_id: row.user_id,
      title: row.title,
      amount: parseFloat(row.amount),
      type: row.type,
      date: row.date,
      note: row.note,
      category: row.cat_id ? {
        id: row.cat_id,
        name: row.cat_name,
        type: row.cat_type,
        icon: row.cat_icon,
        color: row.cat_color,
      } : null,
      created_at: row.created_at,
      updated_at: row.updated_at,
    };

    // Log CREATE_TRANSACTION Audit Event
    logAuditEvent({
      actor_user_id: userId,
      action: 'CREATE_TRANSACTION',
      entity_type: 'transactions',
      entity_id: newTransactionId,
      new_value: createdData,
      req,
    });

    return res.status(201).json({
      success: true,
      message: 'Transaction created successfully',
      data: createdData,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/v1/transactions
 * Query transactions list with filters (type, category_id, date range, search) & pagination
 */
export const getTransactions = async (req, res, next) => {
  try {
    const userId = req.user.id; // Row-Level Data Isolation
    const {
      type,
      category_id,
      start_date,
      end_date,
      search,
      page = 1,
      limit = 10,
    } = req.query;

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 10));
    const offset = (pageNum - 1) * limitNum;

    // Build SQL Query conditions
    let whereClauses = ['t.user_id = ?'];
    let params = [userId];

    if (type) {
      const lowerType = type.toLowerCase();
      if (lowerType === 'income' || lowerType === 'expense') {
        whereClauses.push('t.type = ?');
        params.push(lowerType);
      }
    }

    if (category_id) {
      const catId = parseInt(category_id, 10);
      if (!isNaN(catId) && catId > 0) {
        whereClauses.push('t.category_id = ?');
        params.push(catId);
      }
    }

    if (start_date && !isNaN(Date.parse(start_date))) {
      whereClauses.push('t.date >= ?');
      params.push(start_date);
    }

    if (end_date && !isNaN(Date.parse(end_date))) {
      whereClauses.push('t.date <= ?');
      params.push(end_date);
    }

    if (search && typeof search === 'string' && search.trim().length > 0) {
      whereClauses.push('(t.title LIKE ? OR t.note LIKE ?)');
      const searchPattern = `%${search.trim()}%`;
      params.push(searchPattern, searchPattern);
    }

    const whereSql = whereClauses.join(' AND ');

    // 1. Get total count for pagination metadata
    const countSql = `SELECT COUNT(*) AS total FROM transactions t WHERE ${whereSql}`;
    const [countRows] = await pool.query(countSql, params);
    const totalItems = countRows[0].total;
    const totalPages = Math.ceil(totalItems / limitNum) || 1;

    // 2. Fetch paginated records
    const selectSql = `
      SELECT t.id, t.user_id, t.title, t.amount, t.type, t.date, t.note, t.created_at, t.updated_at,
             c.id AS cat_id, c.name AS cat_name, c.type AS cat_type, c.icon AS cat_icon, c.color AS cat_color
      FROM transactions t
      LEFT JOIN categories c ON t.category_id = c.id
      WHERE ${whereSql}
      ORDER BY t.date DESC, t.id DESC
      LIMIT ? OFFSET ?
    `;

    const selectParams = [...params, limitNum, offset];
    const [rows] = await pool.query(selectSql, selectParams);

    const formattedTransactions = rows.map((row) => ({
      id: row.id,
      user_id: row.user_id,
      title: row.title,
      amount: parseFloat(row.amount),
      type: row.type,
      date: row.date,
      note: row.note,
      category: row.cat_id ? {
        id: row.cat_id,
        name: row.cat_name,
        type: row.cat_type,
        icon: row.cat_icon,
        color: row.cat_color,
      } : null,
      created_at: row.created_at,
      updated_at: row.updated_at,
    }));

    return res.status(200).json({
      success: true,
      message: 'Transactions retrieved successfully',
      data: {
        transactions: formattedTransactions,
        pagination: {
          total_items: totalItems,
          total_pages: totalPages,
          current_page: pageNum,
          limit: limitNum,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/v1/transactions/:id
 * Get single transaction details by ID
 */
export const getTransactionById = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const transactionId = parseInt(req.params.id, 10);

    if (isNaN(transactionId) || transactionId <= 0) {
      return res.status(400).json({
        success: false,
        error_code: 'VALIDATION_ERROR',
        message: 'Invalid transaction ID',
      });
    }

    const ownership = await checkTransactionOwnership(transactionId, userId);

    if (!ownership.exists) {
      return res.status(404).json({
        success: false,
        error_code: 'TRANSACTION_NOT_FOUND',
        message: 'Transaction not found',
      });
    }

    if (!ownership.isOwner) {
      return res.status(403).json({
        success: false,
        error_code: 'FORBIDDEN_ACCESS',
        message: 'You do not have permission to view this transaction',
      });
    }

    // Fetch details with Category info
    const [rows] = await pool.query(
      `SELECT t.id, t.user_id, t.title, t.amount, t.type, t.date, t.note, t.created_at, t.updated_at,
              c.id AS cat_id, c.name AS cat_name, c.type AS cat_type, c.icon AS cat_icon, c.color AS cat_color
       FROM transactions t
       LEFT JOIN categories c ON t.category_id = c.id
       WHERE t.id = ? LIMIT 1`,
      [transactionId]
    );

    const row = rows[0];

    return res.status(200).json({
      success: true,
      message: 'Transaction retrieved successfully',
      data: {
        id: row.id,
        user_id: row.user_id,
        title: row.title,
        amount: parseFloat(row.amount),
        type: row.type,
        date: row.date,
        note: row.note,
        category: row.cat_id ? {
          id: row.cat_id,
          name: row.cat_name,
          type: row.cat_type,
          icon: row.cat_icon,
          color: row.cat_color,
        } : null,
        created_at: row.created_at,
        updated_at: row.updated_at,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/v1/transactions/:id
 * Update an existing transaction
 */
export const updateTransaction = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const transactionId = parseInt(req.params.id, 10);

    if (isNaN(transactionId) || transactionId <= 0) {
      return res.status(400).json({
        success: false,
        error_code: 'VALIDATION_ERROR',
        message: 'Invalid transaction ID',
      });
    }

    const ownership = await checkTransactionOwnership(transactionId, userId);

    if (!ownership.exists) {
      return res.status(404).json({
        success: false,
        error_code: 'TRANSACTION_NOT_FOUND',
        message: 'Transaction not found',
      });
    }

    if (!ownership.isOwner) {
      return res.status(403).json({
        success: false,
        error_code: 'FORBIDDEN_ACCESS',
        message: 'You do not have permission to update this transaction',
      });
    }

    const currentTx = ownership.transaction;
    const { title, amount, type, category_id, date, note } = req.body;

    // Prepare new values or retain existing
    let newTitle = currentTx.title;
    let newAmount = currentTx.amount;
    let newType = currentTx.type;
    let newCategoryId = currentTx.category_id;
    let newDate = currentTx.date;
    let newNote = currentTx.note;

    if (title !== undefined) {
      if (typeof title !== 'string' || title.trim().length === 0) {
        return res.status(400).json({
          success: false,
          error_code: 'VALIDATION_ERROR',
          message: 'Title cannot be empty',
        });
      }
      newTitle = title.trim();
    }

    if (amount !== undefined) {
      const parsedAmount = parseFloat(amount);
      if (isNaN(parsedAmount) || parsedAmount <= 0) {
        return res.status(400).json({
          success: false,
          error_code: 'VALIDATION_ERROR',
          message: 'Amount must be a positive number greater than 0',
        });
      }
      newAmount = parsedAmount;
    }

    if (type !== undefined) {
      const lowerType = type.toLowerCase();
      if (lowerType !== 'income' && lowerType !== 'expense') {
        return res.status(400).json({
          success: false,
          error_code: 'VALIDATION_ERROR',
          message: 'Type must be either "income" or "expense"',
        });
      }
      newType = lowerType;
    }

    if (date !== undefined) {
      if (isNaN(Date.parse(date))) {
        return res.status(400).json({
          success: false,
          error_code: 'VALIDATION_ERROR',
          message: 'Invalid date format (YYYY-MM-DD)',
        });
      }
      newDate = date;
    }

    if (note !== undefined) {
      newNote = note ? note.trim() : null;
    }

    if (category_id !== undefined) {
      if (category_id === null || category_id === '') {
        newCategoryId = null;
      } else {
        const parsedCatId = parseInt(category_id, 10);
        const category = await getCategoryDetails(parsedCatId);

        if (!category) {
          return res.status(404).json({
            success: false,
            error_code: 'CATEGORY_NOT_FOUND',
            message: 'Specified category_id does not exist',
          });
        }

        if (category.type !== newType) {
          return res.status(400).json({
            success: false,
            error_code: 'CATEGORY_TYPE_MISMATCH',
            message: `Category "${category.name}" is type "${category.type}", which does not match transaction type "${newType}"`,
          });
        }

        newCategoryId = parsedCatId;
      }
    } else if (category_id === undefined && type !== undefined && currentTx.category_id) {
      // If type changed but category_id wasn't specified, check if existing category matches new type
      const category = await getCategoryDetails(currentTx.category_id);
      if (category && category.type !== newType) {
        return res.status(400).json({
          success: false,
          error_code: 'CATEGORY_TYPE_MISMATCH',
          message: `Existing category "${category.name}" is type "${category.type}", which does not match updated transaction type "${newType}". Please specify a matching category_id.`,
        });
      }
    }

    // Execute UPDATE query
    await pool.query(
      `UPDATE transactions
       SET title = ?, amount = ?, type = ?, category_id = ?, date = ?, note = ?
       WHERE id = ? AND user_id = ?`,
      [newTitle, newAmount, newType, newCategoryId, newDate, newNote, transactionId, userId]
    );

    // Fetch updated record with Category details
    const [rows] = await pool.query(
      `SELECT t.id, t.user_id, t.title, t.amount, t.type, t.date, t.note, t.created_at, t.updated_at,
              c.id AS cat_id, c.name AS cat_name, c.type AS cat_type, c.icon AS cat_icon, c.color AS cat_color
       FROM transactions t
       LEFT JOIN categories c ON t.category_id = c.id
       WHERE t.id = ? LIMIT 1`,
      [transactionId]
    );

    const row = rows[0];

    const updatedData = {
      id: row.id,
      user_id: row.user_id,
      title: row.title,
      amount: parseFloat(row.amount),
      type: row.type,
      date: row.date,
      note: row.note,
      category: row.cat_id ? {
        id: row.cat_id,
        name: row.cat_name,
        type: row.cat_type,
        icon: row.cat_icon,
        color: row.cat_color,
      } : null,
      created_at: row.created_at,
      updated_at: row.updated_at,
    };

    // Log UPDATE_TRANSACTION Audit Event
    logAuditEvent({
      actor_user_id: userId,
      action: 'UPDATE_TRANSACTION',
      entity_type: 'transactions',
      entity_id: transactionId,
      old_value: currentTx,
      new_value: updatedData,
      req,
    });

    return res.status(200).json({
      success: true,
      message: 'Transaction updated successfully',
      data: updatedData,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/v1/transactions/:id
 * Delete a transaction permanently
 */
export const deleteTransaction = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const transactionId = parseInt(req.params.id, 10);

    if (isNaN(transactionId) || transactionId <= 0) {
      return res.status(400).json({
        success: false,
        error_code: 'VALIDATION_ERROR',
        message: 'Invalid transaction ID',
      });
    }

    const ownership = await checkTransactionOwnership(transactionId, userId);

    if (!ownership.exists) {
      return res.status(404).json({
        success: false,
        error_code: 'TRANSACTION_NOT_FOUND',
        message: 'Transaction not found',
      });
    }

    if (!ownership.isOwner) {
      return res.status(403).json({
        success: false,
        error_code: 'FORBIDDEN_ACCESS',
        message: 'You do not have permission to delete this transaction',
      });
    }

    await pool.query(
      'DELETE FROM transactions WHERE id = ? AND user_id = ?',
      [transactionId, userId]
    );

    // Log DELETE_TRANSACTION Audit Event
    logAuditEvent({
      actor_user_id: userId,
      action: 'DELETE_TRANSACTION',
      entity_type: 'transactions',
      entity_id: transactionId,
      old_value: ownership.transaction,
      req,
    });

    return res.status(200).json({
      success: true,
      message: 'Transaction deleted successfully',
      data: {
        id: transactionId,
      },
    });
  } catch (error) {
    next(error);
  }
};
