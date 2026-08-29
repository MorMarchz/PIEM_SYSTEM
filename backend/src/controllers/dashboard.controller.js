import pool from '../config/db.js';

/**
 * GET /api/v1/dashboard/summary
 * Calculate total income, total expense, net balance, and transaction count for authenticated user
 */
export const getDashboardSummary = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { start_date, end_date } = req.query;

    let whereClauses = ['user_id = ?'];
    let params = [userId];

    if (start_date && !isNaN(Date.parse(start_date))) {
      whereClauses.push('date >= ?');
      params.push(start_date);
    }

    if (end_date && !isNaN(Date.parse(end_date))) {
      whereClauses.push('date <= ?');
      params.push(end_date);
    }

    const whereSql = whereClauses.join(' AND ');

    // Aggregate Summary Query
    const summarySql = `
      SELECT
        COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) AS total_income,
        COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) AS total_expense,
        COUNT(*) AS transaction_count
      FROM transactions
      WHERE ${whereSql}
    `;

    const [rows] = await pool.query(summarySql, params);
    const summary = rows[0];

    const totalIncome = parseFloat(summary.total_income) || 0;
    const totalExpense = parseFloat(summary.total_expense) || 0;
    const netBalance = totalIncome - totalExpense;
    const transactionCount = parseInt(summary.transaction_count, 10) || 0;

    return res.status(200).json({
      success: true,
      message: 'Dashboard summary calculated successfully',
      data: {
        total_income: totalIncome,
        total_expense: totalExpense,
        net_balance: netBalance,
        transaction_count: transactionCount,
        period: {
          start_date: start_date || null,
          end_date: end_date || null,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/v1/dashboard/charts
 * Calculate category breakdown and trend series (daily/monthly) for charts
 */
export const getDashboardCharts = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { start_date, end_date, view = 'daily' } = req.query;

    let whereClauses = ['t.user_id = ?'];
    let params = [userId];

    if (start_date && !isNaN(Date.parse(start_date))) {
      whereClauses.push('t.date >= ?');
      params.push(start_date);
    }

    if (end_date && !isNaN(Date.parse(end_date))) {
      whereClauses.push('t.date <= ?');
      params.push(end_date);
    }

    const whereSql = whereClauses.join(' AND ');

    // 1. Category Breakdown Query (Expense & Income breakdown by category)
    const breakdownSql = `
      SELECT
        c.id AS category_id,
        COALESCE(c.name, 'ไม่ระบุหมวดหมู่') AS name,
        COALESCE(c.type, t.type) AS type,
        c.icon,
        c.color,
        COALESCE(SUM(t.amount), 0) AS total_amount
      FROM transactions t
      LEFT JOIN categories c ON t.category_id = c.id
      WHERE ${whereSql}
      GROUP BY c.id, c.name, c.type, c.icon, c.color, t.type
      ORDER BY total_amount DESC
    `;

    const [breakdownRows] = await pool.query(breakdownSql, params);

    // Calculate totals for percentage calculation
    const totalExpense = breakdownRows
      .filter((r) => r.type === 'expense')
      .reduce((sum, r) => sum + parseFloat(r.total_amount), 0);

    const totalIncome = breakdownRows
      .filter((r) => r.type === 'income')
      .reduce((sum, r) => sum + parseFloat(r.total_amount), 0);

    const categoryBreakdown = breakdownRows.map((row) => {
      const amount = parseFloat(row.total_amount);
      const baseTotal = row.type === 'income' ? totalIncome : totalExpense;
      const percentage = baseTotal > 0 ? parseFloat(((amount / baseTotal) * 100).toFixed(2)) : 0;

      return {
        category_id: row.category_id,
        name: row.name,
        type: row.type,
        icon: row.icon || (row.type === 'income' ? 'AttachMoney' : 'MoreHoriz'),
        color: row.color || (row.type === 'income' ? '#10B981' : '#6B7280'),
        total_amount: amount,
        percentage,
      };
    });

    // 2. Trend Series Query (Daily or Monthly)
    const isMonthly = view.toLowerCase() === 'monthly';
    const dateFormat = isMonthly ? '%Y-%m' : '%Y-%m-%d';

    const trendSql = `
      SELECT
        DATE_FORMAT(date, '${dateFormat}') AS period,
        COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) AS income,
        COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) AS expense
      FROM transactions t
      WHERE ${whereSql}
      GROUP BY DATE_FORMAT(date, '${dateFormat}')
      ORDER BY period ASC
    `;

    const [trendRows] = await pool.query(trendSql, params);

    const trendSeries = trendRows.map((row) => ({
      period: row.period,
      income: parseFloat(row.income),
      expense: parseFloat(row.expense),
      net: parseFloat(row.income) - parseFloat(row.expense),
    }));

    return res.status(200).json({
      success: true,
      message: 'Dashboard charts data calculated successfully',
      data: {
        category_breakdown: categoryBreakdown,
        trend_series: trendSeries,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/v1/reports/summary
 * Detailed financial report calculation
 */
export const getReportSummary = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { start_date, end_date } = req.query;

    let whereClauses = ['t.user_id = ?'];
    let params = [userId];

    if (start_date && !isNaN(Date.parse(start_date))) {
      whereClauses.push('t.date >= ?');
      params.push(start_date);
    }

    if (end_date && !isNaN(Date.parse(end_date))) {
      whereClauses.push('t.date <= ?');
      params.push(end_date);
    }

    const whereSql = whereClauses.join(' AND ');

    // Total Totals Query
    const totalsSql = `
      SELECT
        COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) AS total_income,
        COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) AS total_expense,
        COUNT(*) AS total_transactions
      FROM transactions t
      WHERE ${whereSql}
    `;

    const [totalsRows] = await pool.query(totalsSql, params);
    const totals = totalsRows[0];

    const totalIncome = parseFloat(totals.total_income) || 0;
    const totalExpense = parseFloat(totals.total_expense) || 0;
    const netBalance = totalIncome - totalExpense;
    const savingsRate = totalIncome > 0 ? parseFloat(((netBalance / totalIncome) * 100).toFixed(2)) : 0;

    // Detailed Categories Breakdown
    const categoriesSql = `
      SELECT
        c.id AS category_id,
        COALESCE(c.name, 'ไม่ระบุหมวดหมู่') AS category_name,
        t.type,
        c.icon,
        c.color,
        COALESCE(SUM(t.amount), 0) AS total_amount,
        COUNT(t.id) AS transaction_count
      FROM transactions t
      LEFT JOIN categories c ON t.category_id = c.id
      WHERE ${whereSql}
      GROUP BY c.id, c.name, t.type, c.icon, c.color
      ORDER BY total_amount DESC
    `;

    const [categoryRows] = await pool.query(categoriesSql, params);

    const incomeCategories = [];
    const expenseCategories = [];
    let topExpenseCategory = null;

    categoryRows.forEach((row) => {
      const item = {
        category_id: row.category_id,
        name: row.category_name,
        icon: row.icon || 'MoreHoriz',
        color: row.color || '#6B7280',
        total_amount: parseFloat(row.total_amount),
        transaction_count: parseInt(row.transaction_count, 10),
      };

      if (row.type === 'income') {
        incomeCategories.push(item);
      } else {
        expenseCategories.push(item);
      }
    });

    if (expenseCategories.length > 0) {
      topExpenseCategory = expenseCategories[0]; // Already sorted by total_amount DESC
    }

    return res.status(200).json({
      success: true,
      message: 'Financial report summary generated successfully',
      data: {
        summary: {
          total_income: totalIncome,
          total_expense: totalExpense,
          net_balance: netBalance,
          savings_rate: savingsRate,
          total_transactions: parseInt(totals.total_transactions, 10),
        },
        income_breakdown: incomeCategories,
        expense_breakdown: expenseCategories,
        top_expense_category: topExpenseCategory,
        period: {
          start_date: start_date || null,
          end_date: end_date || null,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};
