import { take } from 'rxjs';

import { MixerConnection } from '../mixer-connection';
import { MixerStore } from '../state/mixer-store';
import {
  select,
  selectPlayerElapsedTime,
  selectPlayerLength,
  selectPlayerRemainingTime,
  selectRawValue,
} from '../state/state-selectors';
import { PlayerState } from '../types';

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

  /** Shuffle setting (`0` or `1`) */
  readonly shuffle$ = this.store.state$.pipe(selectRawValue('settings.shuffle', 0));

  constructor(
    private conn: MixerConnection,
    private store: MixerStore,
  ) {}

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
   * Set player shuffle setting
   * @param value `0` or `1`
   */
  setShuffle(value: number) {
    this.conn.setd('settings.shuffle', value);
  }

  /**
   * Toggle player shuffle setting
   */
  toggleShuffle() {
    this.shuffle$.pipe(take(1)).subscribe(value => this.setShuffle(value ^ 1));
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
}
