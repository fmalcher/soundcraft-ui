import { describe, it, expect, vi } from 'vitest';
import { ObjectStore } from './object-store';

describe('Object Store', () => {
  it('should store and retrieve an object', () => {
    const store = new ObjectStore();
    const myObject = { foo: 'bar', bar: 5 };

    store.set('myKey', myObject);

    expect(store.get('myKey')).toBe(myObject);
  });

  describe('getOrCreate', () => {
    it('should create and cache the object on first access', () => {
      const store = new ObjectStore();
      const factory = vi.fn(() => ({ foo: 'bar' }));

      const created = store.getOrCreate('myKey', factory);

      expect(factory).toHaveBeenCalledTimes(1);
      expect(store.get('myKey')).toBe(created);
    });

    it('should return the cached object and not call the factory again', () => {
      const store = new ObjectStore();
      const factory = vi.fn(() => ({ foo: 'bar' }));

      const first = store.getOrCreate('myKey', factory);
      const second = store.getOrCreate('myKey', factory);

      expect(first).toBe(second);
      expect(factory).toHaveBeenCalledTimes(1);
    });
  });
});
