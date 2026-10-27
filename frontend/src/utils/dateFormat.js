/**
 * Safe local date formatting utilities to prevent UTC timezone shifts
 * (e.g. converting UTC+7 morning dates to previous day via toISOString).
 */

/**
 * Returns today's date in local timezone as "YYYY-MM-DD"
 */
export const getTodayLocalDateString = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Returns current year-month in local timezone as "YYYY-MM"
 */
export const getCurrentLocalMonthString = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
};

/**
 * Safely extracts "YYYY-MM-DD" string from a date string or Date object
 * without shifting timezones
 */
export const formatToLocalDateString = (input) => {
  if (!input) return '';
  if (typeof input === 'string') {
    // If already in YYYY-MM-DD or starts with YYYY-MM-DD
    if (/^\d{4}-\d{2}-\d{2}/.test(input)) {
      return input.slice(0, 10);
    }
  }
  const d = new Date(input);
  if (isNaN(d.getTime())) return '';
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};
