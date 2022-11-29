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

  describe('delay', () => {
    it('delay$', async () => {
      channel.setDelay(110);
      expect(await firstValueFrom(channel.delay$)).toBe(110);
    });

    it('setDelay should be clamped to 0..250 for input channels', async () => {
      channel.setDelay(600);
      expect(await firstValueFrom(channel.delay$)).toBe(250);

      channel.setDelay(-100);
      expect(await firstValueFrom(channel.delay$)).toBe(0);
    });

    it('setDelay should be clamped to 0..500 for AUX master channels', async () => {
      channel = conn.master.aux(1);

      channel.setDelay(600);
      expect(await firstValueFrom(channel.delay$)).toBe(500);

      channel.setDelay(-100);
      expect(await firstValueFrom(channel.delay$)).toBe(0);
    });

    it('changeDelay', async () => {
      channel.setDelay(100);
      channel.changeDelay(10);
      expect(await firstValueFrom(channel.delay$)).toBe(110);

      channel.setDelay(100);
      channel.changeDelay(-20);
      expect(await firstValueFrom(channel.delay$)).toBe(80);
    });

    it('changeDelay should be clamped to 0..250 for input channels', async () => {
      channel.setDelay(100);
      channel.changeDelay(200);
      expect(await firstValueFrom(channel.delay$)).toBe(250);

      channel.setDelay(100);
      channel.changeDelay(-200);
      expect(await firstValueFrom(channel.delay$)).toBe(0);
    });

    it('changeDelay should be clamped to 0..500 for AUX master channels', async () => {
      channel = conn.master.aux(1);

      channel.setDelay(100);
      channel.changeDelay(400);
      expect(await firstValueFrom(channel.delay$)).toBe(500);

      channel.setDelay(100);
      channel.changeDelay(-200);
      expect(await firstValueFrom(channel.delay$)).toBe(0);
    });
  });
});
