import { describe, it, expect, beforeEach } from 'vitest';
import { firstValueFrom } from 'rxjs';
import { SoundcraftUI } from '../../soundcraft-ui';
import { collectMessages } from '../../test.utils';
import { EqBand } from './eq-band';

describe('EQ band', () => {
  let conn: SoundcraftUI;
  let band: EqBand;

  beforeEach(() => {
    conn = new SoundcraftUI('0.0.0.0');
    band = new EqBand(conn.conn, conn.store, 'i.2', () => ['i.2'], 1);
  });

  it('should only exist for bands 1 to 4', () => {
    expect(() => new EqBand(conn.conn, conn.store, 'i.2', () => ['i.2'], 0)).toThrow();
    expect(() => new EqBand(conn.conn, conn.store, 'i.2', () => ['i.2'], 5)).toThrow();
    expect(new EqBand(conn.conn, conn.store, 'i.2', () => ['i.2'], 4).band).toBe(4);
  });

  describe('frequency', () => {
    it('frequency$ should emit Hz', async () => {
      conn.conn.sendMessage('SETD^i.2.eq.b1.freq^0.3286901902');
      expect(await firstValueFrom(band.frequency$)).toBe(200);
    });

    it('setFrequency', async () => {
      const messages = collectMessages(conn);
      band.setFrequency(1000);
      expect(messages).toEqual(['SETD^i.2.eq.b1.freq^0.5584347738']);
      expect(await firstValueFrom(band.frequency$)).toBe(1000);
    });

    it('setFrequency should be clamped to 20..22050 Hz', async () => {
      band.setFrequency(10);
      expect(await firstValueFrom(band.frequency$)).toBe(20);

      band.setFrequency(30000);
      expect(await firstValueFrom(band.frequency$)).toBe(22050);
    });
  });

  describe('Q', () => {
    it('q$', async () => {
      conn.conn.sendMessage('SETD^i.2.eq.b1.q^0.5252185347');
      expect(await firstValueFrom(band.q$)).toBe(1);
    });

    it('setQ', async () => {
      const messages = collectMessages(conn);
      band.setQ(2);
      expect(messages).toEqual(['SETD^i.2.eq.b1.q^0.6467426608']);
      expect(await firstValueFrom(band.q$)).toBe(2);
    });

    it('setQ should be clamped to 0.05..15', async () => {
      band.setQ(0.01);
      expect(await firstValueFrom(band.q$)).toBe(0.05);

      band.setQ(20);
      expect(await firstValueFrom(band.q$)).toBe(15);
    });
  });

  describe('gain', () => {
    it('gain$ and gainDB$', async () => {
      conn.conn.sendMessage('SETD^i.2.eq.b1.gain^0.65');
      expect(await firstValueFrom(band.gain$)).toBe(0.65);
      expect(await firstValueFrom(band.gainDB$)).toBe(6);
    });

    it('setGain should be clamped to 0..1', async () => {
      band.setGain(0.25);
      expect(await firstValueFrom(band.gain$)).toBe(0.25);

      band.setGain(1.5);
      expect(await firstValueFrom(band.gain$)).toBe(1);

      band.setGain(-1);
      expect(await firstValueFrom(band.gain$)).toBe(0);
    });

    it('setGainDB', async () => {
      const messages = collectMessages(conn);
      band.setGainDB(6);
      expect(messages).toEqual(['SETD^i.2.eq.b1.gain^0.65']);
      expect(await firstValueFrom(band.gainDB$)).toBe(6);
    });

    it('setGainDB should be clamped to -20..20 dB', async () => {
      band.setGainDB(25);
      expect(await firstValueFrom(band.gainDB$)).toBe(20);

      band.setGainDB(-25);
      expect(await firstValueFrom(band.gainDB$)).toBe(-20);
    });

    it('changeGainDB', async () => {
      band.setGainDB(-3);
      band.changeGainDB(1.5);
      expect(await firstValueFrom(band.gainDB$)).toBe(-1.5);

      band.changeGainDB(30);
      expect(await firstValueFrom(band.gainDB$)).toBe(20);
    });
  });

  it('should use its band number in the state paths', () => {
    band = new EqBand(conn.conn, conn.store, 's.5', () => ['s.5'], 3);
    const messages = collectMessages(conn);
    band.setGainDB(0);
    band.setFrequency(1000);
    band.setQ(1);
    expect(messages).toEqual([
      'SETD^s.5.eq.b3.gain^0.5',
      'SETD^s.5.eq.b3.freq^0.5584347738',
      'SETD^s.5.eq.b3.q^0.5252185347',
    ]);
  });

  it('should write to all linked channels, read at the time of the call', () => {
    let linked = ['i.2'];
    band = new EqBand(conn.conn, conn.store, 'i.2', () => linked, 2);

    linked = ['i.2', 'i.3'];
    const messages = collectMessages(conn);
    band.setGainDB(6);
    band.setFrequency(2500);
    band.setQ(1.4);
    expect(messages).toEqual([
      'SETD^i.2.eq.b2.gain^0.65',
      'SETD^i.3.eq.b2.gain^0.65',
      'SETD^i.2.eq.b2.freq^0.689233751',
      'SETD^i.3.eq.b2.freq^0.689233751',
      'SETD^i.2.eq.b2.q^0.5842096056',
      'SETD^i.3.eq.b2.q^0.5842096056',
    ]);
  });
});
