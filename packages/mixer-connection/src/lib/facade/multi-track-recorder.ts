import { map, take, withLatestFrom } from 'rxjs';
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

  /** Recording busy state (`0` or `1`) */
  busy$ = this.store.state$.pipe(selectRawValue('var.mtk.rec.busy', 0));

  /** Recording time in seconds */
  recordingTime$ = this.store.state$.pipe(
    selectRawValue('var.mtk.rec.time', 0),
    withLatestFrom(this.recording$),
    map(([value, recording]) => (recording ? value : 0)) // set to 0 if not actually recording. otherwise, it emits strange values
  );

  /** Soundcheck activation state (`0` or `1`) */
  soundcheck$ = this.store.state$.pipe(selectRawValue('var.mtk.soundcheck', 0));

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

  /**
   * Set soundcheck (activate or deactivate)
   * @param value `0` or `1`
   */
  setSoundcheck(value: number) {
    const command = `SETD^var.mtk.soundcheck^${value}`;
    this.conn.sendMessage(command);
  }

  /** Activate soundcheck */
  activateSoundcheck() {
    this.setSoundcheck(1);
  }

  /** Deactivate soundcheck */
  deactivateSoundcheck() {
    this.setSoundcheck(0);
  }

  /** Toggle soundcheck */
  toggleSoundcheck() {
    this.soundcheck$.pipe(take(1)).subscribe(value => this.setSoundcheck(value ^ 1));
  }
}
