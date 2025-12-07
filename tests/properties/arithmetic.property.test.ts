import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { WristWatch } from '../../src/core/WristWatch';
import type { TimeUnit } from '../../src/core/types';

describe('WristWatch Arithmetic Properties', () => {
  /**
   * Feature: quick-datetime, Property 12: Arithmetic round-trip
   * Validates: Requirements 4.1, 4.2
   * 
   * For any date, time unit, and amount, adding then subtracting the same amount
   * should return the original date.
   */
  it('Property 12: Arithmetic round-trip', () => {
    const timeUnits: TimeUnit[] = ['year', 'month', 'week', 'day', 'hour', 'minute', 'second', 'millisecond'];
    
    // Use a practical date range (1900-2100) to avoid edge cases at JavaScript Date boundaries
    const practicalDateArbitrary = fc.date({ min: new Date('1900-01-01'), max: new Date('2100-12-31') });
    
    fc.assert(
      fc.property(
        practicalDateArbitrary,
        fc.constantFrom(...timeUnits),
        fc.integer({ min: -100, max: 100 }),
        (date, unit, amount) => {
          // Create a WristWatch from the date
          const original = new WristWatch(date);
          
          // Add then subtract the same amount
          const added = original.add(amount, unit);
          const roundTrip = added.subtract(amount, unit);
          
          // For most units, the round-trip should be exact
          // However, for months and years, there can be edge cases due to variable month lengths
          if (unit === 'month' || unit === 'year') {
            // For month/year operations, we allow some tolerance due to variable month lengths
            // For example: Jan 31 + 1 month = Feb 28, Feb 28 - 1 month = Jan 28 (not Jan 31)
            // We check that the difference is small (within a few days)
            const diffDays = Math.abs(roundTrip.diff(original, 'day'));
            
            // If the original day is > 28, we might lose precision
            const originalDay = original.getDay();
            if (originalDay > 28) {
              // Allow up to 3 days difference for edge cases
              expect(diffDays).toBeLessThanOrEqual(3);
            } else {
              // For days <= 28, round-trip should be exact
              expect(roundTrip.equals(original)).toBe(true);
            }
          } else {
            // For other units, round-trip should be exact
            expect(roundTrip.equals(original)).toBe(true);
            expect(roundTrip.getTimestamp()).toBe(original.getTimestamp());
          }
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: quick-datetime, Property 13: Difference calculation correctness
   * Validates: Requirements 4.3
   * 
   * For any two dates and time unit, the difference should correctly represent
   * the duration between them in that unit.
   */
  it('Property 13: Difference calculation correctness', () => {
    const timeUnits: TimeUnit[] = ['year', 'month', 'week', 'day', 'hour', 'minute', 'second', 'millisecond'];
    
    // Use a practical date range (1900-2100) to avoid floating-point precision issues with very large time spans
    const practicalDateArbitrary = fc.date({ min: new Date('1900-01-01'), max: new Date('2100-12-31') });
    
    fc.assert(
      fc.property(
        practicalDateArbitrary,
        practicalDateArbitrary,
        fc.constantFrom(...timeUnits),
        (date1, date2, unit) => {
          const ww1 = new WristWatch(date1);
          const ww2 = new WristWatch(date2);
          
          // Calculate the difference
          const difference = ww1.diff(ww2, unit);
          
          // The difference should be a number
          expect(typeof difference).toBe('number');
          expect(isNaN(difference)).toBe(false);
          
          // Verify symmetry: diff(a, b) = -diff(b, a)
          const reverseDifference = ww2.diff(ww1, unit);
          
          // For month and year, we use integer arithmetic, so we check approximate symmetry
          if (unit === 'month' || unit === 'year') {
            // The reverse should be approximately negative
            expect(Math.abs(difference + reverseDifference)).toBeLessThanOrEqual(1);
          } else {
            // For other units, should be exact
            expect(difference).toBeCloseTo(-reverseDifference, 5);
          }
          
          // Verify that the difference accurately represents the duration
          // For non-month/year units, convert the difference back to milliseconds and compare
          if (unit !== 'month' && unit !== 'year') {
            const actualDiffMs = ww1.getTimestamp() - ww2.getTimestamp();
            const unitInMs = getUnitInMilliseconds(unit);
            const calculatedDiffMs = difference * unitInMs;
            
            // The calculated difference should be close to the actual difference
            // Allow for rounding error (up to 0.5 units)
            const tolerance = unitInMs / 2;
            expect(Math.abs(actualDiffMs - calculatedDiffMs)).toBeLessThanOrEqual(tolerance);
          }
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});

/**
 * Helper function to get the approximate milliseconds for a time unit
 */
function getUnitInMilliseconds(unit: TimeUnit): number {
  switch (unit) {
    case 'millisecond': return 1;
    case 'second': return 1000;
    case 'minute': return 1000 * 60;
    case 'hour': return 1000 * 60 * 60;
    case 'day': return 1000 * 60 * 60 * 24;
    case 'week': return 1000 * 60 * 60 * 24 * 7;
    case 'month': return 1000 * 60 * 60 * 24 * 30; // Approximate
    case 'year': return 1000 * 60 * 60 * 24 * 365; // Approximate
  }
}
