import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { WristWatch } from '../../src/core/WristWatch';
import { parseISO, parseTimestamp, parseCustom } from '../../src/parsers';

describe('WristWatch Parsing Properties', () => {
  /**
   * Feature: quick-datetime, Property 7: ISO parsing round-trip
   * Validates: Requirements 3.1
   * 
   * For any valid WristWatch date object, converting to ISO string and parsing back
   * should produce an equivalent date (same timestamp).
   */
  it('Property 7: ISO parsing round-trip', () => {
    fc.assert(
      fc.property(fc.date(), (date) => {
        // Create a WristWatch from the date
        const original = new WristWatch(date);
        
        // Convert to ISO string
        const isoString = original.toISO();
        
        // Parse back from ISO string
        const parsed = parseISO(isoString);
        
        // Should successfully parse
        expect(parsed.success).toBe(true);
        
        if (parsed.success) {
          // Timestamps should be equal
          expect(parsed.value.getTimestamp()).toBe(original.getTimestamp());
          
          // Should be equal using equals method
          expect(parsed.value.equals(original)).toBe(true);
        }
        
        return true;
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: quick-datetime, Property 8: Timestamp conversion round-trip
   * Validates: Requirements 3.2
   * 
   * For any WristWatch date object, converting to timestamp and back
   * should preserve the original date value.
   */
  it('Property 8: Timestamp conversion round-trip', () => {
    fc.assert(
      fc.property(fc.date(), (date) => {
        // Create a WristWatch from the date
        const original = new WristWatch(date);
        
        // Get the timestamp
        const timestamp = original.getTimestamp();
        
        // Parse back from timestamp
        const parsed = parseTimestamp(timestamp);
        
        // Timestamps should be equal
        expect(parsed.getTimestamp()).toBe(original.getTimestamp());
        
        // Should be equal using equals method
        expect(parsed.equals(original)).toBe(true);
        
        return true;
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: quick-datetime, Property 9: Invalid input error handling
   * Validates: Requirements 3.3
   * 
   * For any invalid date string (malformed, nonsensical values),
   * parsing should return an error indicator without throwing exceptions.
   */
  it('Property 9: Invalid input error handling', () => {
    // Generate various types of invalid inputs that JavaScript Date cannot parse
    const invalidInputs = fc.oneof(
      fc.constant(''),
      fc.constant('not-a-date'),
      fc.constant('abcdefgh'),
      fc.constant('invalid-date-string'),
      fc.constant('2025-13-01T00:00:00Z'), // Invalid month
      fc.constant('2025-00-01T00:00:00Z'), // Invalid month (0)
      fc.string().filter(s => {
        // Only include strings that JavaScript Date truly cannot parse
        if (s.trim() === '') return true;
        const date = new Date(s);
        return isNaN(date.getTime());
      })
    );

    fc.assert(
      fc.property(invalidInputs, (invalidInput) => {
        // Should not throw an exception
        let didThrow = false;
        let result;
        
        try {
          result = parseISO(invalidInput);
        } catch (error) {
          didThrow = true;
        }
        
        // Should not throw
        expect(didThrow).toBe(false);
        
        // Should return an error result
        if (result) {
          expect(result.success).toBe(false);
          if (!result.success) {
            expect(result.error).toBeTruthy();
            expect(typeof result.error).toBe('string');
          }
        }
        
        return true;
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: quick-datetime, Property 10: Custom format round-trip
   * Validates: Requirements 3.4
   * 
   * For any date and format pattern, formatting then parsing with the same pattern
   * should produce an equivalent date.
   */
  it('Property 10: Custom format round-trip', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 2000, max: 2099 }),
        fc.integer({ min: 1, max: 12 }),
        fc.integer({ min: 1, max: 28 }),
        fc.integer({ min: 0, max: 23 }),
        fc.integer({ min: 0, max: 59 }),
        fc.integer({ min: 0, max: 59 }),
        (year, month, day, hour, minute, second) => {
          // Test with YYYY-MM-DD format
          const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const parsed = parseCustom(dateStr, 'YYYY-MM-DD');
          
          expect(parsed.success).toBe(true);
          
          if (parsed.success) {
            expect(parsed.value.getYear()).toBe(year);
            expect(parsed.value.getMonth()).toBe(month);
            expect(parsed.value.getDay()).toBe(day);
          }
          
          // Test with YYYY-MM-DD HH:mm:ss format
          const dateTimeStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')} ${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:${String(second).padStart(2, '0')}`;
          const parsedDateTime = parseCustom(dateTimeStr, 'YYYY-MM-DD HH:mm:ss');
          
          expect(parsedDateTime.success).toBe(true);
          
          if (parsedDateTime.success) {
            expect(parsedDateTime.value.getYear()).toBe(year);
            expect(parsedDateTime.value.getMonth()).toBe(month);
            expect(parsedDateTime.value.getDay()).toBe(day);
            expect(parsedDateTime.value.getHours()).toBe(hour);
            expect(parsedDateTime.value.getMinutes()).toBe(minute);
            expect(parsedDateTime.value.getSeconds()).toBe(second);
          }
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: quick-datetime, Property 11: Component access correctness
   * Validates: Requirements 3.5
   * 
   * For any parsed date, the individual components (year, month, day, hour, minute, second)
   * should match the values in the original date string.
   */
  it('Property 11: Component access correctness', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 2000, max: 2099 }),
        fc.integer({ min: 1, max: 12 }),
        fc.integer({ min: 1, max: 28 }), // Use 28 to avoid invalid dates
        fc.integer({ min: 0, max: 23 }),
        fc.integer({ min: 0, max: 59 }),
        fc.integer({ min: 0, max: 59 }),
        (year, month, day, hour, minute, second) => {
          // Create a date in local timezone (not UTC) to match how WristWatch returns components
          const date = new Date(year, month - 1, day, hour, minute, second, 0);
          
          // Skip this test case if DST caused the date to shift
          // (e.g., 2:00 AM doesn't exist during spring forward)
          if (date.getHours() !== hour) {
            return true; // Skip this case
          }
          
          const ww = new WristWatch(date);
          
          // Components should match the input values
          expect(ww.getYear()).toBe(year);
          expect(ww.getMonth()).toBe(month);
          expect(ww.getDay()).toBe(day);
          expect(ww.getHours()).toBe(hour);
          expect(ww.getMinutes()).toBe(minute);
          expect(ww.getSeconds()).toBe(second);
          
          // Test getComponents method
          const components = ww.getComponents();
          expect(components.year).toBe(year);
          expect(components.month).toBe(month);
          expect(components.day).toBe(day);
          expect(components.hour).toBe(hour);
          expect(components.minute).toBe(minute);
          expect(components.second).toBe(second);
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});
