import pool from '../config/db.js';
import { logAuditEvent } from './audit.service.js';

/**
 * Helper to get the actual target date for a recurring transaction in a given year/month.
 * Handles months with fewer days (e.g. Feb 28/29, April 30 for day 31).
 */
export const getTargetDateForMonth = (year, monthIndex, targetDay) => {
  // Days in month (monthIndex is 0-based: 0 for Jan, 8 for Sept)
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const actualDay = Math.min(targetDay, daysInMonth);
  const monthStr = String(monthIndex + 1).padStart(2, '0');
  const dayStr = String(actualDay).padStart(2, '0');
  return `${year}-${monthStr}-${dayStr}`;
};

/**
 * Process due recurring transactions for a specific user.
 * Called automatically when user loads transactions or triggers manual sync.
 * 
 * @param {number|string} userId
 * @param {Object} [reqContext] - Optional req object for audit log
 * @returns {Promise<Array>} List of generated transactions
 */
export const processUserRecurringTransactions = async (userId, reqContext = null) => {
  if (!userId) return [];

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonthIndex = now.getMonth(); // 0-11
  const currentDay = now.getDate(); // 1-31
  const currentMonthKey = `${currentYear}-${String(currentMonthIndex + 1).padStart(2, '0')}`;

  const generatedTransactions = [];

  try {
    // 1. Fetch active recurring rules for this user
    const [recurringRules] = await pool.query(
      `SELECT id, user_id, category_id, title, amount, type, day_of_month, note, is_active, last_generated_date
       FROM recurring_transactions
       WHERE user_id = ? AND is_active = TRUE`,
      [userId]
    );

    if (recurringRules.length === 0) {
      return [];
    }

    for (const rule of recurringRules) {
      const targetDay = Number(rule.day_of_month);
      const targetDateStr = getTargetDateForMonth(currentYear, currentMonthIndex, targetDay);
      const targetDate = new Date(targetDateStr);

      // Condition: Is target date today or past?
      // And has not already been generated for this month?
      let alreadyGeneratedThisMonth = false;
      if (rule.last_generated_date) {
        const lastGenStr = new Date(rule.last_generated_date).toISOString().slice(0, 7); // 'YYYY-MM'
        if (lastGenStr === currentMonthKey) {
          alreadyGeneratedThisMonth = true;
        }
      }

      // If due and not yet generated for current month
      if (currentDay >= targetDate.getDate() && !alreadyGeneratedThisMonth) {
        const autoNote = rule.note
          ? `${rule.note} (บันทึกอัตโนมัติประจำเดือน)`
          : `(บันทึกอัตโนมัติประจำเดือน)`;

        // 2. Insert into transactions table
        const [insertResult] = await pool.query(
          `INSERT INTO transactions (user_id, category_id, title, amount, type, date, note)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            rule.user_id,
            rule.category_id || null,
            rule.title,
            rule.amount,
            rule.type,
            targetDateStr,
            autoNote,
          ]
        );

        const newTxId = insertResult.insertId;

        // 3. Update last_generated_date on recurring rule
        await pool.query(
          `UPDATE recurring_transactions SET last_generated_date = ? WHERE id = ?`,
          [targetDateStr, rule.id]
        );

        generatedTransactions.push({
          id: newTxId,
          recurring_id: rule.id,
          title: rule.title,
          amount: rule.amount,
          type: rule.type,
          date: targetDateStr,
        });

        // 4. Log Audit Event
        logAuditEvent({
          actor_user_id: rule.user_id,
          action: 'AUTO_TRANSACTION_GENERATED',
          entity_type: 'transactions',
          entity_id: newTxId,
          new_value: {
            recurring_id: rule.id,
            title: rule.title,
            amount: rule.amount,
            type: rule.type,
            date: targetDateStr,
          },
          req: reqContext,
        });
      }
    }
  } catch (error) {
    console.error('[recurring.service]: Error processing recurring transactions:', error);
  }

  return generatedTransactions;
};

/**
 * Process all active recurring transactions across the entire system.
 * Useful for daily cron intervals.
 */
export const processAllDueRecurringTransactions = async () => {
  try {
    const [users] = await pool.query(
      `SELECT DISTINCT user_id FROM recurring_transactions WHERE is_active = TRUE`
    );

    let totalGenerated = 0;
    for (const u of users) {
      const created = await processUserRecurringTransactions(u.user_id);
      totalGenerated += created.length;
    }

    if (totalGenerated > 0) {
      console.log(`[recurring.service]: Auto-generated ${totalGenerated} recurring transactions.`);
    }
  } catch (error) {
    console.error('[recurring.service]: Background sweep error:', error);
  }
};
