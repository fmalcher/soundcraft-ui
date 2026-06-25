import { map, take, withLatestFrom } from 'rxjs';
import { MixerConnection } from '../mixer-connection';
import { MixerStore } from '../state/mixer-store';
import {
  select,
  selectBoolean,
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
  readonly state$ = this.store.state$.pipe(
    selectRawValue<MtkState>('var.mtk.currentState', MtkState.Stopped),
  );

  /** Current session name (e.g. `0001` or individual name) */
  readonly session$ = this.store.state$.pipe(
    selectRawValue<number | string>('var.mtk.session'),
    map(value => {
      if (typeof value === 'number') {
        // convert to 4-digit string
        return value.toString().padStart(4, '0');
      } else {
        return value;
      }
    }),
  );

  /** Current session length in seconds */
  readonly length$ = this.store.state$.pipe(select(selectMtkLength()));

  /** Elapsed time of current session in seconds */
  readonly elapsedTime$ = this.store.state$.pipe(select(selectMtkElapsedTime()));

  /** Remaining time of current session in seconds */
  readonly remainingTime$ = this.store.state$.pipe(select(selectMtkRemainingTime()));

  /** Recording state */
  readonly recording$ = this.store.state$.pipe(selectBoolean('var.mtk.rec.currentState'));

  /** Recording busy state */
  readonly busy$ = this.store.state$.pipe(selectBoolean('var.mtk.rec.busy'));

  /** Recording time in seconds */
  readonly recordingTime$ = this.store.state$.pipe(
    selectRawValue('var.mtk.rec.time', 0),
    withLatestFrom(this.recording$),
    map(([value, recording]) => (recording ? value : 0)), // set to 0 if not actually recording. otherwise, it emits strange values
  );

  /** Soundcheck activation state */
  readonly soundcheck$ = this.store.state$.pipe(selectBoolean('var.mtk.soundcheck'));

  constructor(
    private conn: MixerConnection,
    private store: MixerStore,
  ) {}

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
   * @param value soundcheck activation state
   */
  setSoundcheck(value: boolean) {
    this.conn.setdBool('var.mtk.soundcheck', value);
  }

  /** Activate soundcheck */
  activateSoundcheck() {
    this.setSoundcheck(true);
  }

  /** Deactivate soundcheck */
  deactivateSoundcheck() {
    this.setSoundcheck(false);
  }

  /** Toggle soundcheck */
  toggleSoundcheck() {
    this.soundcheck$.pipe(take(1)).subscribe(value => this.setSoundcheck(!value));
  }
}
