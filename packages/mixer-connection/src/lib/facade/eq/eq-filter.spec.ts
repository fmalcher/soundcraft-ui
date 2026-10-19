import { describe, it, expect, beforeEach } from 'vitest';
import { firstValueFrom } from 'rxjs';
import { SoundcraftUI } from '../../soundcraft-ui';
import { collectMessages } from '../../test.utils';
import { EqFilter } from './eq-filter';
import { EqFilterSlope } from './eq-utils';

describe('EQ filter', () => {
  let conn: SoundcraftUI;

  beforeEach(() => {
    conn = new SoundcraftUI('0.0.0.0');
  });

  describe('high-pass filter', () => {
    let hpf: EqFilter;

    beforeEach(() => {
      hpf = new EqFilter(conn.conn, conn.store, 'i.2', () => ['i.2'], 'hpf');
    });

    it('should be at 20 Hz (off) at raw value 0', async () => {
      conn.conn.sendMessage('SETD^i.2.eq.hpf.freq^0');
      expect(await firstValueFrom(hpf.frequency$)).toBe(20);
    });

    it('setFrequency', async () => {
      conn.conn.sendMessage('SETD^i.2.eq.hpf.freq^0');
      const messages = collectMessages(conn);
      hpf.setFrequency(80);
      expect(messages).toEqual(['SETD^i.2.eq.hpf.freq^0.197891213']);
      expect(await firstValueFrom(hpf.frequency$)).toBe(80);
    });

    it('setFrequency should be clamped to 20..1000 Hz, 20 Hz is off', async () => {
      hpf.setFrequency(5000);
      expect(await firstValueFrom(hpf.frequency$)).toBe(1000);

      const messages = collectMessages(conn);
      hpf.setFrequency(10);
      expect(messages).toEqual(['SETD^i.2.eq.hpf.freq^0']);
      expect(await firstValueFrom(hpf.frequency$)).toBe(20);
    });

    it('slope', async () => {
      const messages = collectMessages(conn);
      hpf.setSlope(24);
      expect(messages).toEqual(['SETD^i.2.eq.hpf.slope^1']);
      expect(await firstValueFrom(hpf.slope$)).toBe(24);

      conn.conn.sendMessage('SETD^i.2.eq.hpf.slope^2');
      expect(await firstValueFrom(hpf.slope$)).toBe(36);

      hpf.setSlope(12);
      expect(await firstValueFrom(hpf.slope$)).toBe(12);
    });

    it('setSlope should only accept 12, 24 and 36 dB/oct', () => {
      expect(() => hpf.setSlope(18 as EqFilterSlope)).toThrow();
    });
  });

  describe('low-pass filter', () => {
    let lpf: EqFilter;

    beforeEach(() => {
      lpf = new EqFilter(conn.conn, conn.store, 'i.2', () => ['i.2'], 'lpf');
    });

    it('should be at 22050 Hz (off) at raw value 1', async () => {
      conn.conn.sendMessage('SETD^i.2.eq.lpf.freq^1');
      expect(await firstValueFrom(lpf.frequency$)).toBe(22050);
    });

    it('setFrequency', async () => {
      const messages = collectMessages(conn);
      lpf.setFrequency(12000);
      expect(messages).toEqual(['SETD^i.2.eq.lpf.freq^0.9131510628']);
      expect(await firstValueFrom(lpf.frequency$)).toBe(12000);
    });

    it('setFrequency should be clamped to 1000..22050 Hz, 22050 Hz is off', async () => {
      lpf.setFrequency(500);
      expect(await firstValueFrom(lpf.frequency$)).toBe(1000);

      const messages = collectMessages(conn);
      lpf.setFrequency(30000);
      expect(messages).toEqual(['SETD^i.2.eq.lpf.freq^1']);
      expect(await firstValueFrom(lpf.frequency$)).toBe(22050);
    });

    it('slope', async () => {
      const messages = collectMessages(conn);
      lpf.setSlope(36);
      expect(messages).toEqual(['SETD^i.2.eq.lpf.slope^2']);
      expect(await firstValueFrom(lpf.slope$)).toBe(36);
    });
  });

  it('should know its type', () => {
    expect(new EqFilter(conn.conn, conn.store, 'i.2', () => ['i.2'], 'lpf').type).toBe('lpf');
  });

  it('should write to all linked channels, read at the time of the call', () => {
    let linked = ['l.0'];
    const hpf = new EqFilter(conn.conn, conn.store, 'l.0', () => linked, 'hpf');

    linked = ['l.0', 'l.1'];
    const messages = collectMessages(conn);
    hpf.setFrequency(100);
    hpf.setSlope(36);
    hpf.setFrequency(20);
    expect(messages).toEqual([
      'SETD^l.0.eq.hpf.freq^0.2297445837',
      'SETD^l.1.eq.hpf.freq^0.2297445837',
      'SETD^l.0.eq.hpf.slope^2',
      'SETD^l.1.eq.hpf.slope^2',
      'SETD^l.0.eq.hpf.freq^0',
      'SETD^l.1.eq.hpf.freq^0',
    ]);
  });
});
