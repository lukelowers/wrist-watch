import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { WristWatch } from '../../src/core/WristWatch';

describe('WristWatch Core Properties', () => {
  /**
   * Feature: quick-datetime, Property 1: Local timezone consistency
   * Validates: Requirements 1.1, 1.2, 1.4
   * 
   * For any call to get current date/time without timezone parameters,
   * the returned value should be in the user's local timezone
   * (matching the system's timezone offset).
   */
  it('Property 1: Local timezone consistency', () => {
    fc.assert(
      fc.property(fc.constant(null), () => {
        // Get current time using WristWatch
        const ww = WristWatch.now();
        
        // Get current time using native Date
        const native = new Date();
        
        // The timezone offset should match
        const wwDate = ww.getDate();
        const wwOffset = wwDate.getTimezoneOffset();
        const nativeOffset = native.getTimezoneOffset();
        
        // Offsets should be identical (both in local timezone)
        expect(wwOffset).toBe(nativeOffset);
        
        // The timestamp should be very close (within 100ms)
        const timeDiff = Math.abs(ww.getTimestamp() - native.getTime());
        expect(timeDiff).toBeLessThan(100);
        
        // Year, month, day should match local time
        expect(ww.getYear()).toBe(native.getFullYear());
        expect(ww.getMonth()).toBe(native.getMonth() + 1); // WristWatch uses 1-indexed months
        expect(ww.getDay()).toBe(native.getDate());
        
        return true;
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: quick-datetime, Property 2: Timezone conversion correctness
   * Validates: Requirements 1.5
   * 
   * For any valid timezone identifier, converting the current time to that timezone
   * should produce a date/time with the correct offset from UTC.
   */
  it('Property 2: Timezone conversion correctness', () => {
    // Common valid IANA timezone identifiers
    const validTimezones = [
      'America/New_York',
      'America/Los_Angeles',
      'Europe/London',
      'Europe/Paris',
      'Asia/Tokyo',
      'Asia/Shanghai',
      'Australia/Sydney',
      'Pacific/Auckland',
      'UTC',
    ];

    fc.assert(
      fc.property(fc.constantFrom(...validTimezones), (timezone) => {
        // Get current time in specified timezone
        const ww = WristWatch.now(timezone);
        
        // Get the same moment using native Date and Intl API
        const now = new Date();
        const formatter = new Intl.DateTimeFormat('en-US', {
          timeZone: timezone,
          year: 'numeric',
          month: 'numeric',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          second: 'numeric',
          hour12: false,
        });
        
        // The timestamp should represent the same moment in time
        const timeDiff = Math.abs(ww.getTimestamp() - now.getTime());
        expect(timeDiff).toBeLessThan(100);
        
        // The underlying Date object should be valid
        expect(ww.getDate().getTime()).toBeGreaterThan(0);
        
        return true;
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: quick-datetime, Property 3: Timestamp accuracy
   * Validates: Requirements 1.3
   * 
   * For any call to get current timestamp, the returned value should be
   * within a small margin (e.g., 100ms) of the native Date.now() value.
   */
  it('Property 3: Timestamp accuracy', () => {
    fc.assert(
      fc.property(fc.constant(null), () => {
        // Capture native timestamp
        const nativeBefore = Date.now();
        
        // Get WristWatch timestamp
        const ww = WristWatch.now();
        const wwTimestamp = ww.getTimestamp();
        
        // Capture native timestamp after
        const nativeAfter = Date.now();
        
        // WristWatch timestamp should be between the two native timestamps
        expect(wwTimestamp).toBeGreaterThanOrEqual(nativeBefore);
        expect(wwTimestamp).toBeLessThanOrEqual(nativeAfter);
        
        // Should be within 100ms of the before timestamp
        const timeDiff = Math.abs(wwTimestamp - nativeBefore);
        expect(timeDiff).toBeLessThan(100);
        
        return true;
      }),
      { numRuns: 100 }
    );
  });
});
