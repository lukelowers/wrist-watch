import type { TimeUnit } from '../core/types';

/**
 * Adds a specified amount of time to a date
 * Returns a new Date object without modifying the original
 * 
 * @param date - The base date
 * @param amount - The amount to add (can be negative to subtract)
 * @param unit - The time unit (year, month, week, day, hour, minute, second, millisecond)
 * @returns A new Date with the time added
 * 
 * @example
 * const date = new Date('2025-12-05T10:00:00');
 * 
 * // Add days
 * add(date, 7, 'day'); // 2025-12-12T10:00:00
 * 
 * // Add hours
 * add(date, 3, 'hour'); // 2025-12-05T13:00:00
 * 
 * // Add months (handles variable month lengths)
 * add(date, 2, 'month'); // 2026-02-05T10:00:00
 * 
 * // Add years
 * add(date, 1, 'year'); // 2026-12-05T10:00:00
 * 
 * @remarks
 * - For fixed-duration units (millisecond, second, minute, hour, day, week), 
 *   the function uses precise millisecond arithmetic
 * - For variable-duration units (month, year), the function uses calendar arithmetic
 * - When adding months, if the target day doesn't exist (e.g., Jan 31 + 1 month),
 *   the result is adjusted to the last day of the target month (Feb 28/29)
 * - DST transitions are handled automatically by the native Date object
 */
export function add(date: Date, amount: number, unit: TimeUnit): Date {
  const timestamp = date.getTime();
  
  // For fixed-duration units, use epoch milliseconds for accuracy and to avoid DST issues
  switch (unit) {
    case 'millisecond':
      return new Date(timestamp + amount);
    case 'second':
      return new Date(timestamp + amount * 1000);
    case 'minute':
      return new Date(timestamp + amount * 1000 * 60);
    case 'hour':
      return new Date(timestamp + amount * 1000 * 60 * 60);
    case 'day':
      return new Date(timestamp + amount * 1000 * 60 * 60 * 24);
    case 'week':
      return new Date(timestamp + amount * 1000 * 60 * 60 * 24 * 7);
    case 'month': {
      // For month/year, use calendar arithmetic due to variable lengths
      const result = new Date(timestamp);
      const currentDay = result.getDate();
      result.setMonth(result.getMonth() + amount);
      
      // If the day changed (e.g., Jan 31 + 1 month = Feb 28/29), adjust to last day of month
      if (result.getDate() !== currentDay) {
        result.setDate(0); // Set to last day of previous month
      }
      return result;
    }
    case 'year': {
      const result = new Date(timestamp);
      result.setFullYear(result.getFullYear() + amount);
      return result;
    }
  }
}

/**
 * Subtracts a specified amount of time from a date
 * Returns a new Date object without modifying the original
 * 
 * @param date - The base date
 * @param amount - The amount to subtract (can be negative to add)
 * @param unit - The time unit (year, month, week, day, hour, minute, second, millisecond)
 * @returns A new Date with the time subtracted
 * 
 * @example
 * const date = new Date('2025-12-05T10:00:00');
 * 
 * // Subtract days
 * subtract(date, 7, 'day'); // 2025-11-28T10:00:00
 * 
 * // Subtract hours
 * subtract(date, 3, 'hour'); // 2025-12-05T07:00:00
 * 
 * // Subtract months
 * subtract(date, 2, 'month'); // 2025-10-05T10:00:00
 * 
 * // Subtract years
 * subtract(date, 1, 'year'); // 2024-12-05T10:00:00
 * 
 * @remarks
 * This function is equivalent to calling add() with a negative amount.
 * See add() documentation for details on how different time units are handled.
 */
export function subtract(date: Date, amount: number, unit: TimeUnit): Date {
  return add(date, -amount, unit);
}

/**
 * Calculates the difference between two dates in the specified unit
 * Returns a positive number if date1 is after date2, negative if before
 * 
 * @param date1 - The first date (minuend)
 * @param date2 - The second date (subtrahend)
 * @param unit - The time unit to return the difference in
 * @returns The difference in the specified unit (date1 - date2)
 * 
 * @example
 * const date1 = new Date('2025-12-10T10:00:00');
 * const date2 = new Date('2025-12-05T10:00:00');
 * 
 * // Calculate difference in days
 * diff(date1, date2, 'day'); // 5
 * diff(date2, date1, 'day'); // -5
 * 
 * // Calculate difference in hours
 * diff(date1, date2, 'hour'); // 120
 * 
 * // Calculate difference in weeks
 * diff(date1, date2, 'week'); // 0.714... (approximately)
 * 
 * // Calculate difference in months
 * const date3 = new Date('2026-02-05');
 * diff(date3, date2, 'month'); // 14
 * 
 * // Calculate difference in years
 * diff(date3, date2, 'year'); // 1
 * 
 * @remarks
 * - For fixed-duration units (millisecond, second, minute, hour, day, week),
 *   the calculation is based on precise millisecond differences
 * - For month calculations, the function counts complete calendar months
 *   and adjusts for partial months based on day differences
 * - For year calculations, the function counts complete calendar years
 * - Results may be fractional for units like weeks
 */
export function diff(date1: Date, date2: Date, unit: TimeUnit): number {
  const millisDiff = date1.getTime() - date2.getTime();
  
  switch (unit) {
    case 'millisecond':
      return millisDiff;
    case 'second':
      return millisDiff / 1000;
    case 'minute':
      return millisDiff / (1000 * 60);
    case 'hour':
      return millisDiff / (1000 * 60 * 60);
    case 'day':
      return millisDiff / (1000 * 60 * 60 * 24);
    case 'week':
      return millisDiff / (1000 * 60 * 60 * 24 * 7);
    case 'month':
      // Approximate month calculation
      const years = date1.getFullYear() - date2.getFullYear();
      const months = date1.getMonth() - date2.getMonth();
      const days = date1.getDate() - date2.getDate();
      
      let totalMonths = years * 12 + months;
      
      // Adjust for partial months based on day difference
      if (days < 0) {
        totalMonths -= 1;
      }
      
      return totalMonths;
    case 'year':
      // Calculate years with fractional component
      const yearDiff = date1.getFullYear() - date2.getFullYear();
      const monthDiff = date1.getMonth() - date2.getMonth();
      const dayDiff = date1.getDate() - date2.getDate();
      
      let totalYears = yearDiff;
      
      // Adjust for partial years
      if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
        totalYears -= 1;
      }
      
      return totalYears;
  }
}
