import { firstValueFrom } from 'rxjs';
import { SoundcraftUI } from '../soundcraft-ui';
import { FxChannel } from './fx-channel';

describe('AUX Channel', () => {
  let conn: SoundcraftUI;
  let channel: FxChannel;

  beforeEach(() => {
    conn = new SoundcraftUI('0.0.0.0');
    channel = conn.fx(3).player(1);
  });

  describe('Fader Level', () => {
    it('faderLevel$', async () => {
      channel.setFaderLevel(0.5);
      expect(await firstValueFrom(channel.faderLevel$)).toBe(0.5);

      channel.setFaderLevel(0.8889);
      expect(await firstValueFrom(channel.faderLevel$)).toBe(0.8889);

      channel.setFaderLevelDB(0);
      expect(await firstValueFrom(channel.faderLevel$)).toBe(0.76470588235);
    });

    it('faderLevelDB$', async () => {
      channel.setFaderLevelDB(-6);
      expect(await firstValueFrom(channel.faderLevelDB$)).toBe(-6);

      channel.setFaderLevelDB(-12);
      expect(await firstValueFrom(channel.faderLevelDB$)).toBe(-12);

      channel.setFaderLevel(0.76470588235);
      expect(await firstValueFrom(channel.faderLevelDB$)).toBe(0);
    });

    it('changeFaderLevelDB', async () => {
      channel.setFaderLevelDB(-12);
      channel.changeFaderLevelDB(3);
      expect(await firstValueFrom(channel.faderLevelDB$)).toBe(-9);

      channel.changeFaderLevelDB(-6);
      expect(await firstValueFrom(channel.faderLevelDB$)).toBe(-15);
    });
  });

  describe('PRE/POST', () => {
    it('post$', async () => {
      channel.post();
      expect(await firstValueFrom(channel.post$)).toBe(1);

      channel.pre();
      expect(await firstValueFrom(channel.post$)).toBe(0);

      channel.setPost(1);
      expect(await firstValueFrom(channel.post$)).toBe(1);
    });

    it('togglePost', async () => {
      channel.setPost(0);
      channel.togglePost();
      expect(await firstValueFrom(channel.post$)).toBe(1);

      channel.togglePost();
      expect(await firstValueFrom(channel.post$)).toBe(0);
    });
  });

  describe('MUTE', () => {
    it('mute$', async () => {
      channel.mute();
      expect(await firstValueFrom(channel.mute$)).toBe(1);

      channel.unmute();
      expect(await firstValueFrom(channel.mute$)).toBe(0);

      channel.setMute(1);
      expect(await firstValueFrom(channel.mute$)).toBe(1);
    });

    it('toggleMute', async () => {
      channel.setMute(0);
      channel.toggleMute();
      expect(await firstValueFrom(channel.mute$)).toBe(1);

      channel.toggleMute();
      expect(await firstValueFrom(channel.mute$)).toBe(0);
    });
  });
});
