import { Injectable } from '@angular/core';
import { SoundcraftUI } from 'soundcraft-ui-connection';

@Injectable({
  providedIn: 'root',
})
export class ConnectionService {
  conn?: SoundcraftUI;

  /**
   * Active connection. The app shell only renders pages while connected, so
   * page components can rely on this being defined.
   */
  get connection(): SoundcraftUI {
    if (!this.conn) {
      throw new Error('No active mixer connection');
    }
    return this.conn;
  }

  async createConnectionAndConnect(ip: string) {
    if (this.conn) {
      await this.conn.disconnect();
    }

    // this.conn = new SoundcraftUI({ targetIP: ip, webSocketCtor: WebSocket });
    this.conn = new SoundcraftUI(ip);
    return this.conn.connect();
  }

  disconnect() {
    this.conn?.disconnect();
    this.conn = undefined;
  }
}
