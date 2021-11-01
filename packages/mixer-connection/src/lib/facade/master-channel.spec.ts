import { SoundcraftUI } from '../soundcraft-ui';
import { readFirst } from '../utils/testing-utils';
import { MasterChannel } from './master-channel';

describe('Master Channel', () => {
  let conn: SoundcraftUI;
  let channel: MasterChannel;

  beforeEach(() => {
    conn = new SoundcraftUI('0.0.0.0');
    channel = conn.master.input(2);
  });

  describe('Pan', () => {
    it('pan$', async () => {
      channel.pan(0);
      expect(await readFirst(channel.pan$)).toBe(0);

      channel.pan(1);
      expect(await readFirst(channel.pan$)).toBe(1);

      channel.pan(0.5);
      expect(await readFirst(channel.pan$)).toBe(0.5);
    });
  });

  describe('SOLO', () => {
    it('solo$', async () => {
      channel.solo();
      expect(await readFirst(channel.solo$)).toBe(1);

      channel.unsolo();
      expect(await readFirst(channel.solo$)).toBe(0);

      channel.setSolo(1);
      expect(await readFirst(channel.solo$)).toBe(1);
    });

    it('toggleSolo', async () => {
      channel.setSolo(0);
      channel.toggleSolo();
      expect(await readFirst(channel.solo$)).toBe(1);

      channel.toggleSolo();
      expect(await readFirst(channel.solo$)).toBe(0);
    });
  });
});
