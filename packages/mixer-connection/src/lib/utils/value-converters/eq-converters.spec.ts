import { describe, it, expect } from 'vitest';
import {
  eqGainDBToFaderValue,
  faderValueToEqGainDB,
  faderValueToFrequency,
  faderValueToQ,
  frequencyToFaderValue,
  qToFaderValue,
} from './eq-converters';

/**
 * Raw EQ values of a real Ui24R, see `example-state.json`:
 * the default bands are 200 Hz, 1 kHz, 4 kHz, 10 kHz and 16 kHz with Q 1 and 0 dB.
 */
const UI24_DEFAULT_FREQUENCIES: [number, number][] = [
  [200, 0.3286901902],
  [1000, 0.5584347738],
  [4000, 0.7563259869],
  [10000, 0.887124964],
  [16000, 0.9542171999],
];
const UI24_DEFAULT_Q = 0.5252185347;

describe('EQ value converters', () => {
  describe('frequencyToFaderValue', () => {
    it('should convert the default band frequencies of a Ui24R', () => {
      UI24_DEFAULT_FREQUENCIES.forEach(([hz, raw]) => {
        expect(frequencyToFaderValue(hz)).toBe(raw);
      });
    });

    it('should convert the range limits', () => {
      expect(frequencyToFaderValue(20)).toBe(0);
      expect(frequencyToFaderValue(22050)).toBe(1);
    });

    it('should respect limits', () => {
      expect(frequencyToFaderValue(10)).toBe(0);
      expect(frequencyToFaderValue(0)).toBe(0);
      expect(frequencyToFaderValue(-5)).toBe(0);
      expect(frequencyToFaderValue(30000)).toBe(1);
    });
  });

  describe('faderValueToFrequency', () => {
    it('should convert the default band frequencies of a Ui24R', () => {
      UI24_DEFAULT_FREQUENCIES.forEach(([hz, raw]) => {
        expect(faderValueToFrequency(raw)).toBe(hz);
      });
    });

    it('should convert to whole Hz', () => {
      expect(faderValueToFrequency(0)).toBe(20);
      expect(faderValueToFrequency(0.5)).toBe(664);
      expect(faderValueToFrequency(1)).toBe(22050);
    });

    it('should respect limits', () => {
      expect(faderValueToFrequency(-1)).toBe(20);
      expect(faderValueToFrequency(2)).toBe(22050);
    });

    it('should work with back-and-forth conversion', () => {
      [20, 21, 80, 200, 440, 1000, 2500, 12345, 22049, 22050].forEach(hz => {
        expect(faderValueToFrequency(frequencyToFaderValue(hz))).toBe(hz);
      });
    });
  });

  describe('qToFaderValue', () => {
    it('should convert the default Q of a Ui24R', () => {
      expect(qToFaderValue(1)).toBe(UI24_DEFAULT_Q);
    });

    it('should convert the range limits', () => {
      expect(qToFaderValue(0.05)).toBe(0);
      expect(qToFaderValue(15)).toBe(1);
    });

    it('should respect limits', () => {
      expect(qToFaderValue(0.01)).toBe(0);
      expect(qToFaderValue(0)).toBe(0);
      expect(qToFaderValue(-1)).toBe(0);
      expect(qToFaderValue(20)).toBe(1);
    });
  });

  describe('faderValueToQ', () => {
    it('should convert the default Q of a Ui24R', () => {
      expect(faderValueToQ(UI24_DEFAULT_Q)).toBe(1);
    });

    it('should convert to two decimals', () => {
      expect(faderValueToQ(0)).toBe(0.05);
      expect(faderValueToQ(0.5)).toBe(0.87);
      expect(faderValueToQ(1)).toBe(15);
    });

    it('should respect limits', () => {
      expect(faderValueToQ(-1)).toBe(0.05);
      expect(faderValueToQ(2)).toBe(15);
    });

    it('should work with back-and-forth conversion', () => {
      [0.05, 0.1, 0.5, 0.7, 1, 1.4, 2, 4, 10, 15].forEach(q => {
        expect(faderValueToQ(qToFaderValue(q))).toBe(q);
      });
    });
  });

  describe('eqGainDBToFaderValue', () => {
    it('should convert dB values between -20 and 20 to linear values', () => {
      expect(eqGainDBToFaderValue(-20)).toBe(0);
      expect(eqGainDBToFaderValue(-3)).toBe(0.425);
      expect(eqGainDBToFaderValue(0)).toBe(0.5);
      expect(eqGainDBToFaderValue(3)).toBe(0.575);
      expect(eqGainDBToFaderValue(6)).toBe(0.65);
      expect(eqGainDBToFaderValue(20)).toBe(1);
    });

    it('should respect limits', () => {
      expect(eqGainDBToFaderValue(-30)).toBe(0);
      expect(eqGainDBToFaderValue(30)).toBe(1);
    });
  });

  describe('faderValueToEqGainDB', () => {
    it('should convert linear values to dB values between -20 and 20', () => {
      expect(faderValueToEqGainDB(0)).toBe(-20);
      expect(faderValueToEqGainDB(0.425)).toBe(-3);
      expect(faderValueToEqGainDB(0.5)).toBe(0);
      expect(faderValueToEqGainDB(0.65)).toBe(6);
      expect(faderValueToEqGainDB(1)).toBe(20);
    });

    it('should round to one decimal', () => {
      expect(faderValueToEqGainDB(0.57771261)).toBe(3.1);
    });

    it('should respect limits', () => {
      expect(faderValueToEqGainDB(-1)).toBe(-20);
      expect(faderValueToEqGainDB(2)).toBe(20);
    });
  });
});
