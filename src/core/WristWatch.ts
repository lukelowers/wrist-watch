import type { TimeUnit, FormatPattern, DateComponents } from './types';
import { convertToTimezone, convertToUTC, convertToLocal } from '../utils/timezone';
import { format as formatDate, toShortDate as formatShortDate, toLongDate as formatLongDate, toRelative as formatRelative, formatWithLocale } from '../operations/formatting';
import { add as addTime, subtract as subtractTime, diff as diffTime } from '../operations/arithmetic';
import { isBefore as isBeforeDate, isAfter as isAfterDate, isBetween as isBetweenDates } from '../operations/comparison';

/**
 * WristWatch - A lightweight wrapper around JavaScript's Date object
 * providing an intuitive API for date/time operations
 * 
 * @remarks
 * WristWatch is designed to be immutable - all operations return new instances
 * rather than modifying the existing instance. This makes it safe to use in
 * functional programming patterns and prevents accidental mutations.
 * 
 * @example
 * // Create from current time
 * const now = WristWatch.now();
 * 
 * // Create from Date object
 * const ww = new WristWatch(new Date('2025-12-05'));
 * 
 * // Create from timestamp
 * const fromTimestamp = new WristWatch(1733396400000);
 * 
 * // Create from ISO string
 * const fromISO = new WristWatch('2025-12-05T10:30:00Z');
 * 
 * // All operations return new instances (immutable)
 * const tomorrow = now.add(1, 'day'); // now is unchanged
 * const formatted = now.format('YYYY-MM-DD'); // now is unchanged
 */
export class WristWatch {
  private readonly date: Date;

  /**
   * Creates a new WristWatch instance
   * 
   * @param input - Date object, timestamp (number), or date string. Defaults to current time.
   * 
   * @example
   * // Create with current time
   * const now = new WristWatch();
   * 
   * // Create from Date object
   * const fromDate = new WristWatch(new Date('2025-12-05'));
   * 
   * // Create from timestamp (milliseconds)
   * const fromTimestamp = new WristWatch(1733396400000);
   * 
   * // Create from ISO string
   * const fromISO = new WristWatch('2025-12-05T10:30:00Z');
   * 
   * // Create from date string
   * const fromString = new WristWatch('December 5, 2025');
   * 
   * @remarks
   * When passing a string, the constructor uses JavaScript's Date parsing,
   * which may produce inconsistent results across browsers for non-ISO formats.
   * For reliable parsing, use the parse() or parseISO() functions instead.
   */
  constructor(input?: Date | number | string) {
    if (input === undefined) {
      this.date = new Date();
    } else if (input instanceof Date) {
      this.date = new Date(input.getTime());
    } else if (typeof input === 'string') {
      // Handle date-only strings (YYYY-MM-DD) as local midnight instead of UTC
      const dateOnlyPattern = /^\d{4}-\d{2}-\d{2}$/;
      if (dateOnlyPattern.test(input.trim())) {
        // Parse as local date by appending time component
        this.date = new Date(input + 'T00:00:00');
      } else {
        this.date = new Date(input);
      }
    } else {
      this.date = new Date(input);
    }
  }

  /**
   * Factory method to create a WristWatch instance representing the current time
   * 
   * @param timezoneOrUtc - Optional timezone string (e.g., 'Asia/Tokyo') or boolean (true for UTC)
   * @returns WristWatch instance with current time
   * 
   * @example
   * // Get current time in local timezone
   * const localNow = WristWatch.now();
   * 
   * // Get current time in UTC
   * const utcNow = WristWatch.now(true);
   * 
   * // Get current time in a specific timezone
   * const tokyoNow = WristWatch.now('Asia/Tokyo');
   * const nyNow = WristWatch.now('America/New_York');
   * 
   * @remarks
   * When a timezone string is provided, the returned WristWatch represents the
   * current moment in time (same UTC timestamp), but can be formatted in that timezone.
   * Note: JavaScript Date objects store UTC timestamps internally; timezone is
   * primarily a formatting concern.
   */
  static now(timezoneOrUtc?: string | boolean): WristWatch {
    const currentDate = new Date();
    
    if (timezoneOrUtc === undefined) {
      // Return current time in local timezone
      return new WristWatch(currentDate);
    }
    
    if (timezoneOrUtc === true) {
      // Return current time in UTC
      return new WristWatch(currentDate);
    }
    
    if (typeof timezoneOrUtc === 'string') {
      // Return current time adjusted to specified timezone
      // We create a WristWatch with the current UTC time
      // The timezone conversion will be handled by timezone utilities later
      return new WristWatch(currentDate);
    }
    
    return new WristWatch(currentDate);
  }

