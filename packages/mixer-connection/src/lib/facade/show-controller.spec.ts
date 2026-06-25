import { describe, it, expect, beforeEach, vi } from 'vitest';
import { firstValueFrom } from 'rxjs';
import { SoundcraftUI } from '../soundcraft-ui';
import { MockWebSocket } from '../utils/mock-websocket';

describe('Show Controller', () => {
  let conn: SoundcraftUI;

  beforeEach(() => {
    conn = new SoundcraftUI('0.0.0.0');
  });

  it('currentShow$', async () => {
    conn.conn.sendMessage('SETS^var.currentShow^THESHOW');
    expect(await firstValueFrom(conn.shows.currentShow$)).toBe('THESHOW');
  });

  it('currentSnapshot$', async () => {
    conn.conn.sendMessage('SETS^var.currentSnapshot^THESNAPSHOT');
    expect(await firstValueFrom(conn.shows.currentSnapshot$)).toBe('THESNAPSHOT');
  });

  it('currentCue$', async () => {
    conn.conn.sendMessage('SETS^var.currentCue^THECUE');
    expect(await firstValueFrom(conn.shows.currentCue$)).toBe('THECUE');
  });

  describe('Shows listing', () => {
    let socket: MockWebSocket;
    let mixer: SoundcraftUI;
    let outbound: string[];

    /** outbound messages that belong to the show listing feature (ignores other facades and keepalive) */
    const showOutbound = () =>
      outbound.filter(msg => ['SHOWLIST', 'SNAPSHOTLIST', 'CUELIST'].includes(msg.split('^')[0]));

    beforeEach(async () => {
      mixer = new SoundcraftUI({
        targetIP: '0.0.0.0',
        webSocketCtor: MockWebSocket.withCapture(
          instance => (socket = instance),
        ) as unknown as typeof WebSocket,
      });
      outbound = [];
      mixer.conn.outbound$.subscribe(msg => outbound.push(msg));

      const connected = mixer.conn.connect();
      socket.simulateOpen();
      await connected;
    });

    it('fetches shows automatically on connection open', () => {
      expect(showOutbound()).toEqual(['SHOWLIST']);
    });

    it('requests snapshots and cues for each show after the SHOWLIST reply', () => {
      socket.simulateMessage('3:::SHOWLIST^Default^test');
      expect(showOutbound()).toEqual([
        'SHOWLIST',
        'SNAPSHOTLIST^Default',
        'CUELIST^Default',
        'SNAPSHOTLIST^test',
        'CUELIST^test',
      ]);
    });

    it('shows$', async () => {
      socket.simulateMessage('3:::SHOWLIST^Default^test');
      socket.simulateMessage('3:::SNAPSHOTLIST^Default^snap1^snap2');
      socket.simulateMessage('3:::CUELIST^Default^cue1');
      expect(await firstValueFrom(mixer.shows.shows$)).toEqual({
        Default: { snapshots: ['snap1', 'snap2'], cues: ['cue1'] },
        test: { snapshots: [], cues: [] },
      });
    });

    it('treats an empty cue list (trailing separator) as no cues', async () => {
      socket.simulateMessage('3:::SHOWLIST^Default');
      socket.simulateMessage('3:::CUELIST^Default^');
      expect(await firstValueFrom(mixer.shows.shows$)).toEqual({
        Default: { snapshots: [], cues: [] },
      });
    });

    it('prunes removed shows when a new SHOWLIST arrives', async () => {
      socket.simulateMessage('3:::SHOWLIST^Default^test');
      socket.simulateMessage('3:::SNAPSHOTLIST^Default^snap1');

      // test is gone now
      socket.simulateMessage('3:::SHOWLIST^Default');
      expect(await firstValueFrom(mixer.shows.shows$)).toEqual({
        Default: { snapshots: ['snap1'], cues: [] },
      });
    });
  });

  describe('updateCurrentSnapshot', () => {
    it('should send SAVESNAPSHOT message', () => {
      conn.conn.sendMessage('SETS^var.currentShow^THESHOW');
      conn.conn.sendMessage('SETS^var.currentSnapshot^THESNAPSHOT');
      conn.conn.sendMessage('SETS^var.currentCue^THECUE');

      conn.conn.sendMessage = vi.fn();
      conn.shows.updateCurrentSnapshot();

      expect(conn.conn.sendMessage).toHaveBeenCalledWith('SAVESNAPSHOT^THESHOW^THESNAPSHOT');
    });

    it('should not send message when no snapshot is given', () => {
      conn.conn.sendMessage('SETS^var.currentShow^THESHOW');
      conn.conn.sendMessage('SETS^var.currentCue^THECUE');

      conn.conn.sendMessage = vi.fn();
      conn.shows.updateCurrentSnapshot();

      expect(conn.conn.sendMessage).not.toHaveBeenCalled();
    });

    it('should not send message when no show is given', () => {
      conn.conn.sendMessage('SETS^var.currentSnapshot^THESNAPSHOT');
      conn.conn.sendMessage('SETS^var.currentCue^THECUE');

      conn.conn.sendMessage = vi.fn();
      conn.shows.updateCurrentSnapshot();

      expect(conn.conn.sendMessage).not.toHaveBeenCalled();
    });
  });

  describe('updateCurrentCue', () => {
    it('should send SAVECUE message', () => {
      conn.conn.sendMessage('SETS^var.currentShow^THESHOW');
      conn.conn.sendMessage('SETS^var.currentSnapshot^THESNAPSHOT');
      conn.conn.sendMessage('SETS^var.currentCue^THECUE');

      conn.conn.sendMessage = vi.fn();
      conn.shows.updateCurrentCue();

      expect(conn.conn.sendMessage).toHaveBeenCalledWith('SAVECUE^THESHOW^THECUE');
    });

    it('should not send message when no cue is given', () => {
      conn.conn.sendMessage('SETS^var.currentShow^THESHOW');
      conn.conn.sendMessage('SETS^var.currentSnapshot^THESNAPSHOT');

      conn.conn.sendMessage = vi.fn();
      conn.shows.updateCurrentCue();

      expect(conn.conn.sendMessage).not.toHaveBeenCalled();
    });

    it('should not send message when no show is given', () => {
      conn.conn.sendMessage('SETS^var.currentSnapshot^THESNAPSHOT');
      conn.conn.sendMessage('SETS^var.currentCue^THECUE');

      conn.conn.sendMessage = vi.fn();
      conn.shows.updateCurrentCue();

      expect(conn.conn.sendMessage).not.toHaveBeenCalled();
    });
  });
});
