import { firstValueFrom } from 'rxjs';
import { SoundcraftUI } from '../soundcraft-ui';
import { DelayableMasterChannel } from './delayable-master-channel';

describe('Delayable Master Channel', () => {
  let conn: SoundcraftUI;
  let channel: DelayableMasterChannel;

  beforeEach(() => {
    conn = new SoundcraftUI('0.0.0.0');
    channel = conn.master.input(2);
  });

  describe('Delay', () => {
    it('delay$', async () => {
      channel.setDelay(0.21);
      expect(await firstValueFrom(channel.delay$)).toBe(0.21);
    });
  });
});
