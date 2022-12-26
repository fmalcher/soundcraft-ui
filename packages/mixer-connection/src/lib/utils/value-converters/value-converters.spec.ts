import {
  DBToFaderValue,
  DBToGainValue,
  gainValueToDB,
  sanitizeDelayValue,
} from './value-converters';

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

  describe('gainValueToDB', () => {
    it('should convert linear gain values to dB', () => {
      expect(gainValueToDB(0)).toBe(-6);
      expect(gainValueToDB(1)).toBe(57);
      expect(gainValueToDB(0.25396825396825395)).toBe(10);
      expect(gainValueToDB(0.36507936507936506)).toBe(17);
      expect(gainValueToDB(0.4126984126984127)).toBe(20);
      expect(gainValueToDB(0.419047619047619)).toBe(20.4);
      expect(gainValueToDB(0.5238095238095238)).toBe(27);
      expect(gainValueToDB(0.9682539682539683)).toBe(55);
      expect(gainValueToDB(0.6666666666666666)).toBe(36);
    });

    it('should work with back-and-forth conversion', () => {
      let value: number;

      value = 0.419047619047619;
      expect(DBToGainValue(gainValueToDB(value))).toBe(value);

      value = 0.09523809523809523;
      expect(DBToGainValue(gainValueToDB(value))).toBe(value);

      value = 0.9682539682539683;
      expect(DBToGainValue(gainValueToDB(value))).toBe(value);

      value = 0.5238095238095238;
      expect(DBToGainValue(gainValueToDB(value))).toBe(value);
    });
  });

  describe('DBToGainValue', () => {
    it('should convert dB gain values to linear values', () => {
      expect(DBToGainValue(-6)).toBe(0);
      expect(DBToGainValue(57)).toBe(1);

      expect(DBToGainValue(0)).toBe(0.09523809523809523);
      expect(DBToGainValue(0.1)).toBe(0.09682539682539681);
      expect(DBToGainValue(2)).toBe(0.12698412698412698);
      expect(DBToGainValue(5)).toBe(0.1746031746031746);
      expect(DBToGainValue(10)).toBe(0.25396825396825395);
      expect(DBToGainValue(15)).toBe(0.3333333333333333);
      expect(DBToGainValue(17)).toBe(0.36507936507936506);
      expect(DBToGainValue(20)).toBe(0.4126984126984127);
      expect(DBToGainValue(20.4)).toBe(0.419047619047619);
      expect(DBToGainValue(27)).toBe(0.5238095238095238);
      expect(DBToGainValue(30.5)).toBe(0.5793650793650794);
      expect(DBToGainValue(36)).toBe(0.6666666666666666);
      expect(DBToGainValue(55)).toBe(0.9682539682539683);
      expect(DBToGainValue(55.3)).toBe(0.973015873015873);
    });

    it('should respect limits', () => {
      expect(DBToGainValue(200)).toBe(1);
      expect(DBToGainValue(100)).toBe(1);
      expect(DBToGainValue(-20)).toBe(0);
      expect(DBToGainValue(-300)).toBe(0);
    });

    it('should work with back-and-forth conversion', () => {
      let result: number;

      result = DBToGainValue(24);
      expect(gainValueToDB(result)).toBe(24);

      result = DBToGainValue(0);
      expect(gainValueToDB(result)).toBe(0);

      result = DBToGainValue(-6);
      expect(gainValueToDB(result)).toBe(-6);

      result = DBToGainValue(52);
      expect(gainValueToDB(result)).toBe(52);
    });
  });
});
