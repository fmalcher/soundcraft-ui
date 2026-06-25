import { distinctUntilChanged, filter, map, take } from 'rxjs';

import { MixerConnection } from '../mixer-connection';
import { MixerStore } from '../state/mixer-store';
import { PLAYLISTS_KEY, PLAYLIST_TRACKS_KEY, requestResourceList } from '../state/resource-lists';
import {
  select,
  selectBoolean,
  selectPlayerElapsedTime,
  selectPlayerLength,
  selectPlayerRemainingTime,
  selectRawValue,
} from '../state/state-selectors';
import { ConnectionStatus, PlayerState, PlaylistsWithTracks } from '../types';

/**
 * Represents the media player
 */
export class Player {
  /** Current state (playing, stopped, paused) */
  readonly state$ = this.store.state$.pipe(
    selectRawValue<PlayerState>('var.currentState', PlayerState.Stopped),
  );

  /** Current playlist name */
  readonly playlist$ = this.store.state$.pipe(selectRawValue<string>('var.currentPlaylist'));

  /** Current track name */
  readonly track$ = this.store.state$.pipe(selectRawValue<string>('var.currentTrack'));

  /** Current track length in seconds */
  readonly length$ = this.store.state$.pipe(select(selectPlayerLength()));

  /** Elapsed time of current track in seconds */
  readonly elapsedTime$ = this.store.state$.pipe(select(selectPlayerElapsedTime()));

  /** Remaining time of current track in seconds */
  readonly remainingTime$ = this.store.state$.pipe(select(selectPlayerRemainingTime()));

  /** Shuffle state */
  readonly shuffle$ = this.store.state$.pipe(selectBoolean('settings.shuffle'));

  /**
   * All available playlists with their tracks (playlist name -> track names).
   * Fetched on connect; refresh manually with {@link refreshPlaylists}.
   */
  readonly playlistsWithTracks$ = this.store.resourceListState$.pipe(
    map((state): PlaylistsWithTracks => {
      const names = state[PLAYLISTS_KEY] ?? [];
      return Object.fromEntries(
        names.map(name => [name, state[`${PLAYLIST_TRACKS_KEY}^${name}`] ?? []]),
      );
    }),
  );

  /**
   * Names of all available playlists.
   * Fetched on connect; refresh manually with {@link refreshPlaylists}.
   */
  readonly playlists$ = this.store.resourceListState$.pipe(
    map(state => state[PLAYLISTS_KEY] ?? []),
    distinctUntilChanged((a, b) => a.length === b.length && a.every((value, i) => value === b[i])),
  );

  constructor(
    private conn: MixerConnection,
    private store: MixerStore,
  ) {
    // playlists are sent per-client on request, so (re-)fetch them on every connection open
    this.conn.status$
      .pipe(filter(e => e.type === ConnectionStatus.Open))
      .subscribe(() => this.refreshPlaylists());
  }

  /** Start the media player */
  play() {
    this.conn.sendMessage(`MEDIA_PLAY`);
  }

  /** Pause the media player */
  pause() {
    this.conn.sendMessage(`MEDIA_PAUSE`);
  }

  /** Stop the media player */
  stop() {
    this.conn.sendMessage(`MEDIA_STOP`);
  }

  /** Jump to next track */
  next() {
    this.conn.sendMessage(`MEDIA_NEXT`);
  }

  /** Jump to previous track */
  prev() {
    this.conn.sendMessage(`MEDIA_PREV`);
  }

  /**
   * Load a playlist by name
   * @param playlist Playlist name
   */
  loadPlaylist(playlist: string) {
    this.conn.sendMessage(`MEDIA_SWITCH_PLIST^${playlist}`);
  }

  /**
   * Load a track from a given playlist
   * @param playlist Playlist name
   * @param track Track name on the playlist
   */
  loadTrack(playlist: string, track: string) {
    this.conn.sendMessage(`MEDIA_SWITCH_TRACK^${playlist}^${track}`);
  }

  /**
   * Set player shuffle state
   * @param value shuffle state
   */
  setShuffle(value: boolean) {
    this.conn.setdBool('settings.shuffle', value);
  }

  /**
   * Toggle player shuffle state
   */
  toggleShuffle() {
    this.shuffle$.pipe(take(1)).subscribe(value => this.setShuffle(!value));
  }

  /**
   * Set player mode like `manual` or `auto`.
   * Values are rather internal, please use convenience functions `manual()` and `auto()`.
   * @param value
   */
  setPlayMode(value: number) {
    this.conn.setd('settings.playMode', value);
  }

  /** Enable manual mode */
  setManual() {
    this.setPlayMode(0);
  }

  /** Enable automatic mode */
  setAuto() {
    this.setPlayMode(3);
  }

  /**
   * Request the list of playlists and their tracks from the mixer.
   * Results are exposed through {@link playlists$} and {@link playlistsWithTracks$}.
   * This is called automatically on every connection open.
   */
  refreshPlaylists() {
    requestResourceList(this.conn, 'MEDIA_GET_PLISTS', 'PLISTS').subscribe(playlists =>
      playlists.forEach(name => this.conn.sendMessage(`MEDIA_GET_PLIST_TRACKS^${name}`)),
    );
  }
}
