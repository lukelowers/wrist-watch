import { WristWatch } from '../core/WristWatch';

/**
 * Parses a Unix timestamp (in milliseconds) into a WristWatch instance
 * 
 * @param input - Unix timestamp in milliseconds since epoch (January 1, 1970, 00:00:00 UTC)
 * @returns WristWatch instance representing the timestamp
 * 
 * @example
 * // Parse a timestamp
 * const ww = parseTimestamp(1733396400000);
 * console.log(ww.toISO()); // "2024-12-05T09:00:00.000Z"
 * 
 * // Parse current timestamp
 * const now = parseTimestamp(Date.now());
 * 
 * @remarks
 * Note: JavaScript timestamps are in milliseconds, not seconds.
 * If you have a Unix timestamp in seconds, multiply by 1000 first.
 */
export function parseTimestamp(input: number): WristWatch {
  return new WristWatch(input);
}
