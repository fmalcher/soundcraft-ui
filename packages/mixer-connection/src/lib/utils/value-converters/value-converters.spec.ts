import { DBToFaderValue, sanitizeDelayValue } from './value-converters';

describe('Value converters', () => {
  describe('sanitizeDelayValue', () => {
    it('should sanitize and convert valid delay values', () => {
      expect(sanitizeDelayValue(500, 500)).toBe(0.5);
      expect(sanitizeDelayValue(200, 500)).toBe(0.2);
      expect(sanitizeDelayValue(333, 500)).toBe(0.333);
      expect(sanitizeDelayValue(0, 500)).toBe(0);
    });

    it('should sanitize out-of-range delay values', () => {
      expect(sanitizeDelayValue(600, 500)).toBe(0.5);
      expect(sanitizeDelayValue(-10, 500)).toBe(0);
      expect(sanitizeDelayValue(201, 200)).toBe(0.2);
    });
  });

  describe('DBToFaderValue', () => {
    it('should respect the lower bound with -Infinity', () => {
      const result = DBToFaderValue(-Infinity);
      expect(result).toBe(0);
    });

    it('should return a numeric value for out-of-bounds lower values', () => {
      const result = DBToFaderValue(-200);
      expect(result).not.toBeNaN();
      expect(result).toMatchInlineSnapshot(`0.00126941502`);
    });
  });
});
