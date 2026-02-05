// formobjs.ts
/**
 * Utility functions for formatting form fields
 */

/**
 * Format TIN as "123-456-789-000"
 * Removes non-digits and inserts dashes
 */
export function formatTIN(value: string): string {
  if (!value) return '';

  // Remove all non-digit characters
  let digits = value.replace(/\D/g, '');

  // Format as "123-456-789-000"
  if (digits.length > 3) digits = digits.replace(/^(\d{3})/, '$1-');
  if (digits.length > 6) digits = digits.replace(/^(\d{3})-(\d{3})/, '$1-$2-');
  if (digits.length > 9) digits = digits.replace(/^(\d{3})-(\d{3})-(\d{3})/, '$1-$2-$3-');

  // Limit to 15 characters including dashes
  return digits.substring(0, 15);
}

/**
 * Format number with comma separators
 * @param value - Number or string to format
 * @returns Formatted string with commas
 */
export const formatNumberWithCommas = (value: string | number): string => {
  if (!value && value !== 0) return '';

  // Remove existing commas and parse
  const numValue = typeof value === 'string' ? parseFloat(value.replace(/,/g, '')) : value;

  // Return formatted number or empty string if invalid
  return isNaN(numValue) ? '' : numValue.toLocaleString();
};

/**
 * Remove commas from a formatted number string
 * @param value - String with commas
 * @returns Number value without commas
 */
export const parseFormattedNumber = (value: string): number => {
  const cleaned = value.replace(/,/g, '');
  return parseFloat(cleaned) || 0;
};

/**
 * Handle number input with live formatting
 * Returns onChange and onBlur handlers for formatted number inputs
 * Works while typing and formats on blur as well
 */
export const createNumberInputHandlers = (
  fieldName: string,
  handleInputChange: (field: string, value: string) => void
) => ({
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
    let rawValue = e.target.value.replace(/,/g, '');
    // Only allow digits
    if (/^\d*$/.test(rawValue)) {
      const formatted = formatNumberWithCommas(rawValue);
      handleInputChange(fieldName, formatted);
    }
  },
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => {
    let rawValue = e.target.value.replace(/,/g, '');
    if (rawValue) {
      const formatted = formatNumberWithCommas(rawValue);
      handleInputChange(fieldName, formatted);
    }
  }
});

/**
 * Parse a formatted string to number safely
 * @param value - String like "1,234" or "1234"
 * @returns Number
 */
export const parseNumberSafe = (value: string): number => {
  const cleaned = value.replace(/,/g, '');
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
};

/**
 * Placeholder for future formatters
 * Example usage: formatPhoneNumber, formatSSN, etc.
 */
export const formatters = {
  tin: formatTIN,
  numberWithCommas: formatNumberWithCommas,
  parseNumber: parseNumberSafe,
};
