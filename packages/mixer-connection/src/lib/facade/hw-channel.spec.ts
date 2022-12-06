import { firstValueFrom } from 'rxjs';
import { SoundcraftUI } from '../soundcraft-ui';
import { HwChannel } from './hw-channel';

describe('AUX Channel', () => {
  let conn: SoundcraftUI;
  let channel: HwChannel;

  beforeEach(() => {
    conn = new SoundcraftUI('0.0.0.0');
    channel = conn.hw(3);
  });

  it('should return the exact same channel object', () => {
    const channel1 = conn.hw(2);
    const channel2 = conn.hw(2);
    expect(channel1).toBe(channel2);
  });

  describe('Phantom Power', () => {
    it('phantom$', async () => {
      channel.phantomOn();
      expect(await firstValueFrom(channel.phantom$)).toBe(1);

      channel.phantomOff();
      expect(await firstValueFrom(channel.phantom$)).toBe(0);

      channel.setPhantom(1);
      expect(await firstValueFrom(channel.phantom$)).toBe(1);
    });

    it('togglePhantom', async () => {
      channel.setPhantom(0);
      channel.togglePhantom();
      expect(await firstValueFrom(channel.phantom$)).toBe(1);

      channel.togglePhantom();
      expect(await firstValueFrom(channel.phantom$)).toBe(0);
    });
  });
});
