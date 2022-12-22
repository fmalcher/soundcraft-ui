import { Component, inject } from '@angular/core';
import { ConnectionService } from '../../connection.service';

@Component({
  selector: 'soundcraft-ui-connection',
  templateUrl: './connection.component.html',
  standalone: true,
})
export class ConnectionComponent {
  cs = inject(ConnectionService);

  setIP(ip: string) {
    this.cs.setMixerIP(ip);
    this.connect();
  }

  connect() {
    this.cs.conn.connect().then(() => {
      console.log('CONNECTED');
    });
  }

  disconnect() {
    this.cs.conn.disconnect().then(() => {
      console.log('DISCONNECTED');
    });
  }

  reconnect() {
    this.cs.conn.reconnect().then(() => {
      console.log('RECONNECTED');
    });
  }
}
