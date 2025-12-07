import type { ParseResult } from '../core/types';
import { WristWatch } from '../core/WristWatch';

/**
 * Format token definitions for parsing
 */
const PARSE_TOKENS: Record<string, RegExp> = {
  'YYYY': /(\d{4})/,           // 4-digit year
  'YY': /(\d{2})/,             // 2-digit year
  'MMMM': /([A-Za-z]+)/,       // Full month name
  'MMM': /([A-Za-z]+)/,        // Short month name
  'MM': /(\d{2})/,             // 2-digit month
  'M': /(\d{1,2})/,            // 1 or 2-digit month
  'DD': /(\d{2})/,             // 2-digit day
  'D': /(\d{1,2})/,            // 1 or 2-digit day
  'HH': /(\d{2})/,             // 2-digit hour (24h)
  'H': /(\d{1,2})/,            // 1 or 2-digit hour (24h)
  'mm': /(\d{2})/,             // 2-digit minute
  'm': /(\d{1,2})/,            // 1 or 2-digit minute
  'ss': /(\d{2})/,             // 2-digit second
  's': /(\d{1,2})/,            // 1 or 2-digit second
  'SSS': /(\d{3})/,            // 3-digit millisecond
};

const MONTH_NAMES_FULL = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const MONTH_NAMES_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

/**
 * Parses a date string according to a custom format pattern
 * Supports various format tokens for flexible date parsing
 * 
 * @param input - Date string to parse
 * @param format - Format pattern using tokens (e.g., 'YYYY-MM-DD', 'MM/DD/YYYY HH:mm:ss', 'MMMM D, YYYY')
 * @returns ParseResult containing either the parsed WristWatch or an error
 * 
 * @example
 * // Parse US date format
 * const result1 = parseCustom('12/05/2025', 'MM/DD/YYYY');
 * if (result1.success) {
 *   console.log(result1.value.getYear()); // 2025
 * }
 * 
 * // Parse with time
 * const result2 = parseCustom('2025-12-05 14:30:45', 'YYYY-MM-DD HH:mm:ss');
 * 
 * // Parse with month name
 * const result3 = parseCustom('December 5, 2025', 'MMMM D, YYYY');
 * 
 * // Handle parse errors
 * const result4 = parseCustom('invalid', 'YYYY-MM-DD');
 * if (!result4.success) {
 *   console.error(result4.error);
 * }
 * 
 * @remarks
 * Supported format tokens:
 * - YYYY: 4-digit year
 * - YY: 2-digit year (assumes 20xx)
 * - MMMM: Full month name (e.g., "January")
 * - MMM: Short month name (e.g., "Jan")
 * - MM: 2-digit month (01-12)
 * - M: 1 or 2-digit month (1-12)
 * - DD: 2-digit day (01-31)
 * - D: 1 or 2-digit day (1-31)
 * - HH: 2-digit hour (00-23)
 * - H: 1 or 2-digit hour (0-23)
 * - mm: 2-digit minute (00-59)
 * - m: 1 or 2-digit minute (0-59)
 * - ss: 2-digit second (00-59)
 * - s: 1 or 2-digit second (0-59)
 * - SSS: 3-digit millisecond (000-999)
 */
