import { delay, filter, take } from 'rxjs/operators';
import { AuxBus } from './facade/aux-bus';
import { FxBus } from './facade/fx-bus';
import { MasterBus } from './facade/master-bus';
import { Player } from './facade/player';
import { MixerConnection } from './mixer-connection';
import { MixerStore } from './state/mixer-store';
import { ConnectionStatus } from './types';

export class SoundcraftUI {
  private conn = new MixerConnection(this.targetIP);
  readonly store = new MixerStore(this.conn.allMessages$);

  status$ = this.conn.status$;

  master = new MasterBus(this.conn, this.store);
  player = new Player(this.conn, this.store);

  constructor(private targetIP: string) {}

  aux(bus: number) {
    return new AuxBus(this.conn, this.store, bus);
  }

  fx(bus: number) {
    return new FxBus(this.conn, this.store, bus);
  }

  connect() {
    this.conn.connect();
  }

  disconnect() {
    this.conn.disconnect();
  }

  reconnect() {
    // wait for disconnect, then wait 1 second before connecting again
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
