import pool from '../config/db.js';
import { processUserRecurringTransactions, getTargetDateForMonth } from '../services/recurring.service.js';
import { logAuditEvent } from '../services/audit.service.js';

/**
 * GET /api/v1/recurring
 * Get all recurring transaction rules for current user
 */
export const getRecurringList = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Trigger auto-process check on fetch
    await processUserRecurringTransactions(userId, req);

    const [rules] = await pool.query(
      `SELECT r.id, r.user_id, r.category_id, r.title, r.amount, r.type, r.day_of_month,
              r.note, r.is_active, r.last_generated_date, r.created_at, r.updated_at,
              c.name AS category_name, c.icon AS category_icon, c.color AS category_color
       FROM recurring_transactions r
       LEFT JOIN categories c ON r.category_id = c.id
       WHERE r.user_id = ?
       ORDER BY r.is_active DESC, r.day_of_month ASC, r.id DESC`,
      [userId]
    );

    const formatted = rules.map((r) => ({
      id: r.id,
      title: r.title,
      amount: parseFloat(r.amount),
      type: r.type,
      day_of_month: r.day_of_month,
      note: r.note,
      is_active: Boolean(r.is_active),
      last_generated_date: r.last_generated_date,
      created_at: r.created_at,
      updated_at: r.updated_at,
      category: r.category_id
        ? {
            id: r.category_id,
            name: r.category_name,
            icon: r.category_icon,
            color: r.category_color,
          }
        : null,
    }));

    return res.status(200).json({
      success: true,
      message: 'Recurring transactions retrieved successfully',
      data: formatted,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/v1/recurring
 * Create a new recurring transaction rule
 */
export const createRecurring = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { title, amount, type, category_id, day_of_month, note } = req.body;

    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error_code: 'VALIDATION_ERROR',
        message: 'กรุณาระบุชื่อรายการประจำ',
      });
    }

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({
        success: false,
        error_code: 'VALIDATION_ERROR',
        message: 'จำนวนเงินต้องเป็นตัวเลขที่มากกว่า 0',
      });
    }

    const lowerType = type ? type.toLowerCase() : '';
    if (lowerType !== 'income' && lowerType !== 'expense') {
      return res.status(400).json({
        success: false,
        error_code: 'VALIDATION_ERROR',
        message: 'ประเภทต้องเป็น income หรือ expense เท่านั้น',
      });
    }

    const day = parseInt(day_of_month, 10);
    if (isNaN(day) || day < 1 || day > 31) {
      return res.status(400).json({
        success: false,
        error_code: 'VALIDATION_ERROR',
        message: 'วันที่ทำรายการของเดือนต้องอยู่ระหว่าง 1 ถึง 31',
      });
    }

    let targetCategoryId = null;
    if (category_id !== undefined && category_id !== null && category_id !== '') {
      targetCategoryId = parseInt(category_id, 10);
      const [cats] = await pool.query('SELECT id, type FROM categories WHERE id = ?', [targetCategoryId]);
      if (cats.length === 0) {
        return res.status(404).json({
          success: false,
          error_code: 'CATEGORY_NOT_FOUND',
          message: 'ไม่พบหมวดหมู่ที่ระบุ',
        });
      }
    }

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonthIndex = now.getMonth();
    const currentDay = now.getDate();

    // If the target day in current month has already arrived/passed (or is today),
    // mark this month as already settled so it doesn't generate an unexpected backdated duplicate.
    // It will start generating automatically next month on the scheduled day.
    let initialLastGeneratedDate = null;
    if (day <= currentDay) {
      initialLastGeneratedDate = getTargetDateForMonth(currentYear, currentMonthIndex, day);
    }

    const [result] = await pool.query(
      `INSERT INTO recurring_transactions (user_id, category_id, title, amount, type, day_of_month, note, is_active, last_generated_date)
       VALUES (?, ?, ?, ?, ?, ?, ?, TRUE, ?)`,
      [
        userId,
        targetCategoryId,
        title.trim(),
        numericAmount,
        lowerType,
        day,
        note ? note.trim() : null,
        initialLastGeneratedDate,
      ]
    );

    const newRuleId = result.insertId;

    // Log Audit Event
    logAuditEvent({
      actor_user_id: userId,
      action: 'CREATE_RECURRING_TRANSACTION',
      entity_type: 'recurring_transactions',
      entity_id: newRuleId,
      new_value: {
        title: title.trim(),
        amount: numericAmount,
        type: lowerType,
        day_of_month: day,
      },
      req,
    });

    // Check & process immediately if due this month!
    const generated = await processUserRecurringTransactions(userId, req);

    const [createdRows] = await pool.query(
      `SELECT r.id, r.user_id, r.category_id, r.title, r.amount, r.type, r.day_of_month,
              r.note, r.is_active, r.last_generated_date, r.created_at,
              c.name AS category_name, c.icon AS category_icon, c.color AS category_color
       FROM recurring_transactions r
       LEFT JOIN categories c ON r.category_id = c.id
       WHERE r.id = ?`,
      [newRuleId]
    );

    return res.status(201).json({
      success: true,
      message: 'สร้างรายการอัตโนมัติประจำเดือนเรียบร้อยแล้ว',
      data: createdRows[0],
      auto_generated_count: generated.length,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/v1/recurring/:id
 * Update a recurring transaction rule
 */
export const updateRecurring = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const ruleId = parseInt(req.params.id, 10);

    const [existing] = await pool.query(
      'SELECT * FROM recurring_transactions WHERE id = ? AND user_id = ? LIMIT 1',
      [ruleId, userId]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        error_code: 'NOT_FOUND',
        message: 'ไม่พบรายการอัตโนมัติที่ต้องการแก้ไข',
      });
    }

    const { title, amount, type, category_id, day_of_month, note, is_active } = req.body;
    const fields = [];
    const params = [];

    if (title !== undefined) {
      if (!title.trim()) {
        return res.status(400).json({ success: false, message: 'ชื่อรายการต้องไม่ว่างเปล่า' });
      }
      fields.push('title = ?');
      params.push(title.trim());
    }

    if (amount !== undefined) {
      const num = parseFloat(amount);
      if (isNaN(num) || num <= 0) {
        return res.status(400).json({ success: false, message: 'จำนวนเงินต้องมากกว่า 0' });
      }
      fields.push('amount = ?');
      params.push(num);
    }

    if (type !== undefined) {
      const lowerType = type.toLowerCase();
      if (lowerType !== 'income' && lowerType !== 'expense') {
        return res.status(400).json({ success: false, message: 'ประเภทต้องเป็น income หรือ expense' });
      }
      fields.push('type = ?');
      params.push(lowerType);
    }

    if (category_id !== undefined) {
      fields.push('category_id = ?');
      params.push(category_id ? parseInt(category_id, 10) : null);
    }

    if (day_of_month !== undefined) {
      const day = parseInt(day_of_month, 10);
      if (isNaN(day) || day < 1 || day > 31) {
        return res.status(400).json({ success: false, message: 'วันที่ต้องอยู่ระหว่าง 1 ถึง 31' });
      }
      fields.push('day_of_month = ?');
      params.push(day);
    }

    if (note !== undefined) {
      fields.push('note = ?');
      params.push(note ? note.trim() : null);
    }

    if (is_active !== undefined) {
      fields.push('is_active = ?');
      params.push(Boolean(is_active));
    }

    if (fields.length === 0) {
      return res.status(400).json({ success: false, message: 'ไม่มีข้อมูลที่ต้องการแก้ไข' });
    }

    params.push(ruleId, userId);
    await pool.query(
      `UPDATE recurring_transactions SET ${fields.join(', ')} WHERE id = ? AND user_id = ?`,
      params
    );

    // If activated, check & process
    if (is_active === true) {
      await processUserRecurringTransactions(userId, req);
    }

    const [updated] = await pool.query(
      `SELECT r.id, r.user_id, r.category_id, r.title, r.amount, r.type, r.day_of_month,
              r.note, r.is_active, r.last_generated_date, r.created_at, r.updated_at,
              c.name AS category_name, c.icon AS category_icon, c.color AS category_color
       FROM recurring_transactions r
       LEFT JOIN categories c ON r.category_id = c.id
       WHERE r.id = ?`,
      [ruleId]
    );

    return res.status(200).json({
      success: true,
      message: 'อัปเดตรายการอัตโนมัติเรียบร้อยแล้ว',
      data: updated[0],
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/v1/recurring/:id
 * Delete a recurring transaction rule
 */
export const deleteRecurring = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const ruleId = parseInt(req.params.id, 10);

    const [existing] = await pool.query(
      'SELECT id, title FROM recurring_transactions WHERE id = ? AND user_id = ? LIMIT 1',
      [ruleId, userId]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        error_code: 'NOT_FOUND',
        message: 'ไม่พบรายการอัตโนมัติที่ต้องการลบ',
      });
    }

    await pool.query('DELETE FROM recurring_transactions WHERE id = ? AND user_id = ?', [ruleId, userId]);

    logAuditEvent({
      actor_user_id: userId,
      action: 'DELETE_RECURRING_TRANSACTION',
      entity_type: 'recurring_transactions',
      entity_id: ruleId,
      old_value: existing[0],
      req,
    });

    return res.status(200).json({
      success: true,
      message: `ลบรายการอัตโนมัติ "${existing[0].title}" เรียบร้อยแล้ว`,
    });
  } catch (error) {
    next(error);
  }
};