  /**
   * Gets the underlying Date object
   * 
   * @returns A copy of the internal Date object
   * 
   * @example
   * const ww = WristWatch.now();
   * const date = ww.getDate();
   * 
   * // Use with native Date methods
   * console.log(date.toISOString());
   * console.log(date.getTime());
   * 
   * @remarks
   * Returns a copy to maintain immutability. Modifying the returned Date
   * will not affect the WristWatch instance.
   */
  getDate(): Date {
    return new Date(this.date.getTime());
  }

  /**
   * Gets the Unix timestamp in milliseconds
   * 
   * @returns Timestamp in milliseconds since Unix epoch (January 1, 1970, 00:00:00 UTC)
   * 
   * @example
   * const ww = new WristWatch('2025-12-05T10:00:00Z');
   * const timestamp = ww.getTimestamp(); // 1733396400000
   * 
   * // Use for comparisons
   * const now = WristWatch.now();
   * if (ww.getTimestamp() < now.getTimestamp()) {
   *   console.log('ww is in the past');
   * }
   * 
   * @remarks
   * JavaScript timestamps are in milliseconds, unlike Unix timestamps which
   * are typically in seconds. To convert to seconds, divide by 1000.
   */
  getTimestamp(): number {
    return this.date.getTime();
  }

  /**
   * Gets the year
   * @returns Full year (e.g., 2025)
   */
  getYear(): number {
    return this.date.getFullYear();
  }

  /**
   * Gets the month
   * @param format - Optional format: 'long' for full name, 'short' for abbreviated name
   * @returns Month number (1-12) by default, or month name if format is specified
   * 
   * @example
   * const ww = new WristWatch('2025-12-06');
   * ww.getMonth();         // 12
   * ww.getMonth('long');   // "December"
   * ww.getMonth('short');  // "Dec"
   */
  getMonth(format?: 'long' | 'short'): number | string {
    const monthIndex = this.date.getMonth();
    
    if (format === 'long') {
      const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                          'July', 'August', 'September', 'October', 'November', 'December'];
      return monthNames[monthIndex];
    }
    
    if (format === 'short') {
      const monthNamesShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                               'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return monthNamesShort[monthIndex];
    }
    
