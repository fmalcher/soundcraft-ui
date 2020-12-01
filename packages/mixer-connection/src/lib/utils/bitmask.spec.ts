import { toggleBit, clearBit, setBit, getValueOfBit } from './bitmask';

describe('Bit Mask Utils', () => {
  describe('toggleBit', () => {
    it('should toggle from 0 to 1', () => {
      const result = toggleBit(0b1010100, 3);
      expect(result.toString(2)).toBe('1011100');
    });

    it('should toggle from 1 to 0', () => {
      const result = toggleBit(0b1010100, 4);
      expect(result.toString(2)).toBe('1000100');
    });

    it('should toggle a bit not present in the input representation', () => {
      const result = toggleBit(5, 15);
      expect(result.toString(2)).toBe('1000000000000101');
    });

    it('should ignore negative bit index', () => {
      const result = toggleBit(0b100, -5);
      expect(result.toString(2)).toBe('100');
    });
  });

  describe('clearBit', () => {
    it('should set a 1 bit to 0', () => {
      const result = clearBit(0b1010100, 2);
      expect(result.toString(2)).toBe('1010000');
    });

    it('should leave a 0 bit at 0', () => {
      const result = clearBit(0b1010000, 2);
      expect(result.toString(2)).toBe('1010000');
    });

    it('should ignore negative bit index', () => {
      const result = clearBit(0b100, -5);
      expect(result.toString(2)).toBe('100');
    });
  });

  describe('setBit', () => {
    it('should set a 0 bit to 1', () => {
      const result = setBit(0b1010100, 3);
      expect(result.toString(2)).toBe('1011100');
    });

    it('should leave a 1 bit at 1', () => {
      const result = setBit(0b1011100, 2);
      expect(result.toString(2)).toBe('1011100');
    });

    it('should ignore negative bit index', () => {
      const result = setBit(0b100, -5);
      expect(result.toString(2)).toBe('100');
    });
  });

  describe('getValueOfBit', () => {
    it('should get 0', () => {
      const result = getValueOfBit(0b1010100, 3);
      expect(result).toBe(0);
    });

    it('should get 1', () => {
      const result = getValueOfBit(0b1010100, 2);
      expect(result).toBe(1);
    });

    it('should ignore negative bit index', () => {
      const result = getValueOfBit(0b100, -5);
      expect(result.toString(2)).toBe('100');
    });
  });
});
