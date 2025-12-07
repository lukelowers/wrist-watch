/**
 * Timezone conversion utilities using native Intl.DateTimeFormat API
 * Provides zero-dependency timezone support for modern JavaScript environments
 */

/**
 * Gets the timezone offset in minutes for a given timezone at a specific date
 * Accounts for daylight saving time (DST) transitions
 * 
 * @param date - The date to get the offset for
 * @param timezone - IANA timezone identifier (e.g., 'America/New_York', 'Asia/Tokyo', 'Europe/London')
 * @returns Offset in minutes from UTC (positive = ahead of UTC, negative = behind UTC), or null if timezone is invalid
 * 
 * @example
 * const date = new Date('2025-12-05T12:00:00Z');
 * 
 * // Get offset for New York (EST, UTC-5)
 * getTimezoneOffset(date, 'America/New_York'); // -300 (5 hours behind UTC)
 * 
 * // Get offset for Tokyo (JST, UTC+9)
 * getTimezoneOffset(date, 'Asia/Tokyo'); // 540 (9 hours ahead of UTC)
 * 
 * // Get offset for London (GMT/BST)
 * getTimezoneOffset(date, 'Europe/London'); // 0 (in winter) or 60 (in summer)
 * 
 * // Invalid timezone
 * getTimezoneOffset(date, 'Invalid/Timezone'); // null
 * 
 * @remarks
 * The offset automatically accounts for DST. The same timezone may have different
 * offsets depending on the date (e.g., EST vs EDT in New York).
 */
export function getTimezoneOffset(date: Date, timezone: string): number | null {
  try {
    // Get the date parts in the target timezone
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });

    const parts = formatter.formatToParts(date);
    const partsMap: Record<string, string> = {};
    
    for (const part of parts) {
      if (part.type !== 'literal') {
        partsMap[part.type] = part.value;
      }
    }

    // Construct a date string in the target timezone
    const tzDateString = `${partsMap.year}-${partsMap.month}-${partsMap.day}T${partsMap.hour}:${partsMap.minute}:${partsMap.second}`;
    const tzDate = new Date(tzDateString);
    
    // Calculate the offset: difference between UTC time and local time in the timezone
    const utcTime = date.getTime();
    const tzTime = tzDate.getTime();
    
    // Offset in minutes (how many minutes ahead of UTC)
    const offsetMinutes = (tzTime - utcTime) / (1000 * 60);
    
    return -offsetMinutes; // Negate because we want "ahead of UTC" to be positive
  } catch (error) {
    // Invalid timezone
    return null;
  }
}

/**
 * Converts a date to a specific timezone
 * Returns a new Date object representing the same moment in time
 * 
 * @param date - The date to convert
 * @param timezone - IANA timezone identifier (e.g., 'America/Los_Angeles', 'Europe/Paris', 'Asia/Dubai')
 * @returns New Date object representing the same moment in time, or null if timezone is invalid
 * 
 * @example
 * const utcDate = new Date('2025-12-05T12:00:00Z');
 * 
 * // Convert to Tokyo time
 * const tokyoDate = convertToTimezone(utcDate, 'Asia/Tokyo');
 * // tokyoDate represents the same moment, but can be formatted in Tokyo time
 * 
 * // Convert to New York time
 * const nyDate = convertToTimezone(utcDate, 'America/New_York');
 * 
 * // Invalid timezone returns null
 * const invalid = convertToTimezone(utcDate, 'Invalid/Zone'); // null
 * 
 * @remarks
 * Note: JavaScript Date objects internally store UTC timestamps. This function
 * validates the timezone and returns a new Date object. The timezone information
 * is used when formatting the date, not stored in the Date object itself.
 */
export function convertToTimezone(date: Date, timezone: string): Date | null {
  try {
    // Validate timezone by attempting to use it
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });

    // Format the date in the target timezone
    const parts = formatter.formatToParts(date);
    const partsMap: Record<string, string> = {};
    
    for (const part of parts) {
      if (part.type !== 'literal') {
        partsMap[part.type] = part.value;
      }
    }

    // The Date object itself represents a moment in time (UTC timestamp)
    // We return the same Date object since it already represents the correct moment
    // The timezone is just a display concern
    return new Date(date.getTime());
  } catch (error) {
    return null;
  }
}

/**
 * Converts a date to UTC
 * Returns a new Date object representing the same moment in time
 * 
 * @param date - The date to convert
 * @returns New Date object in UTC
 * 
 * @example
 * const localDate = new Date('2025-12-05T12:00:00');
 * const utcDate = convertToUTC(localDate);
 * 
 * // Format in UTC
 * console.log(utcDate.toISOString()); // "2025-12-05T12:00:00.000Z"
 * 
 * @remarks
 * JavaScript Date objects always store UTC timestamps internally. This function
 * returns a new Date object with the same timestamp for consistency with other
 * conversion functions.
 */
export function convertToUTC(date: Date): Date {
  return new Date(date.getTime());
}

/**
 * Converts a date to local timezone
 * Returns a new Date object representing the same moment in time
 * 
 * @param date - The date to convert
 * @returns New Date object in local timezone
 * 
 * @example
 * const utcDate = new Date('2025-12-05T12:00:00Z');
 * const localDate = convertToLocal(utcDate);
 * 
 * // Format in local timezone
 * console.log(localDate.toLocaleString()); // Formatted in system timezone
 * 
 * @remarks
 * JavaScript Date objects always store UTC timestamps internally. This function
 * returns a new Date object with the same timestamp. The "local" timezone is
 * determined by the system's timezone settings.
 */
export function convertToLocal(date: Date): Date {
  return new Date(date.getTime());
}

/**
 * Gets the local timezone identifier
 * Returns the IANA timezone identifier for the system's current timezone
 * 
 * @returns IANA timezone identifier for the local timezone (e.g., 'America/New_York', 'Europe/London')
 * 
 * @example
 * // Get the system's timezone
 * const tz = getLocalTimezone();
 * console.log(tz); // "America/New_York" (if system is in Eastern Time)
 * 
 * // Use it for timezone conversions
 * const date = new Date();
 * const localTz = getLocalTimezone();
 * console.log(`Current timezone: ${localTz}`);
 * 
 * @remarks
 * The timezone is determined by the system's settings and may change if the
 * user travels or manually changes their timezone settings.
 */
export function getLocalTimezone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}
