import { WristWatch } from '../core/WristWatch';

/**
 * Factory function to create a WristWatch instance representing the current time
 * @param timezoneOrUtc - Optional timezone string (e.g., 'Asia/Tokyo') or boolean (true for UTC)
 * @returns WristWatch instance with current time
 * 
 * @example
 * // Get current time in local timezone
 * const localNow = now();
 * 
 * // Get current time in UTC
 * const utcNow = now(true);
 * 
 * // Get current time in a specific timezone
 * const tokyoNow = now('Asia/Tokyo');
 */
export function now(timezoneOrUtc?: string | boolean): WristWatch {
  return WristWatch.now(timezoneOrUtc);
}
