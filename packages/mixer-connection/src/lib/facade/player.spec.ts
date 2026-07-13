import { describe, it, expect, beforeEach } from 'vitest';
import { firstValueFrom } from 'rxjs';
import { SoundcraftUI } from '../soundcraft-ui';
import { PlayerState } from '../types';
import { MockWebSocket } from '../utils/mock-websocket';
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

  describe('Playlists', () => {
    let socket: MockWebSocket;
    let mixer: SoundcraftUI;
    let outbound: string[];

    /** outbound messages that belong to the playlist feature (ignores other facades and keepalive) */
    const playlistOutbound = () =>
      outbound.filter(msg =>
        ['MEDIA_GET_PLISTS', 'MEDIA_GET_PLIST_TRACKS'].includes(msg.split('^')[0]),
      );

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

    it('fetches playlists automatically on connection open', () => {
      expect(playlistOutbound()).toEqual(['MEDIA_GET_PLISTS']);
    });

    it('requests tracks for each playlist after the PLISTS reply', () => {
      socket.simulateMessage('3:::PLISTS^List1^List2^~all~');
      expect(playlistOutbound()).toEqual([
        'MEDIA_GET_PLISTS',
        'MEDIA_GET_PLIST_TRACKS^List1',
        'MEDIA_GET_PLIST_TRACKS^List2',
        'MEDIA_GET_PLIST_TRACKS^~all~',
      ]);
    });

    it('playlists$', async () => {
      socket.simulateMessage('3:::PLISTS^List1^List2^~all~');
      expect(await firstValueFrom(mixer.player.playlists$)).toEqual(['List1', 'List2', '~all~']);
    });

    it('playlists$ should only re-emit when the list of names actually changes', () => {
      const emissions: string[][] = [];
      mixer.player.playlists$.subscribe(names => emissions.push(names));

      socket.simulateMessage('3:::PLISTS^List1^List2');
      socket.simulateMessage('3:::PLISTS^List1^List2'); // identical -> suppressed
      socket.simulateMessage('3:::PLISTS^List1^Other'); // same length, different name
      socket.simulateMessage('3:::PLISTS^List1'); // different length

      expect(emissions).toEqual([['List1', 'List2'], ['List1', 'Other'], ['List1']]);
    });

    it('playlistsWithTracks$', async () => {
      socket.simulateMessage('3:::PLISTS^List1^List2^~all~');
      socket.simulateMessage('3:::PLIST_TRACKS^List1^a.mp3^b.mp3');
      expect(await firstValueFrom(mixer.player.playlistsWithTracks$)).toEqual({
        List1: ['a.mp3', 'b.mp3'],
        List2: [],
        '~all~': [],
      });
    });

    it('prunes removed playlists when a new PLISTS arrives', async () => {
      socket.simulateMessage('3:::PLISTS^List1^List2');
      socket.simulateMessage('3:::PLIST_TRACKS^List1^a.mp3');
      socket.simulateMessage('3:::PLIST_TRACKS^List2^c.mp3');

      // List2 is gone now
      socket.simulateMessage('3:::PLISTS^List1');
      expect(await firstValueFrom(mixer.player.playlistsWithTracks$)).toEqual({
        List1: ['a.mp3'],
      });
    });
  });

  describe('Shuffle', () => {
    it('shuffle$', async () => {
      player.setShuffle(false);
      expect(await firstValueFrom(player.shuffle$)).toBe(false);

      player.setShuffle(true);
      expect(await firstValueFrom(player.shuffle$)).toBe(true);
    });

    it('toggleShuffle', async () => {
      player.setShuffle(false);
      player.toggleShuffle();
      expect(await firstValueFrom(player.shuffle$)).toBe(true);

      player.toggleShuffle();
      expect(await firstValueFrom(player.shuffle$)).toBe(false);
    });
  });
});
