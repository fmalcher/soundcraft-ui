import { firstValueFrom } from 'rxjs';
import { SoundcraftUI } from '../soundcraft-ui';
import { setMixerModel } from '../util';

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

  it('model', () => {
    setMixerModel('ui24', conn);
    expect(conn.deviceInfo.model).toBe('ui24');

    setMixerModel('ui16', conn);
    expect(conn.deviceInfo.model).toBe('ui16');

    setMixerModel('ui12', conn);
    expect(conn.deviceInfo.model).toBe('ui12');
  });

  it('firmware$', async () => {
    conn.conn.sendMessage('SETD^firmware^1.2.3');
    expect(await firstValueFrom(conn.deviceInfo.firmware$)).toBe('1.2.3');

    conn.conn.sendMessage('SETD^firmware^4.5.6-abc');
    expect(await firstValueFrom(conn.deviceInfo.firmware$)).toBe('4.5.6-abc');
  });
});
