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

  describe('Gain', () => {
    it('gain$', async () => {
      channel.setGain(1);
      expect(await firstValueFrom(channel.gain$)).toBe(1);

      channel.setGain(0.25396825396825395);
      expect(await firstValueFrom(channel.gain$)).toBe(0.25396825396825395);

      channel.setGainDB(0);
      expect(await firstValueFrom(channel.gain$)).toBe(0.09523809523809523);
    });

    it('faderLevelDB$', async () => {
      channel.setGainDB(-3);
      expect(await firstValueFrom(channel.gainDB$)).toBe(-3);

      channel.setGainDB(24);
      expect(await firstValueFrom(channel.gainDB$)).toBe(24);

      channel.setGain(0.25396825396825395);
      expect(await firstValueFrom(channel.gainDB$)).toBe(10);
    });

    it('changeFaderLevelDB', async () => {
      channel.setGainDB(4);
      channel.changeGainDB(3);
      expect(await firstValueFrom(channel.gainDB$)).toBe(7);

      channel.changeGainDB(-10);
      expect(await firstValueFrom(channel.gainDB$)).toBe(-3);
    });
  });
});
