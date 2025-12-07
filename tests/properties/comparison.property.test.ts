import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { WristWatch } from '../../src/core/WristWatch';

describe('WristWatch Comparison Properties', () => {
  /**
   * Feature: quick-datetime, Property 14: Equality reflexivity and symmetry
   * Validates: Requirements 5.1
   * 
   * For any date, it should equal itself (reflexive), and if date A equals date B,
   * then date B should equal date A (symmetric).
   */
  it('Property 14: Equality reflexivity and symmetry', () => {
    fc.assert(
      fc.property(
        fc.date(),
        (date) => {
          const ww1 = new WristWatch(date);
          const ww2 = new WristWatch(date);
          
          // Reflexivity: a date should equal itself
          expect(ww1.equals(ww1)).toBe(true);
          
          // Symmetry: if ww1 equals ww2, then ww2 should equal ww1
          const ww1EqualsWw2 = ww1.equals(ww2);
          const ww2EqualsWw1 = ww2.equals(ww1);
          expect(ww1EqualsWw2).toBe(ww2EqualsWw1);
          
          // Both should be true since they represent the same moment
          expect(ww1EqualsWw2).toBe(true);
          expect(ww2EqualsWw1).toBe(true);
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: quick-datetime, Property 15: Ordering consistency
   * Validates: Requirements 5.2, 5.3
   * 
   * For any two dates A and B, if A is before B, then B should be after A,
   * and they should not be equal.
   */
  it('Property 15: Ordering consistency', () => {
    fc.assert(
      fc.property(
        fc.date(),
        fc.date(),
        (date1, date2) => {
          const ww1 = new WristWatch(date1);
          const ww2 = new WristWatch(date2);
          
          const ww1BeforeWw2 = ww1.isBefore(ww2);
          const ww2AfterWw1 = ww2.isAfter(ww1);
          const ww1EqualsWw2 = ww1.equals(ww2);
          
          // If ww1 is before ww2, then ww2 should be after ww1
          if (ww1BeforeWw2) {
            expect(ww2AfterWw1).toBe(true);
            expect(ww1EqualsWw2).toBe(false);
          }
          
          // If ww1 equals ww2, neither should be before or after the other
          if (ww1EqualsWw2) {
            expect(ww1BeforeWw2).toBe(false);
            expect(ww2AfterWw1).toBe(false);
            expect(ww1.isAfter(ww2)).toBe(false);
            expect(ww2.isBefore(ww1)).toBe(false);
          }
          
          // If ww1 is after ww2, then ww2 should be before ww1
          if (ww1.isAfter(ww2)) {
            expect(ww2.isBefore(ww1)).toBe(true);
            expect(ww1EqualsWw2).toBe(false);
          }
          
          // Exactly one of these should be true: before, after, or equals
          const conditions = [ww1BeforeWw2, ww1.isAfter(ww2), ww1EqualsWw2];
          const trueCount = conditions.filter(c => c).length;
          expect(trueCount).toBe(1);
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: quick-datetime, Property 16: Range checking correctness
   * Validates: Requirements 5.4
   * 
   * For any date and range (start, end), the date should be in range if and only if
   * it's not before start and not after end.
   */
  it('Property 16: Range checking correctness', () => {
    fc.assert(
      fc.property(
        fc.date(),
        fc.date(),
        fc.date(),
        (date, rangeDate1, rangeDate2) => {
          const ww = new WristWatch(date);
          const ww1 = new WristWatch(rangeDate1);
          const ww2 = new WristWatch(rangeDate2);
          
          // Ensure start is before or equal to end
          const start = ww1.isBefore(ww2) || ww1.equals(ww2) ? ww1 : ww2;
          const end = ww1.isBefore(ww2) || ww1.equals(ww2) ? ww2 : ww1;
          
          const inRange = ww.isBetween(start, end);
          const notBeforeStart = !ww.isBefore(start);
          const notAfterEnd = !ww.isAfter(end);
          
          // Date is in range if and only if it's >= start and <= end
          expect(inRange).toBe(notBeforeStart && notAfterEnd);
          
          // Edge cases: date equals start or end should be in range
          if (ww.equals(start) || ww.equals(end)) {
            expect(inRange).toBe(true);
          }
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: quick-datetime, Property 17: Timezone-independent comparison
   * Validates: Requirements 5.5
   * 
   * For any moment in time represented in different timezones, all representations
   * should compare as equal.
   */
  it('Property 17: Timezone-independent comparison', () => {
    fc.assert(
      fc.property(
        fc.date(),
        (date) => {
          // Create the same moment in time using different representations
          const timestamp = date.getTime();
          const ww1 = new WristWatch(timestamp);
          const ww2 = new WristWatch(new Date(timestamp));
          const ww3 = new WristWatch(date);
          
          // All should be equal regardless of how they were created
          expect(ww1.equals(ww2)).toBe(true);
          expect(ww2.equals(ww3)).toBe(true);
          expect(ww1.equals(ww3)).toBe(true);
          
          // None should be before or after each other
          expect(ww1.isBefore(ww2)).toBe(false);
          expect(ww1.isAfter(ww2)).toBe(false);
          expect(ww2.isBefore(ww3)).toBe(false);
          expect(ww2.isAfter(ww3)).toBe(false);
          
          // Converting to UTC should not affect equality
          const wwUtc = ww1.toUTC();
          if (wwUtc) {
            expect(wwUtc.equals(ww1)).toBe(true);
          }
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});
