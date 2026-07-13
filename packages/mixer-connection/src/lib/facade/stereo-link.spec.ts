import { describe, it, expect, beforeEach } from 'vitest';
import { SoundcraftUI } from '../soundcraft-ui';
import { collectMessages } from '../test.utils';

/**
 * Tests for stereo-linking of channels.
 *
 * When channels (or AUX buses) are stereo-linked, outbound commands are mirrored
 * to all linked channels so the pair stays in sync. The set of linked channels is
 * derived reactively from `stereoIndex` state:
 *   - a link's first channel has stereoIndex 0, the second has stereoIndex 1
 *   - `getLinkedChannelNumber`: 0 -> channel+1, 1 -> channel-1, else not linked
 *
 * The AUX case is the complex one: when both the channel AND the AUX bus are linked,
 * a single command reaches up to 4 channels.
 */
describe('Stereo linking', () => {
  let conn: SoundcraftUI;

  beforeEach(() => {
    conn = new SoundcraftUI('0.0.0.0');
  });

  describe('master channels', () => {
    it('should mirror commands to the linked neighbour (first in link)', () => {
      // link input 3 & 4, input 3 is first in the link
      conn.conn.sendMessage('SETD^i.2.stereoIndex^0');
      const channel = conn.master.input(3);

      let messages = collectMessages(conn);
      channel.setFaderLevel(0.5);
      expect(messages).toEqual(['SETD^i.2.mix^0.5', 'SETD^i.3.mix^0.5']);

      messages = collectMessages(conn);
      channel.setMute(true);
      expect(messages).toEqual(['SETD^i.2.mute^1', 'SETD^i.3.mute^1']);

      messages = collectMessages(conn);
      channel.setSolo(true);
      expect(messages).toEqual(['SETD^i.2.solo^1', 'SETD^i.3.solo^1']);

      messages = collectMessages(conn);
      channel.automixAssignGroup('a');
      expect(messages).toEqual(['SETD^i.2.amixgroup^0', 'SETD^i.3.amixgroup^0']);

      messages = collectMessages(conn);
      channel.automixSetWeight(0.5);
      expect(messages).toEqual(['SETD^i.2.amix^0.5', 'SETD^i.3.amix^0.5']);
    });

    it('should mirror commands to the linked neighbour (second in link)', () => {
      // link input 3 & 4, input 4 is second in the link
      conn.conn.sendMessage('SETD^i.3.stereoIndex^1');
      const channel = conn.master.input(4);

      const messages = collectMessages(conn);
      channel.setFaderLevel(0.5);
      expect(messages).toEqual(['SETD^i.3.mix^0.5', 'SETD^i.2.mix^0.5']);
    });

    it('should NOT mirror PAN (it is the only per-channel setting)', () => {
      conn.conn.sendMessage('SETD^i.2.stereoIndex^0');
      const channel = conn.master.input(3);

      const messages = collectMessages(conn);
      channel.setPan(0.5);
      expect(messages).toEqual(['SETD^i.2.pan^0.5']);
    });

    it('should not mirror anything when the channel is not linked', () => {
      // unrelated message so the state exists and stereoIndex resolves to -1
      conn.conn.sendMessage('SETD^m.mix^0.5');
      const channel = conn.master.input(3);

      const messages = collectMessages(conn);
      channel.setFaderLevel(0.5);
      expect(messages).toEqual(['SETD^i.2.mix^0.5']);
    });

    it('should work for line and player channel types', () => {
      // link line 1 & 2, link player 1 & 2 (both first in link)
      conn.conn.sendMessage('SETD^l.0.stereoIndex^0');
      conn.conn.sendMessage('SETD^p.0.stereoIndex^0');

      let messages = collectMessages(conn);
      conn.master.line(1).setFaderLevel(0.5);
      expect(messages).toEqual(['SETD^l.0.mix^0.5', 'SETD^l.1.mix^0.5']);

      messages = collectMessages(conn);
      conn.master.player(1).setMute(true);
      expect(messages).toEqual(['SETD^p.0.mute^1', 'SETD^p.1.mute^1']);
    });
  });

  describe('AUX channels — only the channel is linked (mono AUX bus)', () => {
    beforeEach(() => {
      // AUX bus 2 is NOT linked, but input 3 & 4 are linked (input 3 first)
      conn.conn.sendMessage('SETD^a.1.stereoIndex^-1');
      conn.conn.sendMessage('SETD^i.2.stereoIndex^0');
    });

    it('should mirror to the neighbour channel on the same bus', () => {
      const channel = conn.aux(2).input(3);

      let messages = collectMessages(conn);
      channel.setFaderLevel(0.5);
      expect(messages).toEqual(['SETD^i.2.aux.1.value^0.5', 'SETD^i.3.aux.1.value^0.5']);

      messages = collectMessages(conn);
      channel.setMute(true);
      expect(messages).toEqual(['SETD^i.2.aux.1.mute^1', 'SETD^i.3.aux.1.mute^1']);

      messages = collectMessages(conn);
      channel.setPost(true);
      expect(messages).toEqual(['SETD^i.2.aux.1.post^1', 'SETD^i.3.aux.1.post^1']);

      messages = collectMessages(conn);
      channel.setPostProc(true);
      expect(messages).toEqual(['SETD^i.2.aux.1.postproc^1', 'SETD^i.3.aux.1.postproc^1']);
    });
  });

  describe('AUX channels — only the AUX bus is linked', () => {
    beforeEach(() => {
      // AUX bus 1 & 2 are linked (bus 1 first), but input 3 is NOT linked
      conn.conn.sendMessage('SETD^a.0.stereoIndex^0');
      conn.conn.sendMessage('SETD^i.2.stereoIndex^-1');
    });

    it('should mirror to this channel on the linked bus', () => {
      const channel = conn.aux(1).input(3);

      const messages = collectMessages(conn);
      channel.setFaderLevel(0.5);
      expect(messages).toEqual(['SETD^i.2.aux.0.value^0.5', 'SETD^i.2.aux.1.value^0.5']);
    });

    it('should mirror PAN to this channel on the linked bus', () => {
      const channel = conn.aux(1).input(3);

      const messages = collectMessages(conn);
      channel.setPan(0.5);
      expect(messages).toEqual(['SETD^i.2.aux.0.pan^0.5', 'SETD^i.2.aux.1.pan^0.5']);
    });
  });

  describe('AUX channels — both the AUX bus and the channel are linked (4 channels)', () => {
    beforeEach(() => {
      // AUX bus 1 & 2 linked (bus 1 first), input 3 & 4 linked (input 3 first)
      conn.conn.sendMessage('SETD^a.0.stereoIndex^0');
      conn.conn.sendMessage('SETD^i.2.stereoIndex^0');
    });

    it('should set faderLevel on all four channels', () => {
      const channel = conn.aux(1).input(3);

      const messages = collectMessages(conn);
      channel.setFaderLevel(0.5);
      expect(messages).toEqual([
        'SETD^i.2.aux.0.value^0.5', // self
        'SETD^i.3.aux.0.value^0.5', // neighbour on this bus
        'SETD^i.2.aux.1.value^0.5', // this channel on the linked bus
        'SETD^i.3.aux.1.value^0.5', // neighbour on the linked bus
      ]);
    });

    it('should set MUTE on all four channels', () => {
      const channel = conn.aux(1).input(3);

      const messages = collectMessages(conn);
      channel.setMute(true);
      expect(messages).toEqual([
        'SETD^i.2.aux.0.mute^1',
        'SETD^i.3.aux.0.mute^1',
        'SETD^i.2.aux.1.mute^1',
        'SETD^i.3.aux.1.mute^1',
      ]);
    });

    it('should set PRE/POST on all four channels', () => {
      const channel = conn.aux(1).input(3);

      const messages = collectMessages(conn);
      channel.setPost(true);
      expect(messages).toEqual([
        'SETD^i.2.aux.0.post^1',
        'SETD^i.3.aux.0.post^1',
        'SETD^i.2.aux.1.post^1',
        'SETD^i.3.aux.1.post^1',
      ]);
    });

    it('should set PRE/POST PROC on all four channels', () => {
      const channel = conn.aux(1).input(3);

      const messages = collectMessages(conn);
      channel.setPostProc(true);
      expect(messages).toEqual([
        'SETD^i.2.aux.0.postproc^1',
        'SETD^i.3.aux.0.postproc^1',
        'SETD^i.2.aux.1.postproc^1',
        'SETD^i.3.aux.1.postproc^1',
      ]);
    });

    it('should mirror PAN only to this channel on both buses (not the neighbours)', () => {
      const channel = conn.aux(1).input(3);

      const messages = collectMessages(conn);
      channel.setPan(0.5);
      expect(messages).toEqual(['SETD^i.2.aux.0.pan^0.5', 'SETD^i.2.aux.1.pan^0.5']);
    });
  });

  describe('AUX channels — lower-numbered link partner (second in link)', () => {
    it('should resolve the partner bus and channel downwards', () => {
      // AUX bus 1 & 2 linked, bus 2 is second; input 3 & 4 linked, input 4 is second
      conn.conn.sendMessage('SETD^a.1.stereoIndex^1');
      conn.conn.sendMessage('SETD^i.3.stereoIndex^1');
      const channel = conn.aux(2).input(4);

      const messages = collectMessages(conn);
      channel.setMute(true);
      expect(messages).toEqual([
        'SETD^i.3.aux.1.mute^1', // self
        'SETD^i.2.aux.1.mute^1', // neighbour on this bus
        'SETD^i.3.aux.0.mute^1', // this channel on the linked bus
        'SETD^i.2.aux.0.mute^1', // neighbour on the linked bus
      ]);
    });
  });

  describe('AUX channels — not linked', () => {
    it('should only address the channel itself', () => {
      // unrelated message so the state exists and stereoIndex resolves to -1
      conn.conn.sendMessage('SETD^m.mix^0.5');
      const channel = conn.aux(2).input(3);

      const messages = collectMessages(conn);
      channel.setFaderLevel(0.5);
      expect(messages).toEqual(['SETD^i.2.aux.1.value^0.5']);
    });
  });

  describe('FX channels', () => {
    // FX buses are never stereo-linked pairs (unlike AUX buses), so only the source
    // channel can be linked. Mirroring therefore reaches at most the neighbour source.
    it('should mirror commands to the linked neighbour (first in link)', () => {
      conn.conn.sendMessage('SETD^i.2.stereoIndex^0'); // input 3 & 4 linked, input 3 first
      const channel = conn.fx(1).input(3);

      let messages = collectMessages(conn);
      channel.setFaderLevel(0.5);
      expect(messages).toEqual(['SETD^i.2.fx.0.value^0.5', 'SETD^i.3.fx.0.value^0.5']);

      messages = collectMessages(conn);
      channel.setMute(true);
      expect(messages).toEqual(['SETD^i.2.fx.0.mute^1', 'SETD^i.3.fx.0.mute^1']);

      messages = collectMessages(conn);
      channel.setPost(true);
      expect(messages).toEqual(['SETD^i.2.fx.0.post^1', 'SETD^i.3.fx.0.post^1']);
    });

    it('should mirror commands to the linked neighbour (second in link)', () => {
      conn.conn.sendMessage('SETD^i.3.stereoIndex^1'); // input 3 & 4 linked, input 4 second
      const channel = conn.fx(1).input(4);

      const messages = collectMessages(conn);
      channel.setFaderLevel(0.5);
      expect(messages).toEqual(['SETD^i.3.fx.0.value^0.5', 'SETD^i.2.fx.0.value^0.5']);
    });

    it('should not mirror anything when the channel is not linked', () => {
      // unrelated message so the state exists and stereoIndex resolves to -1
      conn.conn.sendMessage('SETD^m.mix^0.5');
      const channel = conn.fx(1).input(3);

      const messages = collectMessages(conn);
      channel.setFaderLevel(0.5);
      expect(messages).toEqual(['SETD^i.2.fx.0.value^0.5']);
    });
  });

  describe('matrix channels', () => {
    // A matrix source has two independently-linkable axes: the source (an AUX bus or
    // subgroup) and the matrix output (which lives in an `a` slot, keyed like an AUX
    // bus). Both use `selectStereoIndex('a', ...)`. As with AUX channels, a single
    // command can reach up to 4 channels; PAN only mirrors across the matrix-output
    // link, never to the source neighbour.
    describe('AUX source — only the source is linked', () => {
      it('should mirror to the neighbour source on the same matrix', () => {
        conn.conn.sendMessage('SETD^a.6.stereoIndex^-1'); // matrix output (mtx 7) not linked
        conn.conn.sendMessage('SETD^a.2.stereoIndex^0'); // aux 3 & 4 linked, aux 3 first
        const channel = conn.mtx(7).aux(3);

        const messages = collectMessages(conn);
        channel.setFaderLevel(0.5);
        expect(messages).toEqual(['SETD^a.2.mtx.6.value^0.5', 'SETD^a.3.mtx.6.value^0.5']);
      });
    });

    describe('AUX source — only the matrix output is linked', () => {
      beforeEach(() => {
        conn.conn.sendMessage('SETD^a.2.stereoIndex^-1'); // aux 3 not linked
        conn.conn.sendMessage('SETD^a.6.stereoIndex^0'); // matrix 7 & 8 linked, matrix 7 first
      });

      it('should mirror this source to the linked matrix output', () => {
        const channel = conn.mtx(7).aux(3);

        const messages = collectMessages(conn);
        channel.setFaderLevel(0.5);
        expect(messages).toEqual(['SETD^a.2.mtx.6.value^0.5', 'SETD^a.2.mtx.7.value^0.5']);
      });

      it('should mirror PAN to this source on the linked matrix output', () => {
        const channel = conn.mtx(7).aux(3);

        const messages = collectMessages(conn);
        channel.setPan(0.5);
        expect(messages).toEqual(['SETD^a.2.mtx.6.pan^0.5', 'SETD^a.2.mtx.7.pan^0.5']);
      });
    });

    describe('AUX source — both the source and the matrix output are linked (4 channels)', () => {
      beforeEach(() => {
        conn.conn.sendMessage('SETD^a.2.stereoIndex^0'); // aux 3 & 4 linked, aux 3 first
        conn.conn.sendMessage('SETD^a.6.stereoIndex^0'); // matrix 7 & 8 linked, matrix 7 first
      });

      it('should set faderLevel on all four channels', () => {
        const channel = conn.mtx(7).aux(3);

        const messages = collectMessages(conn);
        channel.setFaderLevel(0.5);
        expect(messages).toEqual([
          'SETD^a.2.mtx.6.value^0.5', // self
          'SETD^a.3.mtx.6.value^0.5', // neighbour source on this matrix
          'SETD^a.2.mtx.7.value^0.5', // this source on the linked matrix
          'SETD^a.3.mtx.7.value^0.5', // neighbour source on the linked matrix
        ]);
      });

      it('should set MUTE on all four channels', () => {
        const channel = conn.mtx(7).aux(3);

        const messages = collectMessages(conn);
        channel.setMute(true);
        expect(messages).toEqual([
          'SETD^a.2.mtx.6.mute^1',
          'SETD^a.3.mtx.6.mute^1',
          'SETD^a.2.mtx.7.mute^1',
          'SETD^a.3.mtx.7.mute^1',
        ]);
      });

      it('should set PRE/POST PROC on all four channels', () => {
        const channel = conn.mtx(7).aux(3);

        const messages = collectMessages(conn);
        channel.setPostProc(true);
        expect(messages).toEqual([
          'SETD^a.2.mtx.6.postproc^1',
          'SETD^a.3.mtx.6.postproc^1',
          'SETD^a.2.mtx.7.postproc^1',
          'SETD^a.3.mtx.7.postproc^1',
        ]);
      });

      it('should mirror PAN only to this source on both matrices (not the neighbours)', () => {
        const channel = conn.mtx(7).aux(3);

        const messages = collectMessages(conn);
        channel.setPan(0.5);
        expect(messages).toEqual(['SETD^a.2.mtx.6.pan^0.5', 'SETD^a.2.mtx.7.pan^0.5']);
      });
    });

    describe('AUX source — lower-numbered link partners (second in link)', () => {
      it('should resolve the partner source and matrix downwards', () => {
        conn.conn.sendMessage('SETD^a.3.stereoIndex^1'); // aux 3 & 4 linked, aux 4 second
        conn.conn.sendMessage('SETD^a.7.stereoIndex^1'); // matrix 7 & 8 linked, matrix 8 second
        const channel = conn.mtx(8).aux(4);

        const messages = collectMessages(conn);
        channel.setMute(true);
        expect(messages).toEqual([
          'SETD^a.3.mtx.7.mute^1', // self
          'SETD^a.2.mtx.7.mute^1', // neighbour source on this matrix
          'SETD^a.3.mtx.6.mute^1', // this source on the linked matrix
          'SETD^a.2.mtx.6.mute^1', // neighbour source on the linked matrix
        ]);
      });
    });

    describe('AUX source — not linked', () => {
      it('should only address the source itself', () => {
        // unrelated message so the state exists and both stereo indices resolve to -1
        conn.conn.sendMessage('SETD^m.mix^0.5');
        const channel = conn.mtx(7).aux(3);

        const messages = collectMessages(conn);
        channel.setFaderLevel(0.5);
        expect(messages).toEqual(['SETD^a.2.mtx.6.value^0.5']);
      });
    });

    describe('master source', () => {
      // The master mix has no channel index (path `m.mtx.<bus>`) and is not linkable
      // itself, but it is mirrored across the stereo-linked matrix output.
      it('should mirror to the master on the linked matrix output', () => {
        conn.conn.sendMessage('SETD^a.6.stereoIndex^0'); // matrix 7 & 8 linked, matrix 7 first
        const channel = conn.mtx(7).master();

        let messages = collectMessages(conn);
        channel.setFaderLevel(0.5);
        expect(messages).toEqual(['SETD^m.mtx.6.value^0.5', 'SETD^m.mtx.7.value^0.5']);

        // PAN uses the same single mirror as the other sends
        messages = collectMessages(conn);
        channel.setPan(0.5);
        expect(messages).toEqual(['SETD^m.mtx.6.pan^0.5', 'SETD^m.mtx.7.pan^0.5']);
      });

      it('should only address the master itself when the matrix output is not linked', () => {
        conn.conn.sendMessage('SETD^m.mix^0.5');
        const channel = conn.mtx(7).master();

        const messages = collectMessages(conn);
        channel.setFaderLevel(0.5);
        expect(messages).toEqual(['SETD^m.mtx.6.value^0.5']);
      });
    });
  });
});
