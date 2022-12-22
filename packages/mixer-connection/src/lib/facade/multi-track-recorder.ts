import { map, withLatestFrom } from 'rxjs';
import { MixerConnection } from '../mixer-connection';
import { MixerStore } from '../state/mixer-store';
import {
  select,
  selectMtkElapsedTime,
  selectMtkLength,
  selectMtkRemainingTime,
  selectRawValue,
} from '../state/state-selectors';
import { MtkState } from '../types';

/**
 * Represents the multi track recorder (Ui24R only)
 */
export class MultiTrackRecorder {
  /** Current state (playing, stopped, paused) */
  state$ = this.store.state$.pipe(
    selectRawValue<MtkState>('var.mtk.currentState', MtkState.Stopped)
  );

  /** Current session name (e.g. `0001` or individual name) */
  session$ = this.store.state$.pipe(
    selectRawValue<number | string>('var.mtk.session'),
    map(value => {
      if (typeof value === 'number') {
        // convert to 4-digit string
        return value.toString().padStart(4, '0');
      } else {
        return value;
      }
    })
  );

  /** Current session length in seconds */
  length$ = this.store.state$.pipe(select(selectMtkLength()));

  /** Elapsed time of current session in seconds */
  elapsedTime$ = this.store.state$.pipe(select(selectMtkElapsedTime()));

  /** Remaining time of current session in seconds */
  remainingTime$ = this.store.state$.pipe(select(selectMtkRemainingTime()));

  /** Recording state (`0` or `1`) */
  recording$ = this.store.state$.pipe(selectRawValue('var.mtk.rec.currentState', 0));

  /** Recording time in seconds */
  recordingTime$ = this.store.state$.pipe(
    selectRawValue('var.mtk.rec.time', 0),
    withLatestFrom(this.recording$),
    map(([value, recording]) => (recording ? value : 0)) // set to 0 if not actually recording. otherwise, it emits strange values
  );

  constructor(private conn: MixerConnection, private store: MixerStore) {}

  /** Start the player */
  play() {
    this.conn.sendMessage('MTK_PLAY');
  }

  /** Pause the player */
  pause() {
    this.conn.sendMessage('MTK_PAUSE');
  }

  /** Stop the player */
  stop() {
    this.conn.sendMessage('MTK_STOP');
  }

  /** Toggle recording */
  recordToggle() {
    this.conn.sendMessage('MTK_REC_TOGGLE');
  }
}
