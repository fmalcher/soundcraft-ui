import { take } from 'rxjs';
import { MixerConnection } from '../mixer-connection';
import { MixerStore } from '../state/mixer-store';
import { selectRawValue } from '../state/state-selectors';

/**
 * Represents the 2-track recorder in the media player
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

  /** Start recording */
  recordStart() {
    this.recording$.pipe(take(1)).subscribe(recording => {
      // to start recording we have to make sure recording is stopped so that toggling will start it
      if (!recording) {
        this.recordToggle();
      }
    });
  }

  /** Stop recording */
  recordStop() {
    this.recording$.pipe(take(1)).subscribe(recording => {
      // to stop recording we have to make sure recording is running so that toggling will stop it
      if (recording) {
        this.recordToggle();
      }
    });
  }
}
