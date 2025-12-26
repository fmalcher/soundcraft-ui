import { describe, it, expect } from 'vitest';
import {
  clamp,
  constructReadableChannelName,
  fxTypeToString,
  playerTimeToString,
  roundToThreeDecimals,
  transformStringValue,
} from './utils';

describe('utils', () => {
  describe('clamp', () => {
    it('should leave in-range values unchanged', () => {
      expect(clamp(400, 0, 500)).toBe(400);
      expect(clamp(-5, -100, 1000)).toBe(-5);
    });

    it('should clamp out-of-range value', () => {
      expect(clamp(600, 0, 500)).toBe(500);
      expect(clamp(-110, -100, 1000)).toBe(-100);
    });
  });

  describe('roundToThreeDecimals', () => {
    it('should round to three decimals', () => {
      expect(roundToThreeDecimals(0.123456)).toBe(0.123);
      expect(roundToThreeDecimals(0.123)).toBe(0.123);
      expect(roundToThreeDecimals(5.1234)).toBe(5.123);
      expect(roundToThreeDecimals(3.2)).toBe(3.2);
    });
    it('should round to three decimals with epsilon', () => {
      expect(roundToThreeDecimals(0.123456 + Number.EPSILON)).toBe(0.123);
      expect(roundToThreeDecimals(0.123 + Number.EPSILON)).toBe(0.123);
      expect(roundToThreeDecimals(5.1234 + Number.EPSILON)).toBe(5.123);
      expect(roundToThreeDecimals(3.2 + Number.EPSILON)).toBe(3.2);
    });
    it('should round to three decimals with negative values', () => {
      expect(roundToThreeDecimals(-0.123456)).toBe(-0.123);
      expect(roundToThreeDecimals(-0.123)).toBe(-0.123);
      expect(roundToThreeDecimals(-5.1234)).toBe(-5.123);
      expect(roundToThreeDecimals(-3.2)).toBe(-3.2);
    });
    it('should round to three decimals with negative values and epsilon', () => {
      expect(roundToThreeDecimals(-0.123456 + Number.EPSILON)).toBe(-0.123);
      expect(roundToThreeDecimals(-0.123 + Number.EPSILON)).toBe(-0.123);
      expect(roundToThreeDecimals(-5.1234 + Number.EPSILON)).toBe(-5.123);
      expect(roundToThreeDecimals(-3.2 + Number.EPSILON)).toBe(-3.2);
    });
    it('should round to three decimals with zero', () => {
      expect(roundToThreeDecimals(0)).toBe(0);
      expect(roundToThreeDecimals(0 + Number.EPSILON)).toBe(0);
      expect(roundToThreeDecimals(-0)).toBe(0);
      expect(roundToThreeDecimals(-0 + Number.EPSILON)).toBe(0);
    });
    it('should round to three decimals with very small values', () => {
      expect(roundToThreeDecimals(0.0000001)).toBe(0);
      expect(roundToThreeDecimals(0.0000001 + Number.EPSILON)).toBe(0);
      expect(roundToThreeDecimals(-0.0000001)).toBe(-0);
      expect(roundToThreeDecimals(-0.0000001 + Number.EPSILON)).toBe(-0);
    });
    it('should round to three decimals with very large values', () => {
      expect(roundToThreeDecimals(1234567890)).toBe(1234567890);
      expect(roundToThreeDecimals(1234567890 + Number.EPSILON)).toBe(1234567890);
      expect(roundToThreeDecimals(-1234567890)).toBe(-1234567890);
      expect(roundToThreeDecimals(-1234567890 + Number.EPSILON)).toBe(-1234567890);
    });
    it('should round to three decimals with very large values and decimals', () => {
      expect(roundToThreeDecimals(1234567890.123456)).toBe(1234567890.123);
      expect(roundToThreeDecimals(1234567890.123456 + Number.EPSILON)).toBe(1234567890.123);
      expect(roundToThreeDecimals(-1234567890.123456)).toBe(-1234567890.123);
      expect(roundToThreeDecimals(-1234567890.123456 + Number.EPSILON)).toBe(-1234567890.123);
      expect(roundToThreeDecimals(1234567890.123)).toBe(1234567890.123);
      expect(roundToThreeDecimals(1234567890.123 + Number.EPSILON)).toBe(1234567890.123);
      expect(roundToThreeDecimals(-1234567890.123)).toBe(-1234567890.123);
      expect(roundToThreeDecimals(-1234567890.123 + Number.EPSILON)).toBe(-1234567890.123);
    });
  });

  describe('transformStringValue', () => {
    it('should convert number string to int', () => {
      expect(transformStringValue('123')).toBe(123);
      expect(transformStringValue('3')).toBe(3);
    });

    it('should convert number string to float', () => {
      expect(transformStringValue('3.141')).toBe(3.141);
      expect(transformStringValue('0.5236732')).toBe(0.5236732);
    });

    it('should ignore unknown values', () => {
      const value = 'hello world';
      expect(transformStringValue(value)).toBe(value);
    });
  });

  describe('playerTimeToString', () => {
    it('should ignore values less than 0', () => {
      expect(playerTimeToString(-1)).toBe('');
    });

    it('should pad 0 to seconds', () => {
      expect(playerTimeToString(5)).toBe('0:05');
    });

    it('should work with 0', () => {
      expect(playerTimeToString(0)).toBe('0:00');
    });

    it('should display minutes and seconds', () => {
      expect(playerTimeToString(60)).toBe('1:00');
      expect(playerTimeToString(1678)).toBe('27:58');
    });
  });

  describe('fxTypeToString', () => {
    it('should convert nueric values to string output', () => {
      expect(fxTypeToString(-1)).toBe('None');
      expect(fxTypeToString(0)).toBe('Reverb');
      expect(fxTypeToString(1)).toBe('Delay');
      expect(fxTypeToString(2)).toBe('Chorus');
      expect(fxTypeToString(3)).toBe('Room');
    });
  });

  describe('constructReadableChannelName', () => {
    it('should construct readable channel name', () => {
      expect(constructReadableChannelName('i', 1)).toBe('CH 1');
      expect(constructReadableChannelName('i', 2)).toBe('CH 2');
      expect(constructReadableChannelName('i', 10)).toBe('CH 10');

      expect(constructReadableChannelName('a', 1)).toBe('AUX 1');
      expect(constructReadableChannelName('a', 4)).toBe('AUX 4');

      expect(constructReadableChannelName('f', 2)).toBe('FX 2');
      expect(constructReadableChannelName('f', 3)).toBe('FX 3');

      expect(constructReadableChannelName('s', 1)).toBe('SUB 1');
      expect(constructReadableChannelName('s', 4)).toBe('SUB 4');

      expect(constructReadableChannelName('v', 1)).toBe('VCA 1');
      expect(constructReadableChannelName('v', 4)).toBe('VCA 4');

      expect(constructReadableChannelName('l', 1)).toBe('LINE IN L');
      expect(constructReadableChannelName('l', 2)).toBe('LINE IN R');
      expect(constructReadableChannelName('p', 1)).toBe('PLAYER L');
      expect(constructReadableChannelName('p', 2)).toBe('PLAYER R');

      expect(constructReadableChannelName('solovol', 1)).toBe('SOLO LEVEL');
      expect(constructReadableChannelName('hpvol', 1)).toBe('HEADPHONE 1 LEVEL');
      expect(constructReadableChannelName('hpvol', 2)).toBe('HEADPHONE 2 LEVEL');
    });
  });
});