export function parseCustom(input: string, format: string): ParseResult<WristWatch> {
  if (typeof input !== 'string' || typeof format !== 'string') {
    return {
      success: false,
      error: 'Input and format must be strings',
    };
  }

  if (input.trim() === '' || format.trim() === '') {
    return {
      success: false,
      error: 'Input and format cannot be empty',
    };
  }

  try {
    // Build a regex pattern from the format string
    const parts: Array<{ type: 'token' | 'literal', value: string }> = [];
    let remaining = format;
    const tokenOrder: string[] = [];

    // Sort tokens by length (longest first) to avoid partial matches
    const sortedTokens = Object.keys(PARSE_TOKENS).sort((a, b) => b.length - a.length);

    // Parse the format string into tokens and literals
    let iterations = 0;
    const maxIterations = format.length * 2; // Safety limit
    
    while (remaining.length > 0 && iterations < maxIterations) {
      iterations++;
      let foundToken = false;
      
      for (const token of sortedTokens) {
        if (remaining.startsWith(token)) {
          parts.push({ type: 'token', value: token });
          tokenOrder.push(token);
          remaining = remaining.substring(token.length);
          foundToken = true;
          break;
        }
      }
      
      if (!foundToken) {
        // It's a literal character
        parts.push({ type: 'literal', value: remaining[0] });
        remaining = remaining.substring(1);
      }
    }
    
    if (iterations >= maxIterations) {
      return {
        success: false,
        error: 'Format parsing exceeded maximum iterations',
      };
    }

    // Build the regex pattern
    let regexPattern = '';
    for (const part of parts) {
      if (part.type === 'token') {
        regexPattern += PARSE_TOKENS[part.value].source;
      } else {
        // Escape special regex characters in literals
        regexPattern += part.value.replace(/[.+?^${}()|[\]\\]/g, '\\$&');
      }
    }

    const regex = new RegExp(`^${regexPattern}$`);
    const match = input.match(regex);

    if (!match) {
      return {
        success: false,
        error: `Input "${input}" does not match format "${format}"`,
      };
    }

    // Extract values from the match
    const values: Record<string, string> = {};
    for (let i = 0; i < tokenOrder.length; i++) {
      values[tokenOrder[i]] = match[i + 1];
    }

    // Parse the values into date components
    let year = new Date().getFullYear();
    let month = 1;
    let day = 1;
    let hour = 0;
    let minute = 0;
    let second = 0;
    let millisecond = 0;

    // Year
    if (values['YYYY']) {
      year = parseInt(values['YYYY'], 10);
    } else if (values['YY']) {
      const yy = parseInt(values['YY'], 10);
      // Assume 20xx for years 00-99
      year = 2000 + yy;
    }

    // Month
    if (values['MMMM']) {
      const monthIndex = MONTH_NAMES_FULL.findIndex(
        m => m.toLowerCase() === values['MMMM'].toLowerCase()
      );
      if (monthIndex !== -1) {
        month = monthIndex + 1;
      }
    } else if (values['MMM']) {
      const monthIndex = MONTH_NAMES_SHORT.findIndex(
        m => m.toLowerCase() === values['MMM'].toLowerCase()
      );
      if (monthIndex !== -1) {
        month = monthIndex + 1;
      }
    } else if (values['MM']) {
      month = parseInt(values['MM'], 10);
    } else if (values['M']) {
      month = parseInt(values['M'], 10);
    }

    // Day
    if (values['DD']) {
      day = parseInt(values['DD'], 10);
    } else if (values['D']) {
      day = parseInt(values['D'], 10);
    }

    // Hour
    if (values['HH']) {
      hour = parseInt(values['HH'], 10);
    } else if (values['H']) {
      hour = parseInt(values['H'], 10);
    }

    // Minute
    if (values['mm']) {
      minute = parseInt(values['mm'], 10);
    } else if (values['m']) {
      minute = parseInt(values['m'], 10);
    }

    // Second
    if (values['ss']) {
      second = parseInt(values['ss'], 10);
    } else if (values['s']) {
      second = parseInt(values['s'], 10);
    }

    // Millisecond
    if (values['SSS']) {
      millisecond = parseInt(values['SSS'], 10);
    }

    // Create the date (month is 0-indexed in Date constructor)
    const date = new Date(year, month - 1, day, hour, minute, second, millisecond);

    // Validate the date
    if (isNaN(date.getTime())) {
      return {
        success: false,
        error: `Invalid date components parsed from "${input}"`,
      };
    }

    return {
      success: true,
      value: new WristWatch(date),
    };
  } catch (error) {
    return {
      success: false,
      error: `Failed to parse custom format: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}
