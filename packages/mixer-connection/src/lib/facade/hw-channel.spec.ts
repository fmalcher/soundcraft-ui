import { SoundcraftUI } from '../soundcraft-ui';
import { readFirst } from '../utils/testing-utils';
import { HwChannel } from './hw-channel';

describe('AUX Channel', () => {
  let conn: SoundcraftUI;
  let channel: HwChannel;

  beforeEach(() => {
    conn = new SoundcraftUI('0.0.0.0');
    channel = conn.hw(3);
  });

  describe('Phantom Power', () => {
    it('phantom$', async () => {
      channel.phantomOn();
      expect(await readFirst(channel.phantom$)).toBe(1);

      channel.phantomOff();
      expect(await readFirst(channel.phantom$)).toBe(0);

      channel.setPhantom(1);
      expect(await readFirst(channel.phantom$)).toBe(1);
    });

    it('togglePhantom', async () => {
      channel.setPhantom(0);
      channel.togglePhantom();
      expect(await readFirst(channel.phantom$)).toBe(1);

      channel.togglePhantom();
      expect(await readFirst(channel.phantom$)).toBe(0);
    });
  });
});