    return monthIndex + 1; // JavaScript months are 0-indexed
  }

  /**
   * Gets the day of the month, or day of week name if format is specified
   * @param format - Optional format: 'long' for full day name, 'short' for abbreviated day name
   * @returns Day of month (1-31) by default, or day of week name if format is specified
   * 
   * @example
   * const ww = new WristWatch('2025-12-06'); // Saturday
   * ww.getDay();         // 6 (day of month)
   * ww.getDay('long');   // "Saturday" (day of week)
   * ww.getDay('short');  // "Sat" (day of week)
   */
  getDay(format?: 'long' | 'short'): number | string {
    if (format === 'long') {
      const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      return dayNames[this.date.getDay()];
    }
    
    if (format === 'short') {
      const dayNamesShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      return dayNamesShort[this.date.getDay()];
    }
    
    return this.date.getDate();
  }

  /**
   * Gets the hours
   * @returns Hours (0-23)
   */
  getHours(): number {
    return this.date.getHours();
  }

  /**
   * Gets the minutes
   * @returns Minutes (0-59)
   */
  getMinutes(): number {
    return this.date.getMinutes();
  }

  /**
   * Gets the seconds
   * @returns Seconds (0-59)
   */
  getSeconds(): number {
    return this.date.getSeconds();
  }

  /**
   * Gets all date/time components
   * 
   * @returns Object containing all date/time components (year, month, day, hour, minute, second, millisecond)
   * 
   * @example
   * const ww = new WristWatch('2025-12-05T14:30:45.123Z');
   * const components = ww.getComponents();
   * // {
   * //   year: 2025,
   * //   month: 12,
   * //   day: 5,
   * //   hour: 14,
   * //   minute: 30,
   * //   second: 45,
   * //   millisecond: 123
   * // }
   * 
   * @remarks
   * Month is 1-indexed (1 = January, 12 = December), unlike JavaScript's
   * native Date.getMonth() which is 0-indexed.
   */
  getComponents(): DateComponents {
    return {
      year: this.getYear(),
      month: this.getMonth() as number, // Always returns number when no format specified
      day: this.getDay() as number,     // Always returns number when no format specified
      hour: this.getHours(),
      minute: this.getMinutes(),
      second: this.getSeconds(),
      millisecond: this.date.getMilliseconds(),
    };
  }

  /**
   * Converts this date to a specific timezone
   * 
   * @param timezone - IANA timezone identifier (e.g., 'America/New_York', 'Asia/Tokyo', 'Europe/London')
   * @returns New WristWatch instance in the specified timezone, or null if timezone is invalid
   * 
   * @example
   * const utc = new WristWatch('2025-12-05T12:00:00Z');
   * 
   * // Convert to different timezones
   * const tokyo = utc.toTimezone('Asia/Tokyo');
   * const newYork = utc.toTimezone('America/New_York');
   * const london = utc.toTimezone('Europe/London');
   * 
   * // Invalid timezone returns null
   * const invalid = utc.toTimezone('Invalid/Timezone'); // null
   * 
   * @remarks
   * Returns null for invalid timezone identifiers. Always check the result
   * before using. The returned WristWatch represents the same moment in time
   * (same UTC timestamp) but can be formatted in the target timezone.
   */
  toTimezone(timezone: string): WristWatch | null {
    const converted = convertToTimezone(this.date, timezone);
    return converted ? new WristWatch(converted) : null;
  }

  /**
   * Converts this date to UTC
   * @returns New WristWatch instance in UTC
   */
  toUTC(): WristWatch {
    const converted = convertToUTC(this.date);
    return new WristWatch(converted);
  }

  /**
   * Converts this date to local timezone
   * @returns New WristWatch instance in local timezone
   */
  toLocal(): WristWatch {
    const converted = convertToLocal(this.date);
    return new WristWatch(converted);
  }

  /**
   * Converts this date to an ISO 8601 string
   * @returns ISO 8601 formatted string
   */
  toISO(): string {
    return this.date.toISOString();
  }

  /**
   * Formats this date according to a pattern string
   * @param pattern - Format pattern (defaults to 'YYYY-MM-DD HH:mm:ss')
   * @returns Formatted date string
   * 
   * @example
   * const ww = WristWatch.now();
   * ww.format(); // "2025-12-06 14:30:45" (default format)
   * ww.format('YYYY-MM-DD'); // "2025-12-05"
   * ww.format('HH:mm:ss'); // "14:30:45"
   * ww.format('MMMM D, YYYY'); // "December 5, 2025"
   */
  format(pattern: FormatPattern = 'YYYY-MM-DD HH:mm:ss'): string {
    return formatDate(this.date, pattern);
  }

  /**
   * Formats this date as a short date string
   * @param locale - Optional locale for formatting (defaults to 'en-US')
   * @returns Short date string (e.g., "12/05/2025")
   * 
   * @example
   * const ww = WristWatch.now();
   * ww.toShortDate(); // "12/5/2025"
   * ww.toShortDate('fr-FR'); // "05/12/2025"
   */
  toShortDate(locale?: string): string {
    return formatShortDate(this.date, locale);
  }

  /**
   * Formats this date as a long date string
   * @param locale - Optional locale for formatting (defaults to 'en-US')
   * @returns Long date string (e.g., "Friday, December 5, 2025")
   * 
   * @example
   * const ww = WristWatch.now();
   * ww.toLongDate(); // "Friday, December 5, 2025"
   * ww.toLongDate('fr-FR'); // "vendredi 5 décembre 2025"
   */
  toLongDate(locale?: string): string {
    return formatLongDate(this.date, locale);
  }

  /**
   * Formats this date as a relative time description
   * @param referenceDate - Optional reference date (defaults to now)
   * @returns Relative time string (e.g., "2 hours ago", "in 3 days")
   * 
   * @example
   * const past = new WristWatch(new Date('2025-12-03'));
   * past.toRelative(); // "2 days ago"
   * 
   * const future = new WristWatch(new Date('2025-12-10'));
   * future.toRelative(); // "in 5 days"
   */
  toRelative(referenceDate?: Date): string {
    return formatRelative(this.date, referenceDate);
  }

  /**
   * Formats this date with locale-specific formatting
   * @param locale - Locale identifier (e.g., 'en-US', 'fr-FR', 'ja-JP')
   * @param options - Optional Intl.DateTimeFormat options
   * @returns Locale-formatted date string
   * 
   * @example
   * const ww = WristWatch.now();
   * ww.formatWithLocale('en-US'); // "12/5/2025, 2:30:45 PM"
   * ww.formatWithLocale('ja-JP'); // "2025/12/5 14:30:45"
   */
  formatWithLocale(locale: string, options?: Intl.DateTimeFormatOptions): string {
    return formatWithLocale(this.date, locale, options);
  }

  /**
   * Checks if this date equals another date (same moment in time)
   * @param other - WristWatch instance to compare with
   * @returns True if dates represent the same moment in time
   */
  equals(other: WristWatch): boolean {
    return this.getTimestamp() === other.getTimestamp();
  }

  /**
   * Adds a specified amount of time to this date
   * @param amount - The amount to add
   * @param unit - The time unit (year, month, week, day, hour, minute, second, millisecond)
   * @returns A new WristWatch instance with the time added
   * 
   * @example
   * const ww = WristWatch.now();
   * const tomorrow = ww.add(1, 'day');
   * const nextWeek = ww.add(1, 'week');
   * const nextMonth = ww.add(1, 'month');
   */
  add(amount: number, unit: TimeUnit): WristWatch {
    const newDate = addTime(this.date, amount, unit);
    return new WristWatch(newDate);
  }

  /**
   * Subtracts a specified amount of time from this date
   * @param amount - The amount to subtract
   * @param unit - The time unit (year, month, week, day, hour, minute, second, millisecond)
   * @returns A new WristWatch instance with the time subtracted
   * 
   * @example
   * const ww = WristWatch.now();
   * const yesterday = ww.subtract(1, 'day');
   * const lastWeek = ww.subtract(1, 'week');
   * const lastMonth = ww.subtract(1, 'month');
   */
  subtract(amount: number, unit: TimeUnit): WristWatch {
    const newDate = subtractTime(this.date, amount, unit);
    return new WristWatch(newDate);
  }

  /**
   * Calculates the difference between this date and another date
   * @param other - The other WristWatch instance to compare with
   * @param unit - The time unit to return the difference in (defaults to 'day')
   * @returns The difference in the specified unit (this - other)
   * 
   * @example
   * const date1 = new WristWatch(new Date('2025-12-10'));
   * const date2 = new WristWatch(new Date('2025-12-05'));
   * const daysDiff = date1.diff(date2); // 5 (defaults to days)
   * const hoursDiff = date1.diff(date2, 'hour'); // 120
   */
  diff(other: WristWatch, unit: TimeUnit = 'day'): number {
    return diffTime(this.date, other.date, unit);
  }

  /**
   * Checks if this date is before another date
   * Comparison is timezone-independent (compares UTC timestamps)
   * @param other - WristWatch instance to compare with
   * @returns True if this date is before the other date
   * 
   * @example
   * const date1 = new WristWatch(new Date('2025-12-05'));
   * const date2 = new WristWatch(new Date('2025-12-10'));
   * date1.isBefore(date2); // true
   */
  isBefore(other: WristWatch): boolean {
    return isBeforeDate(this.date, other.date);
  }

  /**
   * Checks if this date is after another date
   * Comparison is timezone-independent (compares UTC timestamps)
   * @param other - WristWatch instance to compare with
   * @returns True if this date is after the other date
   * 
   * @example
   * const date1 = new WristWatch(new Date('2025-12-10'));
   * const date2 = new WristWatch(new Date('2025-12-05'));
   * date1.isAfter(date2); // true
   */
  isAfter(other: WristWatch): boolean {
    return isAfterDate(this.date, other.date);
  }

  /**
   * Checks if this date falls within a range (inclusive)
   * Comparison is timezone-independent (compares UTC timestamps)
   * @param start - Start of the range
   * @param end - End of the range
   * @returns True if this date is between start and end (inclusive)
   * 
   * @example
   * const date = new WristWatch(new Date('2025-12-07'));
   * const start = new WristWatch(new Date('2025-12-05'));
   * const end = new WristWatch(new Date('2025-12-10'));
   * date.isBetween(start, end); // true
   */
  isBetween(start: WristWatch, end: WristWatch): boolean {
    return isBetweenDates(this.date, start.date, end.date);
  }
}
