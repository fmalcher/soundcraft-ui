import { describe, it, expect, beforeEach } from 'vitest';
import { firstValueFrom } from 'rxjs';
import { SoundcraftUI } from '../soundcraft-ui';
import { AuxBus } from './aux-bus';
import { MtxBusChannel } from './mtx-bus-channel';
import { MtxMasterChannel } from './mtx-master-channel';
import { collectMessages } from '../test.utils';

describe('MTX Bus', () => {
  let conn: SoundcraftUI;

  beforeEach(() => {
    conn = new SoundcraftUI('0.0.0.0');
  });

  describe('source getters', () => {
    it('aux() should return a MtxBusChannel', () => {
      expect(conn.mtx(7).aux(1)).toBeInstanceOf(MtxBusChannel);
    });

    it('sub() should return a MtxBusChannel', () => {
      expect(conn.mtx(7).sub(1)).toBeInstanceOf(MtxBusChannel);
    });

    it('master() should return a MtxMasterChannel', () => {
      expect(conn.mtx(7).master()).toBeInstanceOf(MtxMasterChannel);
    });
  });

  describe('isMatrix$', () => {
    it('should default to false when no matrix state is present', async () => {
      // send an unrelated message so the state emits at least once
      conn.conn.sendMessage('SETD^m.mix^0.5');
      expect(await firstValueFrom(conn.mtx(7).isMatrix$)).toBe(false);
    });

    it('should emit true when the slot is configured as a matrix', async () => {
      conn.conn.sendMessage('SETD^a.6.matrix^1');
      expect(await firstValueFrom(conn.mtx(7).isMatrix$)).toBe(true);
    });

    it('should emit false when the slot is not a matrix', async () => {
      conn.conn.sendMessage('SETD^a.6.matrix^0');
      expect(await firstValueFrom(conn.mtx(7).isMatrix$)).toBe(false);
    });
  });

  describe('switchToAux()', () => {
    it('should return the AUX bus (AuxBus) for the same slot', () => {
      const aux = conn.mtx(7).switchToAux();
      expect(aux).toBeInstanceOf(AuxBus);
    });

    it('should return the same singleton as conn.aux()', () => {
      const mtxConvertedToAux = conn.mtx(7).switchToAux();
      const aux = conn.aux(7);
      expect(mtxConvertedToAux === aux).toBe(true);
    });

    it('should switch the slot back to a regular AUX bus', () => {
      const messages = collectMessages(conn);

      conn.mtx(7).switchToAux();
      expect(messages).toEqual(['SETD^a.6.matrix^0']);
    });

    it('should also switch the stereo-linked neighbour', () => {
      // stereo-link slots 3 & 4 (slot 3 is the first in the link)
      conn.conn.sendMessage('SETD^a.2.stereoIndex^0');

      const messages = collectMessages(conn);

      conn.mtx(3).switchToAux();
      expect(messages).toEqual(['SETD^a.2.matrix^0', 'SETD^a.3.matrix^0']);
    });

    it('should switch a lower-numbered linked neighbour', () => {
      // stereo-link slots 3 & 4 where slot 4 is the second in the link
      conn.conn.sendMessage('SETD^a.3.stereoIndex^1');

      const messages = collectMessages(conn);

      conn.mtx(4).switchToAux();
      expect(messages).toEqual(['SETD^a.3.matrix^0', 'SETD^a.2.matrix^0']);
    });
  });
});
