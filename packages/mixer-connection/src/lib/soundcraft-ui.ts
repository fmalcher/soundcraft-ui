import { MixerConnection } from './mixer-connection';

export class SoundcraftUI {
  private conn: MixerConnection;

  constructor(targetIP: string) {
    this.conn = new MixerConnection(targetIP);
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
