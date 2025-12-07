/**
 * Date formatting utilities for WristWatch
 */

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const MONTH_NAMES_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

const DAY_NAMES = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
];

const DAY_NAMES_SHORT = [
  'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'
];

/**
 * Pads a number with leading zeros
 */
function padZero(num: number, length: number = 2): string {
  return String(num).padStart(length, '0');
}

/**
 * Format tokens and their replacement functions
 */
interface FormatTokens {
  [key: string]: () => string;
}

/**
 * Creates format token definitions for a given date
 */
function createFormatTokens(date: Date): FormatTokens {
  return {
    // Year
    'YYYY': () => String(date.getFullYear()),
    'YY': () => String(date.getFullYear() % 100).padStart(2, '0'),
    
    // Month
    'MMMM': () => MONTH_NAMES[date.getMonth()],
    'MMM': () => MONTH_NAMES_SHORT[date.getMonth()],
    'MM': () => padZero(date.getMonth() + 1),
    'M': () => String(date.getMonth() + 1),
    
    // Day of month
    'DD': () => padZero(date.getDate()),
    'D': () => String(date.getDate()),
    
    // Day of week
    'dddd': () => DAY_NAMES[date.getDay()],
    'ddd': () => DAY_NAMES_SHORT[date.getDay()],
    
    // Hours
    'HH': () => padZero(date.getHours()),
    'H': () => String(date.getHours()),
    
    // Minutes
    'mm': () => padZero(date.getMinutes()),
    'm': () => String(date.getMinutes()),
    
    // Seconds
    'ss': () => padZero(date.getSeconds()),
    's': () => String(date.getSeconds()),
    
    // Milliseconds
    'SSS': () => padZero(date.getMilliseconds(), 3),
  };
}

/**
 * Formats a date according to a pattern string
 * Supports various format tokens for flexible date formatting
 * 
 * @param date - The date to format
 * @param pattern - Format pattern using tokens (e.g., 'YYYY-MM-DD HH:mm:ss')
 * @returns Formatted date string
 * 
 * @example
 * const date = new Date('2025-12-05T14:30:45');
 * 
 * // Basic date format
 * format(date, 'YYYY-MM-DD'); // "2025-12-05"
 * 
 * // Date and time
 * format(date, 'YYYY-MM-DD HH:mm:ss'); // "2025-12-05 14:30:45"
 * 
 * // Long format with month name
 * format(date, 'MMMM D, YYYY'); // "December 5, 2025"
 * 
 * // Custom format
 * format(date, 'dddd, MMM D [at] HH:mm'); // "Friday, Dec 5 at 14:30"
 * 
 * @remarks
 * Supported format tokens:
 * - YYYY: 4-digit year (e.g., "2025")
 * - YY: 2-digit year (e.g., "25")
 * - MMMM: Full month name (e.g., "December")
 * - MMM: Short month name (e.g., "Dec")
 * - MM: 2-digit month (e.g., "12")
 * - M: Month without leading zero (e.g., "12")
 * - DD: 2-digit day (e.g., "05")
 * - D: Day without leading zero (e.g., "5")
 * - dddd: Full day name (e.g., "Friday")
 * - ddd: Short day name (e.g., "Fri")
 * - HH: 2-digit hour (e.g., "14")
 * - H: Hour without leading zero (e.g., "14")
 * - mm: 2-digit minute (e.g., "30")
 * - m: Minute without leading zero (e.g., "30")
 * - ss: 2-digit second (e.g., "45")
 * - s: Second without leading zero (e.g., "45")
 * - SSS: 3-digit millisecond (e.g., "000")
 * 
 * Text within square brackets [] is treated as literal text and not parsed for tokens.
 */
export function format(date: Date, pattern: string): string {
  const tokens = createFormatTokens(date);
  
  // Sort tokens by length (longest first) to match longest tokens first
  const tokenKeys = Object.keys(tokens).sort((a, b) => b.length - a.length);
  
  let result = '';
  let i = 0;
  let inLiteral = false;
  
  while (i < pattern.length) {
    // Handle escaped literal text within square brackets
    if (pattern[i] === '[') {
      inLiteral = true;
      i++;
      continue;
    }
    
    if (pattern[i] === ']') {
      inLiteral = false;
      i++;
      continue;
    }
    
    // If we're in a literal section, just add the character
    if (inLiteral) {
      result += pattern[i];
      i++;
      continue;
    }
    
    let matched = false;
    
    // Try to match tokens starting from longest
    for (const token of tokenKeys) {
      if (pattern.substring(i, i + token.length) === token) {
        result += tokens[token]();
        i += token.length;
        matched = true;
        break;
      }
    }
    
    // If no token matched, add the character as-is
    if (!matched) {
      result += pattern[i];
      i++;
    }
  }
  
  return result;
}

/**
 * Formats a date as a short date string using locale-specific formatting
 * 
 * @param date - The date to format
 * @param locale - Optional locale identifier (defaults to 'en-US')
 * @returns Short date string in the specified locale format
 * 
 * @example
 * const date = new Date('2025-12-05');
 * 
 * // US format
 * toShortDate(date); // "12/5/2025"
 * toShortDate(date, 'en-US'); // "12/5/2025"
 * 
 * // European format
 * toShortDate(date, 'en-GB'); // "05/12/2025"
 * 
 * // French format
 * toShortDate(date, 'fr-FR'); // "05/12/2025"
 * 
 * // Japanese format
 * toShortDate(date, 'ja-JP'); // "2025/12/5"
 */
