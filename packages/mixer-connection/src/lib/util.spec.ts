import { playerTimeToString, transformStringValue } from './util';

describe('util', () => {
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
});
