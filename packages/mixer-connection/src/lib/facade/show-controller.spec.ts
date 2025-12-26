import { describe, it, expect, beforeEach, vi } from 'vitest';
import { firstValueFrom } from 'rxjs';
import { SoundcraftUI } from '../soundcraft-ui';

describe('Show Controller', () => {
  let conn: SoundcraftUI;

  beforeEach(() => {
    conn = new SoundcraftUI('0.0.0.0');
  });

  it('currentShow$', async () => {
    conn.conn.sendMessage('SETD^var.currentShow^THESHOW');
    expect(await firstValueFrom(conn.shows.currentShow$)).toBe('THESHOW');
  });

  it('currentSnapshot$', async () => {
    conn.conn.sendMessage('SETD^var.currentSnapshot^THESNAPSHOT');
    expect(await firstValueFrom(conn.shows.currentSnapshot$)).toBe('THESNAPSHOT');
  });

  it('currentCue$', async () => {
    conn.conn.sendMessage('SETD^var.currentCue^THECUE');
    expect(await firstValueFrom(conn.shows.currentCue$)).toBe('THECUE');
  });

  describe('updateCurrentSnapshot', () => {
    it('should send SAVESNAPSHOT message', () => {
      conn.conn.sendMessage('SETD^var.currentShow^THESHOW');
      conn.conn.sendMessage('SETD^var.currentSnapshot^THESNAPSHOT');
      conn.conn.sendMessage('SETD^var.currentCue^THECUE');

      conn.conn.sendMessage = vi.fn();
      conn.shows.updateCurrentSnapshot();

      expect(conn.conn.sendMessage).toHaveBeenCalledWith('SAVESNAPSHOT^THESHOW^THESNAPSHOT');
    });

    it('should not send message when no snapshot is given', () => {
      conn.conn.sendMessage('SETD^var.currentShow^THESHOW');
      conn.conn.sendMessage('SETD^var.currentCue^THECUE');

      conn.conn.sendMessage = vi.fn();
      conn.shows.updateCurrentSnapshot();

      expect(conn.conn.sendMessage).not.toHaveBeenCalled();
    });

    it('should not send message when no show is given', () => {
      conn.conn.sendMessage('SETD^var.currentSnapshot^THESNAPSHOT');
      conn.conn.sendMessage('SETD^var.currentCue^THECUE');

      conn.conn.sendMessage = vi.fn();
      conn.shows.updateCurrentSnapshot();

      expect(conn.conn.sendMessage).not.toHaveBeenCalled();
    });
  });

  describe('updateCurrentCue', () => {
    it('should send SAVECUE message', () => {
      conn.conn.sendMessage('SETD^var.currentShow^THESHOW');
      conn.conn.sendMessage('SETD^var.currentSnapshot^THESNAPSHOT');
      conn.conn.sendMessage('SETD^var.currentCue^THECUE');

      conn.conn.sendMessage = vi.fn();
      conn.shows.updateCurrentCue();

      expect(conn.conn.sendMessage).toHaveBeenCalledWith('SAVECUE^THESHOW^THECUE');
    });

    it('should not send message when no cue is given', () => {
      conn.conn.sendMessage('SETD^var.currentShow^THESHOW');
      conn.conn.sendMessage('SETD^var.currentSnapshot^THESNAPSHOT');

      conn.conn.sendMessage = vi.fn();
      conn.shows.updateCurrentCue();

      expect(conn.conn.sendMessage).not.toHaveBeenCalled();
    });

    it('should not send message when no show is given', () => {
      conn.conn.sendMessage('SETD^var.currentSnapshot^THESNAPSHOT');
      conn.conn.sendMessage('SETD^var.currentCue^THECUE');

      conn.conn.sendMessage = vi.fn();
      conn.shows.updateCurrentCue();

      expect(conn.conn.sendMessage).not.toHaveBeenCalled();
    });
  });
});
