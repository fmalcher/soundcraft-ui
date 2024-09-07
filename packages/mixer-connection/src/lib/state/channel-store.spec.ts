import { ChannelStore } from './channel-store';

describe('Channel Store', () => {
  it('should store and retrieve an object', () => {
    const store = new ChannelStore();
    const myObject = { foo: 'bar', bar: 5 };

    store.set('myKey', myObject);

    expect(store.get('myKey')).toBe(myObject);
  });
});
