import { MixerConnection } from '../mixer-connection';
import { MixerStore } from '../state/mixer-store';

/**
 * Represents the media player
 */
export class Player {
  constructor(private conn: MixerConnection, private state: MixerStore) {}

  play() {
    this.conn.sendMessage(`MEDIA_PLAY`);
  }

  pause() {
    this.conn.sendMessage(`MEDIA_PAUSE`);
  }

  stop() {
    this.conn.sendMessage(`MEDIA_STOP`);
  }

  next() {
    this.conn.sendMessage(`MEDIA_NEXT`);
  }

  prev() {
    this.conn.sendMessage(`MEDIA_PREV`);
  }

  loadPlaylist(playlist: string) {
    this.conn.sendMessage(`MEDIA_SWITCH_PLIST^${playlist}`);
  }

  loadTrack(playlist: string, track: string) {
    this.conn.sendMessage(`MEDIA_SWITCH_TRACK^${playlist}^${track}`);
  }

  setShuffle(value: number) {
    this.conn.sendMessage(`SETD^settings.shuffle^${value}`);
  }

  setPlayMode(value: number) {
    this.conn.sendMessage(`SETD^settings.playMode^${value}`);
  }

  manual() {
    this.setPlayMode(0);
  }

  auto() {
    this.setPlayMode(3);
  }
}
