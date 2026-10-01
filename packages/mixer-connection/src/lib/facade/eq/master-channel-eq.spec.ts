import { describe, it, expect, beforeEach } from 'vitest';
import { firstValueFrom } from 'rxjs';
import * as publicApi from '../../../index';
import { SoundcraftUI } from '../../soundcraft-ui';
import { collectMessages } from '../../test.utils';
import { ChannelEq } from './channel-eq';

/**
 * Integration of the channel EQ into the master bus channels (`conn.master.input(3).eq`)
 */
describe('Master channel EQ', () => {
  let conn: SoundcraftUI;

  beforeEach(() => {
    conn = new SoundcraftUI('0.0.0.0');
  });

  it('should be available for input, line, player, FX and sub group channels', () => {
    const m = conn.master;
    [m.input(3), m.line(1), m.player(2), m.fx(1), m.sub(4)].forEach(channel => {
      expect(channel.eq).toBeInstanceOf(ChannelEq);
    });
  });

  it('should not be available for AUX, matrix and VCA channels', () => {
    const error = 'EQ is only available for input, line, player, FX and sub group channels';
    expect(() => conn.master.aux(2).eq).toThrow(error);
    expect(() => conn.master.mtx(7).eq).toThrow(error);
    expect(() => conn.master.vca(1).eq).toThrow(error);
  });

  it('should return the same EQ object every time', () => {
    expect(conn.master.input(3).eq === conn.master.input(3).eq).toBe(true);
    expect(conn.master.input(3).eq.band(1) === conn.master.input(3).eq.band(1)).toBe(true);
  });

  it('should control the channel it belongs to', async () => {
    const messages = collectMessages(conn);
    conn.master.input(3).eq.band(1).setGainDB(6);
    conn.master.line(2).eq.disable();
    conn.master.player(1).eq.hpf.setSlope(24);
    conn.master.fx(4).eq.band(4).setFrequency(1000);
    conn.master.sub(6).eq.band(2).setQ(1);
    expect(messages).toEqual([
      'SETD^i.2.eq.b1.gain^0.65',
      'SETD^l.1.eq.bypass^1',
      'SETD^p.0.eq.hpf.slope^1',
      'SETD^f.3.eq.b4.freq^0.5584347738',
      'SETD^s.5.eq.b2.q^0.5252185347',
    ]);
    expect(await firstValueFrom(conn.master.input(3).eq.band(1).gainDB$)).toBe(6);
  });

  describe('stereo link', () => {
    it('should mirror EQ commands to the linked neighbour (first in link)', () => {
      // get the EQ before linking: the link must be picked up later
      const eq = conn.master.input(3).eq;
      conn.conn.sendMessage('SETD^i.2.stereoIndex^0');

      let messages = collectMessages(conn);
      eq.band(1).setGainDB(6);
      expect(messages).toEqual(['SETD^i.2.eq.b1.gain^0.65', 'SETD^i.3.eq.b1.gain^0.65']);

      messages = collectMessages(conn);
      eq.disable();
      expect(messages).toEqual(['SETD^i.2.eq.bypass^1', 'SETD^i.3.eq.bypass^1']);

      messages = collectMessages(conn);
      eq.hpf.setSlope(24);
      expect(messages).toEqual(['SETD^i.2.eq.hpf.slope^1', 'SETD^i.3.eq.hpf.slope^1']);

      messages = collectMessages(conn);
      eq.lpf.disable();
      expect(messages).toEqual(['SETD^i.2.eq.lpf.freq^1', 'SETD^i.3.eq.lpf.freq^1']);
    });

    it('should mirror EQ commands to the linked neighbour (second in link)', () => {
      conn.conn.sendMessage('SETD^i.3.stereoIndex^1');

      const messages = collectMessages(conn);
      conn.master.input(4).eq.band(2).setQ(1);
      expect(messages).toEqual(['SETD^i.3.eq.b2.q^0.5252185347', 'SETD^i.2.eq.b2.q^0.5252185347']);
    });

    it('should mirror EQ commands for line and player channels', () => {
      conn.conn.sendMessage('SETD^l.0.stereoIndex^0');
      conn.conn.sendMessage('SETD^p.0.stereoIndex^0');

      const messages = collectMessages(conn);
      conn.master.line(1).eq.enable();
      conn.master.player(1).eq.band(3).setGainDB(-3);
      expect(messages).toEqual([
        'SETD^l.0.eq.bypass^0',
        'SETD^l.1.eq.bypass^0',
        'SETD^p.0.eq.b3.gain^0.425',
        'SETD^p.1.eq.b3.gain^0.425',
      ]);
    });

    it('should not mirror EQ commands of channels that are not linked', () => {
      conn.conn.sendMessage('SETD^i.2.stereoIndex^-1');

      const messages = collectMessages(conn);
      conn.master.input(3).eq.band(1).setGainDB(6);
      expect(messages).toEqual(['SETD^i.2.eq.b1.gain^0.65']);
    });
  });

  it('should be part of the public API', () => {
    expect(publicApi.ChannelEq).toBe(ChannelEq);
    expect(typeof publicApi.EqBand).toBe('function');
    expect(typeof publicApi.EqFilter).toBe('function');
    expect(publicApi.EQ_FILTERS.hpf.maxHz).toBe(1000);
    expect(publicApi.frequencyToFaderValue(200)).toBe(0.3286901902);
    expect(publicApi.faderValueToFrequency(0.3286901902)).toBe(200);
    expect(publicApi.qToFaderValue(1)).toBe(0.5252185347);
    expect(publicApi.faderValueToQ(0.5252185347)).toBe(1);
    expect(publicApi.eqGainDBToFaderValue(6)).toBe(0.65);
    expect(publicApi.faderValueToEqGainDB(0.65)).toBe(6);
  });
});
