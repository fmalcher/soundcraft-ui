import { describe, it, expect } from 'vitest';
import { ObjectStore } from './object-store';

describe('Object Store', () => {
  it('should store and retrieve an object', () => {
    const store = new ObjectStore();
    const myObject = { foo: 'bar', bar: 5 };

    store.set('myKey', myObject);

    expect(store.get('myKey')).toBe(myObject);
  });
});
