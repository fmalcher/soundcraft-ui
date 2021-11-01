import { SoundcraftUI } from '../soundcraft-ui';
import { readFirst } from '../utils/testing-utils';
import { AuxChannel } from './aux-channel';

describe('AUX Channel', () => {
  let conn: SoundcraftUI;
  let channel: AuxChannel;

  beforeEach(() => {
    conn = new SoundcraftUI('0.0.0.0');
    channel = conn.aux(3).input(4);
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

  describe('PRE/POST', () => {
    it('post$', async () => {
      channel.post();
      expect(await readFirst(channel.post$)).toBe(1);

      channel.pre();
      expect(await readFirst(channel.post$)).toBe(0);

      channel.setPost(1);
      expect(await readFirst(channel.post$)).toBe(1);
    });

    it('togglePost', async () => {
      channel.setPost(0);
      channel.togglePost();
      expect(await readFirst(channel.post$)).toBe(1);

      channel.togglePost();
      expect(await readFirst(channel.post$)).toBe(0);
    });
  });
});
