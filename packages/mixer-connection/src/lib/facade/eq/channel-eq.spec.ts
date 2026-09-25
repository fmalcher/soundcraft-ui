import { describe, it, expect, beforeEach } from 'vitest';
import { firstValueFrom } from 'rxjs';
import { SoundcraftUI } from '../../soundcraft-ui';
import { collectMessages } from '../../test.utils';
import { ChannelEq } from './channel-eq';
import { EqBand } from './eq-band';
import { EqFilter } from './eq-filter';

describe('Channel EQ', () => {
  let conn: SoundcraftUI;
  let eq: ChannelEq;

  beforeEach(() => {
    conn = new SoundcraftUI('0.0.0.0');
    eq = new ChannelEq(conn.conn, conn.store, 'i', 'i.2', () => ['i.2']);
  });

  it('should only exist for channels with a parametric EQ', () => {
    (['i', 'l', 'p', 'f', 's'] as const).forEach(type => {
      expect(() => new ChannelEq(conn.conn, conn.store, type, `${type}.0`, () => [])).not.toThrow();
    });
    expect(() => new ChannelEq(conn.conn, conn.store, 'a', 'a.0', () => [])).toThrow();
    expect(() => new ChannelEq(conn.conn, conn.store, 'v', 'v.0', () => [])).toThrow();
  });

  describe('on/off', () => {
    it('enabled$ should be the inverted bypass switch', async () => {
      conn.conn.sendMessage('SETD^i.2.eq.bypass^1');
      expect(await firstValueFrom(eq.enabled$)).toBe(false);

      conn.conn.sendMessage('SETD^i.2.eq.bypass^0');
      expect(await firstValueFrom(eq.enabled$)).toBe(true);
    });

    it('enable, disable and setEnabled', async () => {
      const messages = collectMessages(conn);
      eq.disable();
      eq.enable();
      eq.setEnabled(false);
      eq.setEnabled(true);
      expect(messages).toEqual([
        'SETD^i.2.eq.bypass^1',
        'SETD^i.2.eq.bypass^0',
        'SETD^i.2.eq.bypass^1',
        'SETD^i.2.eq.bypass^0',
      ]);
      expect(await firstValueFrom(eq.enabled$)).toBe(true);
    });

    it('toggle', async () => {
      eq.enable();
      eq.toggle();
      expect(await firstValueFrom(eq.enabled$)).toBe(false);

      eq.toggle();
      expect(await firstValueFrom(eq.enabled$)).toBe(true);
    });
  });

  describe('bands', () => {
    it('should return bands 1 to 4', () => {
      [1, 2, 3, 4].forEach(n => {
        const band = eq.band(n);
        expect(band).toBeInstanceOf(EqBand);
        expect(band.band).toBe(n);
      });
    });

    it('should return the same band object every time', () => {
      expect(eq.band(2) === eq.band(2)).toBe(true);
    });

    it('should reject other band numbers', () => {
      expect(() => eq.band(0)).toThrow('EQ band must be between 1 and 4.');
      expect(() => eq.band(5)).toThrow('EQ band must be between 1 and 4.');
    });
  });

  describe('filters', () => {
    it('hpf', () => {
      expect(eq.hpf).toBeInstanceOf(EqFilter);
      expect(eq.hpf.type).toBe('hpf');
      expect(eq.hpf === eq.hpf).toBe(true);
    });

    it('lpf', () => {
      expect(eq.lpf).toBeInstanceOf(EqFilter);
      expect(eq.lpf.type).toBe('lpf');
      expect(eq.lpf === eq.lpf).toBe(true);
    });

    it('lpf should only exist for input channels', () => {
      (['l', 'p', 'f', 's'] as const).forEach(type => {
        const other = new ChannelEq(conn.conn, conn.store, type, `${type}.0`, () => []);
        expect(() => other.lpf).toThrow('The low-pass filter is only available for input channels');
      });
    });
  });

  it('should pass the channel and its linked channels to bands and filters', () => {
    let linked = ['i.2'];
    eq = new ChannelEq(conn.conn, conn.store, 'i', 'i.2', () => linked);

    linked = ['i.2', 'i.3'];
    const messages = collectMessages(conn);
    eq.disable();
    eq.band(4).setGainDB(6);
    eq.hpf.disable();
    eq.lpf.disable();
    expect(messages).toEqual([
      'SETD^i.2.eq.bypass^1',
      'SETD^i.3.eq.bypass^1',
      'SETD^i.2.eq.b4.gain^0.65',
      'SETD^i.3.eq.b4.gain^0.65',
      'SETD^i.2.eq.hpf.freq^0',
      'SETD^i.3.eq.hpf.freq^0',
      'SETD^i.2.eq.lpf.freq^1',
      'SETD^i.3.eq.lpf.freq^1',
    ]);
  });
});
