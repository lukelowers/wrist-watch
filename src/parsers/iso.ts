import type { ParseResult } from '../core/types';
import { WristWatch } from '../core/WristWatch';

/**
 * Parses an ISO 8601 date string into a WristWatch instance
 * Supports various ISO 8601 formats including date-only, date-time, and timezone offsets
 * 
 * @param input - ISO 8601 formatted date string (e.g., '2025-12-05T10:30:00Z', '2025-12-05', '2025-12-05T10:30:00+05:30')
 * @returns ParseResult containing either the parsed WristWatch or an error
 * 
 * @example
 * // Parse ISO 8601 with UTC timezone
 * const result1 = parseISO('2025-12-05T10:30:00Z');
 * if (result1.success) {
 *   console.log(result1.value.toISO());
 * }
 * 
 * // Parse date-only format
 * const result2 = parseISO('2025-12-05');
 * 
 * // Parse with timezone offset
 * const result3 = parseISO('2025-12-05T10:30:00+05:30');
 * 
 * // Handle invalid input
 * const result4 = parseISO('not-a-date');
 * if (!result4.success) {
 *   console.error(result4.error);
 * }
 */
export function parseISO(input: string): ParseResult<WristWatch> {
  if (typeof input !== 'string') {
    return {
      success: false,
      error: 'Input must be a string',
    };
  }

  if (input.trim() === '') {
    return {
      success: false,
      error: 'Input string cannot be empty',
    };
  }

  try {
    const date = new Date(input);
    
    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return {
        success: false,
        error: `Invalid ISO 8601 date string: ${input}`,
      };
    }

    return {
      success: true,
      value: new WristWatch(date),
    };
  } catch (error) {
    return {
      success: false,
      error: `Failed to parse ISO date: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}
