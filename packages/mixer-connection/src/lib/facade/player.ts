import { MixerConnection } from '../mixer-connection';
import { MixerStore } from '../state/mixer-store';

/**
 * Represents the media player
 */
export class Player {
  constructor(private conn: MixerConnection, private state: MixerStore) {}

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
    this.conn.sendMessage(`SETD^settings.shuffle^${value}`);
  }

  /**
   * Set player mode like `manual` or `auto`.
   * Values are rather internal, please use convenience functions `manual()` and `auto()`.
   * @param value
   */
  setPlayMode(value: number) {
    this.conn.sendMessage(`SETD^settings.playMode^${value}`);
  }

  /** Enable manual mode */
  manual() {
    this.setPlayMode(0);
  }

  /** Enable automatic mode */
  auto() {
    this.setPlayMode(3);
  }
}
