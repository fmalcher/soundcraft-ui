import { describe, it, expect } from 'vitest';
import {
  EQ_FILTERS,
  assertEqBand,
  assertEqChannelType,
  assertLowPassChannelType,
  eqBandPath,
  eqBypassPath,
  eqFilterPath,
  slopeToValue,
  valueToSlope,
} from './eq-utils';

describe('EQ utils', () => {
  describe('state paths', () => {
    it('eqBypassPath', () => {
      expect(eqBypassPath('i.2')).toBe('i.2.eq.bypass');
    });

    it('eqBandPath', () => {
      expect(eqBandPath('i.2', 1, 'freq')).toBe('i.2.eq.b1.freq');
      expect(eqBandPath('l.0', 3, 'q')).toBe('l.0.eq.b3.q');
      expect(eqBandPath('s.5', 4, 'gain')).toBe('s.5.eq.b4.gain');
    });

    it('eqFilterPath', () => {
      expect(eqFilterPath('i.2', 'hpf', 'freq')).toBe('i.2.eq.hpf.freq');
      expect(eqFilterPath('i.2', 'lpf', 'slope')).toBe('i.2.eq.lpf.slope');
    });
  });

  describe('assertEqChannelType', () => {
    it('should accept channel types with a parametric EQ', () => {
      (['i', 'l', 'p', 'f', 's'] as const).forEach(type => {
        expect(() => assertEqChannelType(type)).not.toThrow();
      });
    });

    it('should reject AUX and VCA channels', () => {
      expect(() => assertEqChannelType('a')).toThrow(
        'EQ is only available for input, line, player, FX and sub group channels',
      );
      expect(() => assertEqChannelType('v')).toThrow();
    });
  });

  describe('assertLowPassChannelType', () => {
    it('should accept input channels only', () => {
      expect(() => assertLowPassChannelType('i')).not.toThrow();
      (['l', 'p', 'f', 's', 'a', 'v'] as const).forEach(type => {
        expect(() => assertLowPassChannelType(type)).toThrow(
          'The low-pass filter is only available for input channels',
        );
      });
    });
  });

  describe('assertEqBand', () => {
    it('should accept bands 1 to 4', () => {
      [1, 2, 3, 4].forEach(band => expect(() => assertEqBand(band)).not.toThrow());
    });

    it('should reject other band numbers', () => {
      [0, 5, -1, 1.5, NaN].forEach(band => {
        expect(() => assertEqBand(band)).toThrow('EQ band must be between 1 and 4.');
      });
    });
  });

  describe('filter slopes', () => {
    it('slopeToValue', () => {
      expect(slopeToValue(12)).toBe(0);
      expect(slopeToValue(24)).toBe(1);
      expect(slopeToValue(36)).toBe(2);
    });

    it('slopeToValue should reject other slopes', () => {
      [0, 6, 18, 48].forEach(slope => {
        expect(() => slopeToValue(slope as 12)).toThrow(
          'Filter slope must be 12, 24 or 36 dB/oct.',
        );
      });
    });

    it('valueToSlope', () => {
      expect(valueToSlope(0)).toBe(12);
      expect(valueToSlope(1)).toBe(24);
      expect(valueToSlope(2)).toBe(36);
    });

    it('valueToSlope should clamp unknown values', () => {
      expect(valueToSlope(-1)).toBe(12);
      expect(valueToSlope(7)).toBe(36);
    });
  });

  describe('EQ_FILTERS', () => {
    it('should describe the high-pass filter', () => {
      expect(EQ_FILTERS.hpf).toEqual({ minHz: 20, maxHz: 1000, offValue: 0 });
    });

    it('should describe the low-pass filter', () => {
      expect(EQ_FILTERS.lpf).toEqual({ minHz: 1000, maxHz: 22050, offValue: 1 });
    });
  });
});
