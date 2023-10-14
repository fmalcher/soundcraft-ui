import {
  DBToFaderValue,
  linearMappingRangeToValue,
  linearMappingValueToRange,
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
      expect(linearMappingValueToRange(0, -6, 57)).toBe(-6);
      expect(linearMappingValueToRange(1, -6, 57)).toBe(57);
      expect(linearMappingValueToRange(0.25396825396825395, -6, 57)).toBe(10);
      expect(linearMappingValueToRange(0.36507936507936506, -6, 57)).toBe(17);
      expect(linearMappingValueToRange(0.4126984126984127, -6, 57)).toBe(20);
      expect(linearMappingValueToRange(0.419047619047619, -6, 57)).toBe(20.4);
      expect(linearMappingValueToRange(0.5238095238095238, -6, 57)).toBe(27);
      expect(linearMappingValueToRange(0.9682539682539683, -6, 57)).toBe(55);
      expect(linearMappingValueToRange(0.6666666666666666, -6, 57)).toBe(36);
    });

    it('should work with back-and-forth conversion', () => {
      let value: number;

      value = 0.419047619047619;
      expect(linearMappingRangeToValue(linearMappingValueToRange(value, -6, 57), -6, 57)).toBe(
        value
      );

      value = 0.09523809523809523;
      expect(linearMappingRangeToValue(linearMappingValueToRange(value, -6, 57), -6, 57)).toBe(
        value
      );

      value = 0.9682539682539683;
      expect(linearMappingRangeToValue(linearMappingValueToRange(value, -6, 57), -6, 57)).toBe(
        value
      );

      value = 0.5238095238095238;
      expect(linearMappingRangeToValue(linearMappingValueToRange(value, -6, 57), -6, 57)).toBe(
        value
      );
      linearMappingRangeToValue;
    });

    describe('DBToGainValue', () => {
      it('should convert dB gain values to linear values', () => {
        expect(linearMappingRangeToValue(-6, -6, 57)).toBe(0);
        expect(linearMappingRangeToValue(57, -6, 57)).toBe(1);

        expect(linearMappingRangeToValue(0, -6, 57)).toBe(0.09523809523809523);
        expect(linearMappingRangeToValue(0.1, -6, 57)).toBe(0.09682539682539681);
        expect(linearMappingRangeToValue(2, -6, 57)).toBe(0.12698412698412698);
        expect(linearMappingRangeToValue(5, -6, 57)).toBe(0.1746031746031746);
        expect(linearMappingRangeToValue(10, -6, 57)).toBe(0.25396825396825395);
        expect(linearMappingRangeToValue(15, -6, 57)).toBe(0.3333333333333333);
        expect(linearMappingRangeToValue(17, -6, 57)).toBe(0.36507936507936506);
        expect(linearMappingRangeToValue(20, -6, 57)).toBe(0.4126984126984127);
        expect(linearMappingRangeToValue(20.4, -6, 57)).toBe(0.419047619047619);
        expect(linearMappingRangeToValue(27, -6, 57)).toBe(0.5238095238095238);
        expect(linearMappingRangeToValue(30.5, -6, 57)).toBe(0.5793650793650794);
        expect(linearMappingRangeToValue(36, -6, 57)).toBe(0.6666666666666666);
        expect(linearMappingRangeToValue(55, -6, 57)).toBe(0.9682539682539683);
        expect(linearMappingRangeToValue(55.3, -6, 57)).toBe(0.973015873015873);
      });

      it('should respect limits', () => {
        expect(linearMappingRangeToValue(200, -6, 57)).toBe(1);
        expect(linearMappingRangeToValue(100, -6, 57)).toBe(1);
        expect(linearMappingRangeToValue(-20, -6, 57)).toBe(0);
        expect(linearMappingRangeToValue(-300, -6, 57)).toBe(0);
      });

      it('should work with back-and-forth conversion', () => {
        let result: number;

        result = linearMappingRangeToValue(24, -6, 57);
        expect(linearMappingValueToRange(result, -6, 57)).toBe(24);

        result = linearMappingRangeToValue(0, -6, 57);
        expect(linearMappingValueToRange(result, -6, 57)).toBe(0);

        result = linearMappingRangeToValue(-6, -40, 50);
        expect(linearMappingValueToRange(result, -40, 50)).toBe(-6);

        result = linearMappingRangeToValue(42, -40, 50);
        expect(linearMappingValueToRange(result, -40, 50)).toBe(42);
      });
    });
  });
});
