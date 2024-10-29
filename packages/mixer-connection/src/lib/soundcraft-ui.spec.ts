import { SoundcraftUI } from './soundcraft-ui';
import { SoundcraftUIOptions } from './types';

describe('SoundcraftUI', () => {
  it('should be initialized with IP as string', () => {
    const conn = new SoundcraftUI('192.168.1.123');
    expect(conn.options).toEqual({ targetIP: '192.168.1.123' });
  });

  it('should be initialized with IP in an options object', () => {
    const conn = new SoundcraftUI({ targetIP: '192.168.1.234' });
    expect(conn.options).toEqual({ targetIP: '192.168.1.234' });
  });

  it('should throw error when mutating options', () => {
    const conn = new SoundcraftUI({ targetIP: '192.168.1.234' });

    let error;
    try {
      (conn.options as SoundcraftUIOptions).targetIP = '0.0.0.0';
    } catch (e) {
      error = e;
    }
    expect(error).toBeTruthy();
  });
});
