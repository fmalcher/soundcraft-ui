import { getValueFromObject, joinStatePath } from './state-utils';

describe('state utils', () => {
  describe('getValueFromObject', () => {
    let state = {};

    beforeEach(() => {
      state = {
        faderLevel: 0.3,
        name: '',
        nullish: null,
      };
    });

    it('should return an existing value', () => {
      const result = getValueFromObject<number>(state, 'faderLevel');
      expect(result).toBe(0.3);
    });

    it('should return undefined for non-existing values', () => {
      const result = getValueFromObject<number>(state, 'doesnotexist');
      expect(result).toBeUndefined();
    });

    it('should return default value for null/undefined', () => {
      const result = getValueFromObject<number>(state, 'doesnotexist', 42);
      expect(result).toBe(42);

      const result2 = getValueFromObject<number>(state, 'nullish', 84);
      expect(result2).toBe(84);
    });
  });

  describe('joinStatePath', () => {
    it('should join paths', () => {
      expect(joinStatePath('m', 'mix')).toBe('m.mix');
      expect(joinStatePath('i', 2, 'aux', 3, 'mix')).toBe('i.2.aux.3.mix');
    });
  });
});
