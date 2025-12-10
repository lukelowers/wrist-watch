import { describe, it, expect } from 'vitest';
import { WristWatch } from '../src/core/WristWatch';
import { parseCustom } from '../src/parsers/custom';

describe('12-hour format support', () => {
  describe('formatting with 12-hour tokens', () => {
    it('should format hours in 12-hour format with h token', () => {
      // Test various hours
      const midnight = new WristWatch(new Date('2025-12-05T00:30:45'));
      expect(midnight.format('h:mm A')).toBe('12:30 AM');
      
      const morning = new WristWatch(new Date('2025-12-05T09:30:45'));
      expect(morning.format('h:mm A')).toBe('9:30 AM');
      
      const noon = new WristWatch(new Date('2025-12-05T12:30:45'));
      expect(noon.format('h:mm A')).toBe('12:30 PM');
      
      const afternoon = new WristWatch(new Date('2025-12-05T15:30:45'));
      expect(afternoon.format('h:mm A')).toBe('3:30 PM');
      
      const evening = new WristWatch(new Date('2025-12-05T23:30:45'));
      expect(evening.format('h:mm A')).toBe('11:30 PM');
    });

    it('should format hours in 12-hour format with hh token (zero-padded)', () => {
      const midnight = new WristWatch(new Date('2025-12-05T00:30:45'));
      expect(midnight.format('hh:mm A')).toBe('12:30 AM');
      
      const morning = new WristWatch(new Date('2025-12-05T09:30:45'));
      expect(morning.format('hh:mm A')).toBe('09:30 AM');
      
      const afternoon = new WristWatch(new Date('2025-12-05T15:30:45'));
      expect(afternoon.format('hh:mm A')).toBe('03:30 PM');
    });

    it('should format AM/PM with A token (uppercase)', () => {
      const morning = new WristWatch(new Date('2025-12-05T09:30:45'));
      expect(morning.format('h:mm A')).toBe('9:30 AM');
      
      const afternoon = new WristWatch(new Date('2025-12-05T15:30:45'));
      expect(afternoon.format('h:mm A')).toBe('3:30 PM');
    });

    it('should format am/pm with a token (lowercase)', () => {
      const morning = new WristWatch(new Date('2025-12-05T09:30:45'));
      expect(morning.format('h:mm a')).toBe('9:30 am');
      
      const afternoon = new WristWatch(new Date('2025-12-05T15:30:45'));
      expect(afternoon.format('h:mm a')).toBe('3:30 pm');
    });

    it('should work with complex format patterns', () => {
      const date = new WristWatch(new Date('2025-12-05T15:30:45'));
      
      expect(date.format('MMMM D, YYYY [at] h:mm A')).toBe('December 5, 2025 at 3:30 PM');
      expect(date.format('MM/DD/YYYY hh:mm:ss a')).toBe('12/05/2025 03:30:45 pm');
      expect(date.format('dddd, h A')).toBe('Friday, 3 PM');
    });
  });

  describe('parsing 12-hour format', () => {
    it('should parse 12-hour time with AM', () => {
      const result = parseCustom('12/05/2025 9:30 AM', 'MM/DD/YYYY h:mm A');
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value.getHours()).toBe(9);
        expect(result.value.getMinutes()).toBe(30);
      }
    });

    it('should parse 12-hour time with PM', () => {
      const result = parseCustom('12/05/2025 3:30 PM', 'MM/DD/YYYY h:mm A');
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value.getHours()).toBe(15);
        expect(result.value.getMinutes()).toBe(30);
      }
    });

    it('should parse midnight (12:xx AM)', () => {
      const result = parseCustom('12/05/2025 12:30 AM', 'MM/DD/YYYY h:mm A');
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value.getHours()).toBe(0);
        expect(result.value.getMinutes()).toBe(30);
      }
    });

    it('should parse noon (12:xx PM)', () => {
      const result = parseCustom('12/05/2025 12:30 PM', 'MM/DD/YYYY h:mm A');
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value.getHours()).toBe(12);
        expect(result.value.getMinutes()).toBe(30);
      }
    });

    it('should parse with lowercase am/pm', () => {
      const result1 = parseCustom('2025-12-05 9:30 am', 'YYYY-MM-DD h:mm a');
      expect(result1.success).toBe(true);
      if (result1.success) {
        expect(result1.value.getHours()).toBe(9);
      }

      const result2 = parseCustom('2025-12-05 3:30 pm', 'YYYY-MM-DD h:mm a');
      expect(result2.success).toBe(true);
      if (result2.success) {
        expect(result2.value.getHours()).toBe(15);
      }
    });

    it('should parse with zero-padded hours (hh)', () => {
      const result = parseCustom('12/05/2025 09:30 AM', 'MM/DD/YYYY hh:mm A');
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.value.getHours()).toBe(9);
        expect(result.value.getMinutes()).toBe(30);
      }
    });
  });

  describe('round-trip formatting and parsing', () => {
    it('should preserve time through format/parse round-trip', () => {
      const original = new WristWatch(new Date('2025-12-05T15:30:45'));
      
      // Format to 12-hour string
      const formatted = original.format('MM/DD/YYYY h:mm:ss A');
      expect(formatted).toBe('12/05/2025 3:30:45 PM');
      
      // Parse back
      const parsed = parseCustom(formatted, 'MM/DD/YYYY h:mm:ss A');
      expect(parsed.success).toBe(true);
      
      if (parsed.success) {
        expect(parsed.value.getYear()).toBe(original.getYear());
        expect(parsed.value.getMonth()).toBe(original.getMonth());
        expect(parsed.value.getDay()).toBe(original.getDay());
        expect(parsed.value.getHours()).toBe(original.getHours());
        expect(parsed.value.getMinutes()).toBe(original.getMinutes());
        expect(parsed.value.getSeconds()).toBe(original.getSeconds());
      }
    });

    it('should handle edge cases in round-trip', () => {
      // Test midnight
      const midnight = new WristWatch(new Date('2025-12-05T00:00:00'));
      const midnightFormatted = midnight.format('h:mm A');
      expect(midnightFormatted).toBe('12:00 AM');
      
      const midnightParsed = parseCustom('12/05/2025 12:00 AM', 'MM/DD/YYYY h:mm A');
      expect(midnightParsed.success).toBe(true);
      if (midnightParsed.success) {
        expect(midnightParsed.value.getHours()).toBe(0);
      }
      
      // Test noon
      const noon = new WristWatch(new Date('2025-12-05T12:00:00'));
      const noonFormatted = noon.format('h:mm A');
      expect(noonFormatted).toBe('12:00 PM');
      
      const noonParsed = parseCustom('12/05/2025 12:00 PM', 'MM/DD/YYYY h:mm A');
      expect(noonParsed.success).toBe(true);
      if (noonParsed.success) {
        expect(noonParsed.value.getHours()).toBe(12);
      }
    });
  });
});