import { SoundcraftUI } from '../soundcraft-ui';
import { PlayerState } from '../types';
import { readFirst } from '../utils/testing-utils';
import { Player } from './player';

describe('Player', () => {
  let conn: SoundcraftUI;
  let player: Player;

  beforeEach(() => {
    conn = new SoundcraftUI('0.0.0.0');
    player = conn.player;
  });

  it('state$', async () => {
    conn.conn.sendMessage('SETD^var.currentState^0');
    expect(await readFirst(player.state$)).toBe(PlayerState.Stopped);

    conn.conn.sendMessage('SETD^var.currentState^2');
    expect(await readFirst(player.state$)).toBe(PlayerState.Playing);

    conn.conn.sendMessage('SETD^var.currentState^3');
    expect(await readFirst(player.state$)).toBe(PlayerState.Paused);
  });

  it('playlist$', async () => {
    conn.conn.sendMessage('SETS^var.currentPlaylist^Testplaylist');
    expect(await readFirst(player.playlist$)).toBe('Testplaylist');
  });

  it('track$', async () => {
    conn.conn.sendMessage('SETS^var.currentTrack^Testtrack');
    expect(await readFirst(player.track$)).toBe('Testtrack');
  });

  it('length$', async () => {
    conn.conn.sendMessage('SETD^var.currentLength^125');
    expect(await readFirst(player.length$)).toBe(125);
  });

  it('elapsedTime$', async () => {
    conn.conn.sendMessage('SETD^var.currentLength^130');
    conn.conn.sendMessage('SETD^var.currentTrackPos^0.6'); // between 0 and 1
    expect(await readFirst(player.elapsedTime$)).toBe(78);
  });

  it('remainingTime$', async () => {
    conn.conn.sendMessage('SETD^var.currentLength^130');
    conn.conn.sendMessage('SETD^var.currentTrackPos^0.6'); // between 0 and 1
    expect(await readFirst(player.remainingTime$)).toBe(52);
  });

  describe('Shuffle', () => {
    it('dim$', async () => {
      player.setShuffle(0);
      expect(await readFirst(player.shuffle$)).toBe(0);

      player.setShuffle(1);
      expect(await readFirst(player.shuffle$)).toBe(1);
    });

    it('toggleShuffle', async () => {
      player.setShuffle(0);
      player.toggleShuffle();
      expect(await readFirst(player.shuffle$)).toBe(1);

      player.toggleShuffle();
      expect(await readFirst(player.shuffle$)).toBe(0);
    });
  });
});
