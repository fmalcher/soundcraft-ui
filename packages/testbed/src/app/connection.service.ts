import { Injectable } from '@angular/core';
import { SoundcraftUI } from 'soundcraft-ui-connection';

@Injectable({
  providedIn: 'root',
})
export class ConnectionService {
  mixerIP = '10.75.23.95';
  conn = new SoundcraftUI(this.mixerIP);

  setMixerIP(ip: string) {
    if (ip !== this.mixerIP) {
      this.mixerIP = ip;
      if (this.conn) {
        this.conn.disconnect();
      }
      this.conn = new SoundcraftUI(this.mixerIP);
    }
  }
}
