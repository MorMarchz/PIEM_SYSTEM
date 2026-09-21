/**
 * Sanitizes and cleans input value:
 * - Disallows letters, special symbols, mathematical signs (+, -, e, E, *, /, etc.)
 * - Allows only digits 0-9 and at most one decimal point '.'
 * - Limits decimal precision to 2 places
 * 
 * @param {string} value
 * @returns {string} Clean raw numeric string e.g. "15000" or "15000.50"
 */
export const cleanNumericInput = (value) => {
  if (value === null || value === undefined) return '';
  const str = String(value);

  // 1. Remove commas and all characters except digits and period
  let cleaned = str.replace(/[^0-9.]/g, '');

  // 2. Prevent multiple decimal points (keep only the first one)
  const parts = cleaned.split('.');
  if (parts.length > 2) {
    cleaned = `${parts[0]}.${parts.slice(1).join('')}`;
  }

  // 3. Limit decimal places to maximum 2 digits
  if (cleaned.includes('.')) {
    const [integerPart, decimalPart] = cleaned.split('.');
    cleaned = `${integerPart}.${decimalPart.slice(0, 2)}`;
  }

  return cleaned;
};

/**
 * Formats a clean numeric string with thousand commas while preserving typing state (e.g. trailing period)
 * 
 * @param {string|number} value
 * @returns {string} Formatted string with commas e.g. "15,000" or "1,500,000.50"
 */
export const formatAmountWithCommas = (value) => {
  if (!value && value !== 0) return '';
  
  const cleaned = cleanNumericInput(value);
  if (!cleaned) return '';

  const hasTrailingDot = cleaned.endsWith('.');
  const [integerPart, decimalPart] = cleaned.split('.');

  // Format integer part with commas
  const formattedInteger = integerPart ? Number(integerPart).toLocaleString('en-US') : '0';

  if (decimalPart !== undefined) {
    return `${formattedInteger}.${decimalPart}`;
  }

  if (hasTrailingDot) {
    return `${formattedInteger}.`;
  }

  return formattedInteger;
};

/**
 * Parses formatted string with commas back to pure float number
 * 
 * @param {string} formattedValue
 * @returns {number}
 */
export const parseAmountToNumber = (formattedValue) => {
  if (!formattedValue) return 0;
  const raw = String(formattedValue).replace(/,/g, '');
  const num = parseFloat(raw);
  return isNaN(num) ? 0 : num;
};

/**
 * Formats a number to Thai Baht currency display with 2 decimal places
 * e.g. 15000 -> "15,000.00"
 */
export const formatCurrency = (amount) => {
  const num = parseFloat(amount) || 0;
  return num.toLocaleString('th-TH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};
