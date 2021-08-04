import { MixerConnection } from '../mixer-connection';

/**
 * Controller for Shows, Snapshots and Cues
 */
export class ShowController {
  constructor(private conn: MixerConnection) {}

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
}
