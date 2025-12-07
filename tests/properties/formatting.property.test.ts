import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { WristWatch } from '../../src/core/WristWatch';

describe('WristWatch Formatting Properties', () => {
  /**
   * Feature: quick-datetime, Property 4: Format string correctness
   * Validates: Requirements 2.1
   * 
   * For any date and valid format pattern, the formatted output should contain
   * the correct values for all tokens in the pattern.
   */
  it('Property 4: Format string correctness', () => {
    fc.assert(
      fc.property(fc.date(), (date) => {
        const ww = new WristWatch(date);
        
        // Test YYYY token
        const yearFormat = ww.format('YYYY');
        expect(yearFormat).toBe(String(ww.getYear()));
        
        // Test MM token (zero-padded month)
        const monthFormat = ww.format('MM');
        expect(monthFormat).toBe(String(ww.getMonth()).padStart(2, '0'));
        
        // Test DD token (zero-padded day)
        const dayFormat = ww.format('DD');
        expect(dayFormat).toBe(String(ww.getDay()).padStart(2, '0'));
        
        // Test HH token (zero-padded hours)
        const hourFormat = ww.format('HH');
        expect(hourFormat).toBe(String(ww.getHours()).padStart(2, '0'));
        
        // Test mm token (zero-padded minutes)
        const minuteFormat = ww.format('mm');
        expect(minuteFormat).toBe(String(ww.getMinutes()).padStart(2, '0'));
        
        // Test ss token (zero-padded seconds)
        const secondFormat = ww.format('ss');
        expect(secondFormat).toBe(String(ww.getSeconds()).padStart(2, '0'));
        
        // Test combined format
        const fullFormat = ww.format('YYYY-MM-DD HH:mm:ss');
        const expected = `${String(ww.getYear())}-${String(ww.getMonth()).padStart(2, '0')}-${String(ww.getDay()).padStart(2, '0')} ${String(ww.getHours()).padStart(2, '0')}:${String(ww.getMinutes()).padStart(2, '0')}:${String(ww.getSeconds()).padStart(2, '0')}`;
        expect(fullFormat).toBe(expected);
        
        // Test that format preserves non-token characters and handles escaped literals
        const withText = ww.format('[The year is] YYYY [and the hour is] HH');
        expect(withText).toContain('The year is ');
        expect(withText).toContain(' and the hour is ');
        expect(withText).toContain(String(ww.getYear()));
        expect(withText).toContain(String(ww.getHours()).padStart(2, '0'));
        
        // Test simple separators (non-token characters)
        const withSeparators = ww.format('YYYY-MM-DD');
        expect(withSeparators).toContain('-');
        
        return true;
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: quick-datetime, Property 5: Relative time accuracy
   * Validates: Requirements 2.2
   * 
   * For any two dates, the relative time description should correctly reflect
   * the time difference (e.g., "2 hours ago" for dates 2 hours apart).
   */
  it('Property 5: Relative time accuracy', () => {
    fc.assert(
      fc.property(
        fc.date({ min: new Date('2000-01-01'), max: new Date('2099-12-31') }), // Constrain to reasonable date range
        fc.integer({ min: -365 * 24 * 60 * 60 * 1000, max: 365 * 24 * 60 * 60 * 1000 }), // Offset in milliseconds (within 1 year)
        (referenceDate, offsetMs) => {
          const targetDate = new Date(referenceDate.getTime() + offsetMs);
          
          // Skip if the resulting date is invalid
          if (isNaN(targetDate.getTime())) {
            return true;
          }
          
          const ww = new WristWatch(targetDate);
          
          const relative = ww.toRelative(referenceDate);
          
          // Check that the result is a non-empty string
          expect(relative).toBeTruthy();
          expect(typeof relative).toBe('string');
          
          const absDiffMs = Math.abs(offsetMs);
          const isPast = offsetMs < 0;
          
          // Define time units
          const second = 1000;
          const minute = second * 60;
          const hour = minute * 60;
          const day = hour * 24;
          const week = day * 7;
          const month = day * 30;
          const year = day * 365;
          
          // Verify the relative time string matches the expected pattern
          if (absDiffMs < 10 * second) {
            expect(relative).toBe('just now');
          } else if (absDiffMs < minute) {
            const seconds = Math.floor(absDiffMs / second);
            if (isPast) {
              expect(relative).toMatch(/^\d+ seconds? ago$/);
              expect(relative).toContain(String(seconds));
            } else {
              expect(relative).toMatch(/^in \d+ seconds?$/);
              expect(relative).toContain(String(seconds));
            }
          } else if (absDiffMs < hour) {
            const minutes = Math.floor(absDiffMs / minute);
            if (isPast) {
              expect(relative).toMatch(/^\d+ minutes? ago$/);
              expect(relative).toContain(String(minutes));
            } else {
              expect(relative).toMatch(/^in \d+ minutes?$/);
              expect(relative).toContain(String(minutes));
            }
          } else if (absDiffMs < day) {
            const hours = Math.floor(absDiffMs / hour);
            if (isPast) {
              expect(relative).toMatch(/^\d+ hours? ago$/);
              expect(relative).toContain(String(hours));
            } else {
              expect(relative).toMatch(/^in \d+ hours?$/);
              expect(relative).toContain(String(hours));
            }
          } else if (absDiffMs < week) {
            const days = Math.floor(absDiffMs / day);
            if (isPast) {
              expect(relative).toMatch(/^\d+ days? ago$/);
              expect(relative).toContain(String(days));
            } else {
              expect(relative).toMatch(/^in \d+ days?$/);
              expect(relative).toContain(String(days));
            }
          } else if (absDiffMs < month) {
            const weeks = Math.floor(absDiffMs / week);
            if (isPast) {
              expect(relative).toMatch(/^\d+ weeks? ago$/);
              expect(relative).toContain(String(weeks));
            } else {
              expect(relative).toMatch(/^in \d+ weeks?$/);
              expect(relative).toContain(String(weeks));
            }
          } else if (absDiffMs < year) {
            const months = Math.floor(absDiffMs / month);
            if (isPast) {
              expect(relative).toMatch(/^\d+ months? ago$/);
              expect(relative).toContain(String(months));
            } else {
              expect(relative).toMatch(/^in \d+ months?$/);
              expect(relative).toContain(String(months));
            }
          } else {
            const years = Math.floor(absDiffMs / year);
            if (isPast) {
              expect(relative).toMatch(/^\d+ years? ago$/);
              expect(relative).toContain(String(years));
            } else {
              expect(relative).toMatch(/^in \d+ years?$/);
              expect(relative).toContain(String(years));
            }
          }
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: quick-datetime, Property 6: Locale formatting consistency
   * Validates: Requirements 2.3
   * 
   * For any date and valid locale, the formatted output should follow
   * that locale's conventions for date/time representation.
   */
  it('Property 6: Locale formatting consistency', () => {
    // Common valid locales
    const validLocales = [
      'en-US',
      'en-GB',
      'fr-FR',
      'de-DE',
      'es-ES',
      'it-IT',
      'ja-JP',
      'zh-CN',
      'ko-KR',
      'pt-BR',
      'ru-RU',
      'ar-SA',
    ];

    fc.assert(
      fc.property(
        fc.date({ min: new Date('2000-01-01'), max: new Date('2099-12-31') }),
        fc.constantFrom(...validLocales),
        (date, locale) => {
          const ww = new WristWatch(date);
          
          // Test toShortDate with locale
          const shortDate = ww.toShortDate(locale);
          expect(shortDate).toBeTruthy();
          expect(typeof shortDate).toBe('string');
          expect(shortDate.length).toBeGreaterThan(0);
          
          // Verify it matches native Date formatting
          const nativeShortDate = date.toLocaleDateString(locale);
          expect(shortDate).toBe(nativeShortDate);
          
          // Test toLongDate with locale
          const longDate = ww.toLongDate(locale);
          expect(longDate).toBeTruthy();
          expect(typeof longDate).toBe('string');
          expect(longDate.length).toBeGreaterThan(0);
          
          // Verify it matches native Date formatting with long options
          const nativeLongDate = date.toLocaleDateString(locale, {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          });
          expect(longDate).toBe(nativeLongDate);
          
          // Test formatWithLocale
          const localeFormatted = ww.formatWithLocale(locale);
          expect(localeFormatted).toBeTruthy();
          expect(typeof localeFormatted).toBe('string');
          expect(localeFormatted.length).toBeGreaterThan(0);
          
          // Verify it matches native Date formatting
          const nativeLocaleFormatted = date.toLocaleString(locale);
          expect(localeFormatted).toBe(nativeLocaleFormatted);
          
          // Test that different locales produce different outputs (for most dates)
          // This verifies that locale is actually being used
          const usFormat = ww.toShortDate('en-US');
          const frFormat = ww.toShortDate('fr-FR');
          
          // For most dates, US and French formats will differ
          // (US: MM/DD/YYYY, FR: DD/MM/YYYY)
          // We can't assert they're always different because some dates like 01/01/2000
          // look the same in both formats, but we can verify they're valid strings
          expect(usFormat).toBeTruthy();
          expect(frFormat).toBeTruthy();
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});
