import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { firstValueFrom } from 'rxjs';
import { SoundcraftUI } from '../soundcraft-ui';
import { Easings } from '../utils/transitions/easings';
import { DBToFaderValue } from '../utils/value-converters';
import { MtxBusChannel } from './mtx-bus-channel';
import { MtxChannel } from './mtx-channel';

describe('MTX Bus Channel', () => {
  let conn: SoundcraftUI;
  let channel: MtxBusChannel;

  beforeEach(() => {
    conn = new SoundcraftUI('0.0.0.0');
    channel = conn.mtx(7).aux(3);
  });

  it('should return the exact same channel object', () => {
    const obj1 = conn.mtx(7).aux(2);
    const obj2 = conn.mtx(7).aux(2);
    expect(obj1).toBe(obj2);
  });

  it('should be an instance of the MtxChannel base class', () => {
    expect(conn.mtx(7).aux(1)).toBeInstanceOf(MtxChannel);
  });

  describe('Fader Level', () => {
    it('faderLevel$', async () => {
      channel.setFaderLevel(0.5);
      expect(await firstValueFrom(channel.faderLevel$)).toBe(0.5);

      channel.setFaderLevel(0.8889);
      expect(await firstValueFrom(channel.faderLevel$)).toBe(0.8889);
    });

    it('changeFaderLevel', async () => {
      channel.setFaderLevel(0.5);
      channel.changeFaderLevel(0.2);
      expect(await firstValueFrom(channel.faderLevel$)).toBe(0.7);

      channel.changeFaderLevel(-0.4);
      expect(await firstValueFrom(channel.faderLevel$)).toBe(0.3);
    });

    it('changeFaderLevelDB should change the level from -Infinity dB upwards', async () => {
      channel.setFaderLevel(0); // -Infinity dB
      channel.changeFaderLevelDB(3);

      expect(await firstValueFrom(channel.faderLevelDB$)).toBe(-97);
      expect(await firstValueFrom(channel.faderLevel$)).toBe(DBToFaderValue(-97));
    });
  });

  describe('fader transition', () => {
    beforeEach(() => vi.useFakeTimers());
    afterEach(() => vi.useRealTimers());

    it('fadeTo should transition the matrix source to the target linear value', () => {
      const results: number[] = [];
      channel.faderLevel$.subscribe(v => results.push(v));

      channel.setFaderLevel(0.3);
      channel.fadeTo(0.8, 1000, Easings.Linear);
      vi.advanceTimersByTime(1000);

      expect(results.length).toBeGreaterThan(2); // multiple intermediate steps
      expect(results.at(-1)).toBe(0.8);
    });

    it('fadeToDB should transition the matrix source to the target dB value', () => {
      const results: number[] = [];
      channel.faderLevelDB$.subscribe(v => results.push(v));

      channel.setFaderLevelDB(-60);
      channel.fadeToDB(-3, 1000, Easings.Linear);
      vi.advanceTimersByTime(1000);

      expect(results.at(-1)).toBe(-3);
    });
  });

  describe('MUTE', () => {
    it('mute$', async () => {
      channel.mute();
      expect(await firstValueFrom(channel.mute$)).toBe(true);

      channel.unmute();
      expect(await firstValueFrom(channel.mute$)).toBe(false);
    });

    it('toggleMute', async () => {
      channel.setMute(false);
      channel.toggleMute();
      expect(await firstValueFrom(channel.mute$)).toBe(true);

      channel.toggleMute();
      expect(await firstValueFrom(channel.mute$)).toBe(false);
    });
  });

  describe('Pan', () => {
    it('pan$', async () => {
      channel.setPan(0);
      expect(await firstValueFrom(channel.pan$)).toBe(0);

      channel.setPan(1);
      expect(await firstValueFrom(channel.pan$)).toBe(1);

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

      channel.changePan(-0.333000001);
      expect(await firstValueFrom(channel.pan$)).toBe(0.353);
    });
  });

  describe('PRE/POST PROC', () => {
    it('postProc$', async () => {
      channel.postProc();
      expect(await firstValueFrom(channel.postProc$)).toBe(true);

      channel.preProc();
      expect(await firstValueFrom(channel.postProc$)).toBe(false);

      channel.setPostProc(true);
      expect(await firstValueFrom(channel.postProc$)).toBe(true);
    });
  });

  describe('name$', () => {
    it('should return the default name for an AUX source', async () => {
      // a matrix source is always a regular AUX/subgroup (a matrix cannot be routed into a matrix)
      conn.conn.sendMessage('SETS^a.2.name^');
      expect(await firstValueFrom(conn.mtx(7).aux(3).name$)).toBe('AUX 3');
    });

    it('should return the default name for a subgroup source', async () => {
      conn.conn.sendMessage('SETS^s.0.name^');
      expect(await firstValueFrom(conn.mtx(7).sub(1).name$)).toBe('SUB 1');
    });

    it('should prefer a custom name over the default', async () => {
      conn.conn.sendMessage('SETS^a.2.name^MYSOURCE');
      expect(await firstValueFrom(conn.mtx(7).aux(3).name$)).toBe('MYSOURCE');
    });
  });

  it('should work with subgroup sources', async () => {
    const sub = conn.mtx(7).sub(1);
    sub.setFaderLevel(0.42);
    expect(await firstValueFrom(sub.faderLevel$)).toBe(0.42);
  });
});
