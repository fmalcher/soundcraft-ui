import { Channel } from './channel';
import { MixerConnection } from './mixer-connection';
import { MixerStore } from './mixer-store';

export class SoundcraftUI {
  private conn: MixerConnection;
  readonly state: MixerStore;

  constructor(targetIP: string) {
    this.conn = new MixerConnection(targetIP);
    this.state = new MixerStore(this.conn.allMessages$);
  }

  input(input: number) {
    return new Channel(this.conn, this.state, 'i', input);
  }

  connect() {
    this.conn.connect();
  }

  disconnect() {
    this.conn.disconnect();
  }

  dim(value) {
    const cmd = `SETD^m.dim^${value}`;
    this.conn.sendMessage(cmd);
  }
}
