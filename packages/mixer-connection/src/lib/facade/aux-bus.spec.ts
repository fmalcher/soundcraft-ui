import { describe, it, expect, beforeEach } from 'vitest';
import { firstValueFrom } from 'rxjs';
import { SoundcraftUI } from '../soundcraft-ui';
import { AuxChannel } from './aux-channel';
import { MtxBus } from './mtx-bus';
import { collectMessages } from '../test.utils';

describe('AUX Bus', () => {
  let conn: SoundcraftUI;

  beforeEach(() => {
    conn = new SoundcraftUI('0.0.0.0');
  });

  describe('channel getters', () => {
    it('input() should return an AuxChannel', () => {
      expect(conn.aux(3).input(1)).toBeInstanceOf(AuxChannel);
    });

    it('line() should return an AuxChannel', () => {
      expect(conn.aux(3).line(1)).toBeInstanceOf(AuxChannel);
    });

    it('player() should return an AuxChannel', () => {
      expect(conn.aux(3).player(1)).toBeInstanceOf(AuxChannel);
    });

    it('fx() should return an AuxChannel', () => {
      expect(conn.aux(3).fx(1)).toBeInstanceOf(AuxChannel);
    });
  });

  describe('isMatrix$', () => {
    it('should default to false when no matrix state is present', async () => {
      // send an unrelated message so the state emits at least once
      conn.conn.sendMessage('SETD^m.mix^0.5');
      expect(await firstValueFrom(conn.aux(7).isMatrix$)).toBe(false);
    });

    it('should emit true when the AUX bus is configured as a matrix', async () => {
      conn.conn.sendMessage('SETD^a.6.matrix^1');
      expect(await firstValueFrom(conn.aux(7).isMatrix$)).toBe(true);
    });

    it('should emit false when the AUX bus is not a matrix', async () => {
      conn.conn.sendMessage('SETD^a.6.matrix^0');
      expect(await firstValueFrom(conn.aux(7).isMatrix$)).toBe(false);
    });
  });

  describe('switchToMatrix()', () => {
    it('should return the matrix bus (MtxBus) for the same slot', () => {
      const mtx = conn.aux(7).switchToMatrix();
      expect(mtx).toBeInstanceOf(MtxBus);
    });

    it('should return the same singleton as conn.mtx()', () => {
      const auxConvertedToMtx = conn.aux(7).switchToMatrix();
      const mtx = conn.mtx(7);
      expect(auxConvertedToMtx === mtx).toBe(true);
    });

    it('should switch the slot to a matrix', () => {
      const messages = collectMessages(conn);

      conn.aux(7).switchToMatrix();
      expect(messages).toEqual(['SETD^a.6.matrix^1']);
    });

    it('should also switch the stereo-linked neighbour', () => {
      // stereo-link AUX slots 7 & 8 (slot 7 is the first in the link)
      conn.conn.sendMessage('SETD^a.6.stereoIndex^0');

      const messages = collectMessages(conn);

      conn.aux(7).switchToMatrix();
      expect(messages).toEqual(['SETD^a.6.matrix^1', 'SETD^a.7.matrix^1']);
    });

    it('should switch a lower-numbered linked neighbour', () => {
      // stereo-link AUX slots 7 & 8 where slot 8 is the second in the link
      conn.conn.sendMessage('SETD^a.7.stereoIndex^1');

      const messages = collectMessages(conn);

      conn.aux(8).switchToMatrix();
      expect(messages).toEqual(['SETD^a.7.matrix^1', 'SETD^a.6.matrix^1']);
    });
  });
});
