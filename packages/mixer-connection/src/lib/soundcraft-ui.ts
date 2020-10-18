import { Aux } from './facade/aux';
import { Channel } from './facade/channel';
import { Fx } from './facade/fx';
import { Master } from './facade/master';
import { MasterChannel } from './facade/master-channel';
import { Player } from './facade/player';
import { MixerConnection } from './mixer-connection';
import { MixerStore } from './state/mixer-store';

export class SoundcraftUI {
  private conn = new MixerConnection(this.targetIP);
  readonly store = new MixerStore(this.conn.allMessages$);

  master = new Master(this.conn, this.store);
  player = new Player(this.conn, this.store);

  constructor(private targetIP: string) {}

  aux(bus: number) {
    return new Aux(this.conn, this.store, bus);
  }

  fx(bus: number) {
    return new Fx(this.conn, this.store, bus);
  }

  connect() {
    this.conn.connect();
  }

  disconnect() {
    this.conn.disconnect();
  }
}
