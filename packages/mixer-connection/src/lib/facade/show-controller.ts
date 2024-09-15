import { combineLatest, filter, take } from 'rxjs';
import { MixerConnection } from '../mixer-connection';
import { MixerStore } from '../state/mixer-store';
import { selectRawValue } from '../state/state-selectors';

/**
 * Controller for Shows, Snapshots and Cues
 */
export class ShowController {
  /** Currently loaded show */
  currentShow$ = this.store.state$.pipe(selectRawValue<string>('var.currentShow'));

  /** Currently loaded snapshot */
  currentSnapshot$ = this.store.state$.pipe(selectRawValue<string>('var.currentSnapshot'));

  /** Currently loaded cue */
  currentCue$ = this.store.state$.pipe(selectRawValue<string>('var.currentCue'));

  constructor(private conn: MixerConnection, private store: MixerStore) {}

  /**
   * Load a show by name
   * @param show Show name
   */
  loadShow(show: string) {
    this.conn.sendMessage(`LOADSHOW^${show}`);
  }

  /**
   * Load a snapshot in a show
   * @param show Show name
   * @param snapshot Snapshot name in the show
   */
  loadSnapshot(show: string, snapshot: string) {
    this.conn.sendMessage(`LOADSNAPSHOT^${show}^${snapshot}`);
  }

  /**
   * Load a cue in a show
   * @param show Show name
   * @param cue Cue name in the show
   */
  loadCue(show: string, cue: string) {
    this.conn.sendMessage(`LOADCUE^${show}^${cue}`);
  }

  /**
   * Save a snapshot in a show. This will overwrite an existing snapshot.
   * @param show Show name
   * @param snapshot Snapshot name in the show
   */
  saveSnapshot(show: string, snapshot: string) {
    this.conn.sendMessage(`SAVESNAPSHOT^${show}^${snapshot}`);
  }

  /**
   * Save a cue in a show. This will overwrite an existing cue.
   * @param show Show name
   * @param cue Cue name in the show
   */
  saveCue(show: string, cue: string) {
    this.conn.sendMessage(`SAVECUE^${show}^${cue}`);
  }

  /** Update and overwrite the currently loaded snapshot */
  updateCurrentSnapshot() {
    combineLatest([this.currentShow$, this.currentSnapshot$])
      .pipe(
        take(1),
        filter(([show, snapshot]) => !!show && !!snapshot)
      )
      .subscribe(([show, snapshot]) => this.saveSnapshot(show, snapshot));
  }

  /** Update and overwrite the currently loaded cue */
  updateCurrentCue() {
    combineLatest([this.currentShow$, this.currentCue$])
      .pipe(
        take(1),
        filter(([show, cue]) => !!show && !!cue)
      )
      .subscribe(([show, cue]) => this.saveCue(show, cue));
  }
}
