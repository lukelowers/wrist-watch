import type { ParseResult } from '../core/types';
import { WristWatch } from '../core/WristWatch';
import { parseISO } from './iso';
import { parseTimestamp } from './timestamp';

/**
 * General parse function that attempts to parse various date formats
 * Tries ISO 8601 format first, then falls back to native Date parsing
 * 
 * @param input - String or number to parse (number is treated as Unix timestamp in milliseconds)
 * @returns ParseResult containing either the parsed WristWatch or an error
 * 
 * @example
 * // Parse ISO 8601 string
 * const result1 = parse('2025-12-05T10:30:00Z');
 * if (result1.success) {
 *   console.log(result1.value.getYear()); // 2025
 * }
 * 
 * // Parse Unix timestamp
 * const result2 = parse(1733396400000);
 * if (result2.success) {
 *   console.log(result2.value.toISO());
 * }
 * 
 * // Handle parse errors
 * const result3 = parse('invalid-date');
 * if (!result3.success) {
 *   console.error(result3.error);
 * }
 */
export function parse(input: string | number): ParseResult<WristWatch> {
  // Handle number input (timestamp)
  if (typeof input === 'number') {
    try {
      const ww = parseTimestamp(input);
      return {
        success: true,
        value: ww,
      };
    } catch (error) {
      return {
        success: false,
        error: `Invalid timestamp: ${error instanceof Error ? error.message : String(error)}`,
      };
    }
  }

  // Handle string input
  if (typeof input === 'string') {
    // Try ISO 8601 format first
    const isoResult = parseISO(input);
    if (isoResult.success) {
      return isoResult;
    }

    // Try native Date parsing as fallback
    try {
      const date = new Date(input);
      if (!isNaN(date.getTime())) {
        return {
          success: true,
          value: new WristWatch(date),
        };
      }
    } catch {
      // Fall through to error
    }

    return {
      success: false,
      error: `Unable to parse date string: ${input}`,
    };
  }

  return {
    success: false,
    error: 'Input must be a string or number',
  };
}

export { parseISO } from './iso';
export { parseTimestamp } from './timestamp';
export { parseCustom } from './custom';
