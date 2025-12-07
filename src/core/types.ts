/**
 * Time units supported for date arithmetic operations
 */
export type TimeUnit = 'year' | 'month' | 'week' | 'day' | 'hour' | 'minute' | 'second' | 'millisecond';

/**
 * Format pattern string for date/time formatting
 * Examples: 'YYYY-MM-DD', 'HH:mm:ss', 'MMMM D, YYYY'
 */
export type FormatPattern = string;

/**
 * Result type for parsing operations that may fail
 */
export type ParseResult<T> = 
  | { success: true; value: T }
  | { success: false; error: string };

/**
 * Individual date/time components
 */
export interface DateComponents {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
  millisecond: number;
}
