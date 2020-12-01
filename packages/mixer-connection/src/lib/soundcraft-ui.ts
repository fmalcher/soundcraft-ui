import { delay, filter, take } from 'rxjs/operators';
import { AuxBus } from './facade/aux-bus';
import { FxBus } from './facade/fx-bus';
import { MasterBus } from './facade/master-bus';
import { MuteGroup, MuteGroupID } from './facade/mute-group';
import { Player } from './facade/player';
import { MixerConnection } from './mixer-connection';
import { MixerStore } from './state/mixer-store';
import { ConnectionStatus } from './types';

export class SoundcraftUI {
  readonly conn = new MixerConnection(this.targetIP);
  readonly store = new MixerStore(this.conn);

  /** Connection status */
  status$ = this.conn.status$;

  /** Get master bus */
  master = new MasterBus(this.conn, this.store);

  /** Get media player */
  player = new Player(this.conn, this.store);

  constructor(private targetIP: string) {}

  /**
   * Get AUX bus
   * @param bus Bus number
   */
  aux(bus: number) {
    return new AuxBus(this.conn, this.store, bus);
  }

  /**
   * Get FX bus
   * @param bus Bus number
   */
  fx(bus: number) {
    return new FxBus(this.conn, this.store, bus);
  }

  /**
   * Get MUTE group or related groupings (MUTE ALL and MUTE FX)
   * @param id ID of the group: 1..6, all, fx
   */
  muteGroup(id: MuteGroupID) {
    return new MuteGroup(this.conn, this.store, id);
  }

  /** Unmute all mute groups, "MUTE ALL" and "MUTE FX" */
  clearMuteGroups() {
    this.conn.sendMessage('SETD^mgmask^0');
  }

  /** Connect to the mixer */
  connect() {
    this.conn.connect();
  }

  /** Disconnect from the mixer */
  disconnect() {
    this.conn.disconnect();
  }

  /**
   * Reconnect to the mixer:
   * disconnect, then wait 1 second before connecting again
   */
  reconnect() {
    this.conn.status$
      .pipe(
        filter(e => e.type === ConnectionStatus.Close),
        take(1),
        delay(1000)
      )
      .subscribe(() => this.conn.connect());

    this.conn.disconnect();
  }
}
