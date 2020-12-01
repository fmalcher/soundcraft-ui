import { MixerConnection } from '../mixer-connection';
import { MixerStore } from '../state/mixer-store';
import { select, selectRecordingBusyState, selectRecordingState } from '../state/state-selectors';

/**
 * Represents the media player
 */
export class DualTrackRecorder {
  /** Recording state (`0` or `1`) */
  recording$ = this.store.state$.pipe(select(selectRecordingState()));

  /** Recording busy state (`0` or `1`) */
  busy$ = this.store.state$.pipe(select(selectRecordingBusyState()));

  constructor(private conn: MixerConnection, private store: MixerStore) {}

  /** Toggle recording */
  recordToggle() {
    this.conn.sendMessage('RECTOGGLE');
  }
}
