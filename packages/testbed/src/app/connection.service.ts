import { Injectable } from '@angular/core';
import { SoundcraftUI } from 'soundcraft-ui-connection';

@Injectable({
  providedIn: 'root',
})
export class ConnectionService {
  conn?: SoundcraftUI;

  async createConnectionAndConnect(ip: string) {
    if (this.conn) {
      await this.conn.disconnect();
    }

    this.conn = new SoundcraftUI(ip);
    return this.conn.connect();
  }

  disconnect() {
    this.conn.disconnect();
    this.conn = undefined;
  }
}
