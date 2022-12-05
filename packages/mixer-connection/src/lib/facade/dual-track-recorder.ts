import { MixerConnection } from '../mixer-connection';
import { MixerStore } from '../state/mixer-store';
import { selectRawValue } from '../state/state-selectors';

/**
 * Represents the media player
 */
export class DualTrackRecorder {
  /** Recording state (`0` or `1`) */
  recording$ = this.store.state$.pipe(selectRawValue('var.isRecording', 0));

  /** Recording busy state (`0` or `1`) */
  busy$ = this.store.state$.pipe(selectRawValue('var.recBusy', 0));

  constructor(private conn: MixerConnection, private store: MixerStore) {}

  /** Toggle recording */
  recordToggle() {
    this.conn.sendMessage('RECTOGGLE');
  }
}
