import { describe, it, expect, beforeEach } from 'vitest';
import { firstValueFrom } from 'rxjs';
import { SoundcraftUI } from '../soundcraft-ui';
import { MtxChannel } from './mtx-channel';
import { MtxMasterChannel } from './mtx-master-channel';

describe('MTX Master Channel', () => {
  let conn: SoundcraftUI;
  let channel: MtxMasterChannel;

  beforeEach(() => {
    conn = new SoundcraftUI('0.0.0.0');
    channel = conn.mtx(7).master();
  });

  it('name$ should always be MASTER', async () => {
    expect(await firstValueFrom(channel.name$)).toBe('MASTER');
  });

  it('should be an instance of the MtxChannel base class', () => {
    expect(channel).toBeInstanceOf(MtxChannel);
  });

  describe('Fader Level', () => {
    it('faderLevel$', async () => {
      channel.setFaderLevel(0.5);
      expect(await firstValueFrom(channel.faderLevel$)).toBe(0.5);

      channel.setFaderLevel(0.8889);
      expect(await firstValueFrom(channel.faderLevel$)).toBe(0.8889);
    });

    it('faderLevelDB$', async () => {
      channel.setFaderLevelDB(-6);
      expect(await firstValueFrom(channel.faderLevelDB$)).toBe(-6);
    });

    it('changeFaderLevel', async () => {
      channel.setFaderLevel(0.5);
      channel.changeFaderLevel(0.2);
      expect(await firstValueFrom(channel.faderLevel$)).toBe(0.7);

      channel.changeFaderLevel(-0.4);
      expect(await firstValueFrom(channel.faderLevel$)).toBe(0.3);
    });
  });

  describe('MUTE', () => {
    it('mute$', async () => {
      channel.mute();
      expect(await firstValueFrom(channel.mute$)).toBe(1);

      channel.unmute();
      expect(await firstValueFrom(channel.mute$)).toBe(0);
    });

    it('toggleMute', async () => {
      channel.setMute(0);
      channel.toggleMute();
      expect(await firstValueFrom(channel.mute$)).toBe(1);

      channel.toggleMute();
      expect(await firstValueFrom(channel.mute$)).toBe(0);
    });
  });

  describe('Pan', () => {
    it('pan$', async () => {
      channel.setPan(0.5);
      expect(await firstValueFrom(channel.pan$)).toBe(0.5);
    });

    it('should be clamped to 0..1', async () => {
      channel.setPan(1.4);
      expect(await firstValueFrom(channel.pan$)).toBe(1);

      channel.setPan(-4.3);
      expect(await firstValueFrom(channel.pan$)).toBe(0);
    });

    it('changePan', async () => {
      channel.setPan(0.563);
      channel.changePan(0.123);
      expect(await firstValueFrom(channel.pan$)).toBe(0.686);
    });
  });
});
