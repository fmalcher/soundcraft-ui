import { combineLatest, filter, map, take } from 'rxjs';
import { MixerConnection } from '../mixer-connection';
import { MixerStore } from '../state/mixer-store';
import { CUES_KEY, requestResourceList, SHOWS_KEY, SNAPSHOTS_KEY } from '../state/resource-lists';
import { selectRawValue } from '../state/state-selectors';
import { ConnectionStatus, ShowsWithDetails } from '../types';

/**
 * Controller for Shows, Snapshots and Cues
 */
export class ShowController {
  /** Currently loaded show */
  readonly currentShow$ = this.store.state$.pipe(selectRawValue<string>('var.currentShow'));

  /** Currently loaded snapshot */
  readonly currentSnapshot$ = this.store.state$.pipe(selectRawValue<string>('var.currentSnapshot'));

  /** Currently loaded cue */
  readonly currentCue$ = this.store.state$.pipe(selectRawValue<string>('var.currentCue'));

  /**
   * All available shows with their snapshots and cues (show name -> { snapshots, cues }).
   * Snapshots and cues are not hierarchical; both hang off a show in parallel.
   * Fetched on connect; refresh manually with {@link refreshShows}.
   */
  readonly shows$ = this.store.resourceListState$.pipe(
    map((state): ShowsWithDetails => {
      const names = state[SHOWS_KEY] ?? [];
      return Object.fromEntries(
        names.map(name => [
          name,
          {
            snapshots: state[`${SNAPSHOTS_KEY}^${name}`] ?? [],
            cues: state[`${CUES_KEY}^${name}`] ?? [],
          },
        ]),
      );
    }),
  );

  constructor(
    private conn: MixerConnection,
    private store: MixerStore,
  ) {
    // shows/snapshots/cues are sent per-client on request, so (re-)fetch them on every open
    this.conn.status$
      .pipe(filter(e => e.type === ConnectionStatus.Open))
      .subscribe(() => this.refreshShows());
  }

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
        filter(([show, snapshot]) => !!show && !!snapshot),
      )
      .subscribe(([show, snapshot]) => this.saveSnapshot(show, snapshot));
  }

  /** Update and overwrite the currently loaded cue */
  updateCurrentCue() {
    combineLatest([this.currentShow$, this.currentCue$])
      .pipe(
        take(1),
        filter(([show, cue]) => !!show && !!cue),
      )
      .subscribe(([show, cue]) => this.saveCue(show, cue));
  }

  /**
   * Request the list of shows and, for each show, its snapshots and cues from the mixer.
   * Results are exposed through {@link shows$}.
   * This is called automatically on every connection open.
   */
  refreshShows() {
    requestResourceList(this.conn, 'SHOWLIST', 'SHOWLIST').subscribe(shows =>
      shows.forEach(show => {
        this.conn.sendMessage(`SNAPSHOTLIST^${show}`);
        this.conn.sendMessage(`CUELIST^${show}`);
      }),
    );
  }
}
