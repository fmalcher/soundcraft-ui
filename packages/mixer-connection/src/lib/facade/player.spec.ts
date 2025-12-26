import { describe, it, expect, beforeEach } from 'vitest';
import { firstValueFrom } from 'rxjs';
import { SoundcraftUI } from '../soundcraft-ui';
import { PlayerState } from '../types';
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
    expect(await firstValueFrom(player.state$)).toBe(PlayerState.Stopped);

    conn.conn.sendMessage('SETD^var.currentState^2');
    expect(await firstValueFrom(player.state$)).toBe(PlayerState.Playing);

    conn.conn.sendMessage('SETD^var.currentState^3');
    expect(await firstValueFrom(player.state$)).toBe(PlayerState.Paused);
  });

  it('playlist$', async () => {
    conn.conn.sendMessage('SETS^var.currentPlaylist^Testplaylist');
    expect(await firstValueFrom(player.playlist$)).toBe('Testplaylist');
  });

  it('track$', async () => {
    conn.conn.sendMessage('SETS^var.currentTrack^Testtrack');
    expect(await firstValueFrom(player.track$)).toBe('Testtrack');
  });

  it('length$', async () => {
    conn.conn.sendMessage('SETD^var.currentLength^125');
    expect(await firstValueFrom(player.length$)).toBe(125);
  });

  it('elapsedTime$', async () => {
    conn.conn.sendMessage('SETD^var.currentLength^130');
    conn.conn.sendMessage('SETD^var.currentTrackPos^0.6'); // between 0 and 1
    expect(await firstValueFrom(player.elapsedTime$)).toBe(78);
  });

  it('remainingTime$', async () => {
    conn.conn.sendMessage('SETD^var.currentLength^130');
    conn.conn.sendMessage('SETD^var.currentTrackPos^0.6'); // between 0 and 1
    expect(await firstValueFrom(player.remainingTime$)).toBe(52);
  });

  describe('Shuffle', () => {
    it('shuffle$', async () => {
      player.setShuffle(0);
      expect(await firstValueFrom(player.shuffle$)).toBe(0);

      player.setShuffle(1);
      expect(await firstValueFrom(player.shuffle$)).toBe(1);
    });

    it('toggleShuffle', async () => {
      player.setShuffle(0);
      player.toggleShuffle();
      expect(await firstValueFrom(player.shuffle$)).toBe(1);

      player.toggleShuffle();
      expect(await firstValueFrom(player.shuffle$)).toBe(0);
    });
  });
});
