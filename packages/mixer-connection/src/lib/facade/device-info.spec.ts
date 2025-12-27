import { describe, it, expect, beforeEach } from 'vitest';
import { firstValueFrom } from 'rxjs';
import { SoundcraftUI } from '../soundcraft-ui';
import { setMixerModel } from '../test.utils';

describe('DeviceInfo', () => {
  let conn: SoundcraftUI;

  beforeEach(() => {
    conn = new SoundcraftUI('0.0.0.0');
  });

  it('model$', async () => {
    setMixerModel('ui24', conn);
    expect(await firstValueFrom(conn.deviceInfo.model$)).toBe('ui24');

    setMixerModel('ui16', conn);
    expect(await firstValueFrom(conn.deviceInfo.model$)).toBe('ui16');

    setMixerModel('ui12', conn);
    expect(await firstValueFrom(conn.deviceInfo.model$)).toBe('ui12');
  });

  describe('model', () => {
    it('should be undefined if no model is set yet', () => {
      expect(conn.deviceInfo.model).toBe(undefined);
    });

    it('should return the correct model synchronously', () => {
    setMixerModel('ui24', conn);
    expect(conn.deviceInfo.model).toBe('ui24');

    setMixerModel('ui16', conn);
    expect(conn.deviceInfo.model).toBe('ui16');

    setMixerModel('ui12', conn);
    expect(conn.deviceInfo.model).toBe('ui12');
    });
  });
  });

  it('firmware$', async () => {
    conn.conn.sendMessage('SETD^firmware^1.2.3');
    expect(await firstValueFrom(conn.deviceInfo.firmware$)).toBe('1.2.3');

    conn.conn.sendMessage('SETD^firmware^4.5.6-abc');
    expect(await firstValueFrom(conn.deviceInfo.firmware$)).toBe('4.5.6-abc');
  });
});
