import { describe, it, expect, beforeEach } from 'vitest';
import { firstValueFrom } from 'rxjs';
import { SoundcraftUI } from '../soundcraft-ui';
import { setMixerModel } from '../test.utils';
import { HwChannel } from './hw-channel';

describe('AUX Channel', () => {
  let conn: SoundcraftUI;
  let channel: HwChannel;

  beforeEach(() => {
    conn = new SoundcraftUI('0.0.0.0');
    channel = conn.hw(3);
  });

  it('should return the exact same channel object', () => {
    const obj1 = conn.hw(2);
    const obj2 = conn.hw(2);
    expect(obj1).toBe(obj2);
  });

  describe('Channel ID for different hardware models', () => {
    it('should use `hw` for ui24', () => {
      setMixerModel('ui24', conn);
      expect(conn.hw(4).fullChannelId).toBe('hw.3');
    });

    it('should use `i` for ui16', () => {
      setMixerModel('ui16', conn);
      expect(conn.hw(6).fullChannelId).toBe('i.5');
    });

    it('should use `i` for ui12', () => {
      setMixerModel('ui12', conn);
      expect(conn.hw(4).fullChannelId).toBe('i.3');
    });
  });

  describe('Phantom Power', () => {
    beforeEach(() => setMixerModel('ui24', conn));

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

    it('phantom Ui24', async () => {
      setMixerModel('ui24', conn);

      conn.conn.sendMessage('SETD^hw.2.phantom^0');
      expect(await firstValueFrom(channel.phantom$)).toBe(0);

      conn.conn.sendMessage('SETD^hw.2.phantom^1');
      expect(await firstValueFrom(channel.phantom$)).toBe(1);

      channel.togglePhantom();
      expect(await firstValueFrom(channel.phantom$)).toBe(0);
    });

    it('phantom Ui12/Ui16', async () => {
      setMixerModel('ui16', conn);

      conn.conn.sendMessage('SETD^i.2.phantom^0');
      expect(await firstValueFrom(channel.phantom$)).toBe(0);

      conn.conn.sendMessage('SETD^i.2.phantom^1');
      expect(await firstValueFrom(channel.phantom$)).toBe(1);

      channel.togglePhantom();
      expect(await firstValueFrom(channel.phantom$)).toBe(0);
    });
  });

  describe('Gain Ui24', () => {
    beforeEach(() => setMixerModel('ui24', conn));

    it('gain$', async () => {
      channel.setGain(1);
      expect(await firstValueFrom(channel.gain$)).toBe(1);

      channel.setGain(0.25396825396825395);
      expect(await firstValueFrom(channel.gain$)).toBe(0.25396825396825395);

      channel.setGainDB(0);
      expect(await firstValueFrom(channel.gain$)).toBe(0.09523809523809523);
    });

    it('gainDB$', async () => {
      channel.setGainDB(-3);
      expect(await firstValueFrom(channel.gainDB$)).toBe(-3);

      channel.setGainDB(24);
      expect(await firstValueFrom(channel.gainDB$)).toBe(24);

      channel.setGain(0.25396825396825395);
      expect(await firstValueFrom(channel.gainDB$)).toBe(10);
    });

    it('changeGainDB', async () => {
      channel.setGainDB(4);
      channel.changeGainDB(3);
      expect(await firstValueFrom(channel.gainDB$)).toBe(7);

      channel.changeGainDB(-10);
      expect(await firstValueFrom(channel.gainDB$)).toBe(-3);
    });
  });

  describe('Gain Ui16/Ui12', () => {
    beforeEach(() => setMixerModel('ui16', conn));

    it('gain$', async () => {
      channel.setGain(1);
      expect(await firstValueFrom(channel.gain$)).toBe(1);

      channel.setGain(0.25396825396825395);
      expect(await firstValueFrom(channel.gain$)).toBe(0.25396825396825395);

      channel.setGainDB(0);
      expect(await firstValueFrom(channel.gain$)).toBe(0.4444444444444444);
    });

    it('gainDB$', async () => {
      channel.setGainDB(-3);
      expect(await firstValueFrom(channel.gainDB$)).toBe(-3);

      channel.setGainDB(24);
      expect(await firstValueFrom(channel.gainDB$)).toBe(24);

      channel.setGain(0.5555555555555556);
      expect(await firstValueFrom(channel.gainDB$)).toBe(10);
    });

    it('changeGainDB', async () => {
      channel.setGainDB(4);
      channel.changeGainDB(3);
      expect(await firstValueFrom(channel.gainDB$)).toBe(7);

      channel.changeGainDB(-10);
      expect(await firstValueFrom(channel.gainDB$)).toBe(-3);
    });
  });
});