export function toShortDate(date: Date, locale?: string): string {
  return date.toLocaleDateString(locale || 'en-US');
}

/**
 * Formats a date as a long date string with full month and day names
 * 
 * @param date - The date to format
 * @param locale - Optional locale identifier (defaults to 'en-US')
 * @returns Long date string with weekday, month name, day, and year
 * 
 * @example
 * const date = new Date('2025-12-05');
 * 
 * // English format
 * toLongDate(date); // "Friday, December 5, 2025"
 * 
 * // French format
 * toLongDate(date, 'fr-FR'); // "vendredi 5 décembre 2025"
 * 
 * // Spanish format
 * toLongDate(date, 'es-ES'); // "viernes, 5 de diciembre de 2025"
 * 
 * // Japanese format
 * toLongDate(date, 'ja-JP'); // "2025年12月5日金曜日"
 */
export function toLongDate(date: Date, locale?: string): string {
  return date.toLocaleDateString(locale || 'en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Formats a date as a human-readable relative time description
 * Automatically selects the most appropriate time unit (seconds, minutes, hours, days, weeks, months, years)
 * 
 * @param date - The date to format
 * @param referenceDate - Optional reference date to compare against (defaults to current time)
 * @returns Relative time string (e.g., "2 hours ago", "in 3 days", "just now")
 * 
 * @example
 * const now = new Date();
 * 
 * // Past dates
 * const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);
 * toRelative(twoHoursAgo); // "2 hours ago"
 * 
 * const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
 * toRelative(yesterday); // "1 day ago"
 * 
 * // Future dates
 * const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
 * toRelative(tomorrow); // "in 1 day"
 * 
 * // Very recent
 * const fiveSecondsAgo = new Date(now.getTime() - 5000);
 * toRelative(fiveSecondsAgo); // "just now"
 * 
 * // Custom reference date
 * const date1 = new Date('2025-12-05');
 * const date2 = new Date('2025-12-10');
 * toRelative(date1, date2); // "5 days ago"
 */
export function toRelative(date: Date, referenceDate?: Date): string {
  const now = referenceDate || new Date();
  const diffMs = date.getTime() - now.getTime();
  const absDiffMs = Math.abs(diffMs);
  const isPast = diffMs < 0;
  
  // Define time units in milliseconds
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;
  const week = day * 7;
  const month = day * 30; // Approximate
  const year = day * 365; // Approximate
  
  let value: number;
  let unit: string;
  
  if (absDiffMs < minute) {
    // Less than a minute
    if (absDiffMs < 10 * second) {
      return 'just now';
    }
    value = Math.floor(absDiffMs / second);
    unit = 'second';
  } else if (absDiffMs < hour) {
    // Less than an hour
    value = Math.floor(absDiffMs / minute);
    unit = 'minute';
  } else if (absDiffMs < day) {
    // Less than a day
    value = Math.floor(absDiffMs / hour);
    unit = 'hour';
  } else if (absDiffMs < week) {
    // Less than a week
    value = Math.floor(absDiffMs / day);
    unit = 'day';
  } else if (absDiffMs < month) {
    // Less than a month
    value = Math.floor(absDiffMs / week);
    unit = 'week';
  } else if (absDiffMs < year) {
    // Less than a year
    value = Math.floor(absDiffMs / month);
    unit = 'month';
  } else {
    // A year or more
    value = Math.floor(absDiffMs / year);
    unit = 'year';
  }
  
  // Pluralize if needed
  const unitStr = value === 1 ? unit : `${unit}s`;
  
  // Format as past or future
  if (isPast) {
    return `${value} ${unitStr} ago`;
  } else {
    return `in ${value} ${unitStr}`;
  }
}

/**
 * Formats a date with locale-specific formatting using Intl.DateTimeFormat
 * Provides full control over date/time formatting with locale-aware output
 * 
 * @param date - The date to format
 * @param locale - Locale identifier (e.g., 'en-US', 'fr-FR', 'ja-JP', 'de-DE')
 * @param options - Optional Intl.DateTimeFormat options for fine-grained control
 * @returns Locale-formatted date string
 * 
 * @example
 * const date = new Date('2025-12-05T14:30:45');
 * 
 * // Default locale formatting
 * formatWithLocale(date, 'en-US'); // "12/5/2025, 2:30:45 PM"
 * formatWithLocale(date, 'ja-JP'); // "2025/12/5 14:30:45"
 * 
 * // Custom options
 * formatWithLocale(date, 'en-US', {
 *   weekday: 'long',
 *   year: 'numeric',
 *   month: 'long',
 *   day: 'numeric'
 * }); // "Friday, December 5, 2025"
 * 
 * // Time only
 * formatWithLocale(date, 'en-US', {
 *   hour: '2-digit',
 *   minute: '2-digit',
 *   second: '2-digit'
 * }); // "02:30:45 PM"
 * 
 * // 24-hour format
 * formatWithLocale(date, 'en-GB', {
 *   hour: '2-digit',
 *   minute: '2-digit',
 *   hour12: false
 * }); // "14:30"
 */
export function formatWithLocale(
  date: Date,
  locale: string,
  options?: Intl.DateTimeFormatOptions
): string {
  return date.toLocaleString(locale, options);
}
