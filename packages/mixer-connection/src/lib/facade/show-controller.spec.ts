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

  it('updateCurrentSnapshot', () => {
    conn.conn.sendMessage('SETD^var.currentShow^THESHOW');
    conn.conn.sendMessage('SETD^var.currentSnapshot^THESNAPSHOT');
    conn.conn.sendMessage('SETD^var.currentCue^THECUE');

    conn.conn.sendMessage = jest.fn();
    conn.shows.updateCurrentSnapshot();

    expect(conn.conn.sendMessage).toHaveBeenCalledWith('SAVESNAPSHOT^THESHOW^THESNAPSHOT');
  });

  it('updateCurrentCue', () => {
    conn.conn.sendMessage('SETD^var.currentShow^THESHOW');
    conn.conn.sendMessage('SETD^var.currentSnapshot^THESNAPSHOT');
    conn.conn.sendMessage('SETD^var.currentCue^THECUE');

    conn.conn.sendMessage = jest.fn();
    conn.shows.updateCurrentCue();

    expect(conn.conn.sendMessage).toHaveBeenCalledWith('SAVECUE^THESHOW^THECUE');
  });
});
