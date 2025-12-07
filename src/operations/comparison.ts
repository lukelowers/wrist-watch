/**
 * Date comparison operations
 * All comparisons are timezone-independent by normalizing to UTC timestamps
 */

/**
 * Checks if two dates are equal (represent the same moment in time)
 * Comparison is timezone-independent - dates are compared by their UTC timestamps
 * 
 * @param date1 - First date to compare
 * @param date2 - Second date to compare
 * @returns True if dates represent the same moment in time
 * 
 * @example
 * const date1 = new Date('2025-12-05T10:00:00Z');
 * const date2 = new Date('2025-12-05T10:00:00Z');
 * const date3 = new Date('2025-12-05T11:00:00Z');
 * 
 * equals(date1, date2); // true
 * equals(date1, date3); // false
 * 
 * // Timezone-independent comparison
 * const utc = new Date('2025-12-05T10:00:00Z');
 * const est = new Date('2025-12-05T05:00:00-05:00'); // Same moment in EST
 * equals(utc, est); // true
 */
export function equals(date1: Date, date2: Date): boolean {
  return date1.getTime() === date2.getTime();
}

/**
 * Checks if the first date is before the second date
 * Comparison is timezone-independent - dates are compared by their UTC timestamps
 * 
 * @param date1 - First date to compare
 * @param date2 - Second date to compare
 * @returns True if date1 is before date2
 * 
 * @example
 * const earlier = new Date('2025-12-05T10:00:00Z');
 * const later = new Date('2025-12-05T11:00:00Z');
 * 
 * isBefore(earlier, later); // true
 * isBefore(later, earlier); // false
 * isBefore(earlier, earlier); // false
 * 
 * // Timezone-independent comparison
 * const utc = new Date('2025-12-05T10:00:00Z');
 * const est = new Date('2025-12-05T06:00:00-05:00'); // 1 hour later in EST
 * isBefore(utc, est); // true
 */
export function isBefore(date1: Date, date2: Date): boolean {
  return date1.getTime() < date2.getTime();
}

/**
 * Checks if the first date is after the second date
 * Comparison is timezone-independent - dates are compared by their UTC timestamps
 * 
 * @param date1 - First date to compare
 * @param date2 - Second date to compare
 * @returns True if date1 is after date2
 * 
 * @example
 * const earlier = new Date('2025-12-05T10:00:00Z');
 * const later = new Date('2025-12-05T11:00:00Z');
 * 
 * isAfter(later, earlier); // true
 * isAfter(earlier, later); // false
 * isAfter(earlier, earlier); // false
 * 
 * // Timezone-independent comparison
 * const utc = new Date('2025-12-05T12:00:00Z');
 * const est = new Date('2025-12-05T06:00:00-05:00'); // 1 hour earlier in EST
 * isAfter(utc, est); // true
 */
export function isAfter(date1: Date, date2: Date): boolean {
  return date1.getTime() > date2.getTime();
}

/**
 * Checks if a date falls within a range (inclusive)
 * Comparison is timezone-independent - dates are compared by their UTC timestamps
 * 
 * @param date - Date to check
 * @param start - Start of the range (inclusive)
 * @param end - End of the range (inclusive)
 * @returns True if date is between start and end (inclusive)
 * 
 * @example
 * const date = new Date('2025-12-07T10:00:00Z');
 * const start = new Date('2025-12-05T10:00:00Z');
 * const end = new Date('2025-12-10T10:00:00Z');
 * 
 * isBetween(date, start, end); // true
 * 
 * // Boundary cases (inclusive)
 * isBetween(start, start, end); // true
 * isBetween(end, start, end); // true
 * 
 * // Outside range
 * const before = new Date('2025-12-04T10:00:00Z');
 * isBetween(before, start, end); // false
 * 
 * const after = new Date('2025-12-11T10:00:00Z');
 * isBetween(after, start, end); // false
 * 
 * @remarks
 * Both start and end boundaries are inclusive. If you need exclusive boundaries,
 * use isBefore() and isAfter() directly.
 */
export function isBetween(date: Date, start: Date, end: Date): boolean {
  const timestamp = date.getTime();
  const startTimestamp = start.getTime();
  const endTimestamp = end.getTime();
  
  return timestamp >= startTimestamp && timestamp <= endTimestamp;
}
