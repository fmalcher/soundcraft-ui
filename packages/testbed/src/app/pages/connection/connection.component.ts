import { Component } from '@angular/core';
import { ConnectionService } from '../../connection.service';

@Component({
  selector: 'soundcraft-ui-connection',
  templateUrl: './connection.component.html',
  styleUrls: ['./connection.component.css'],
})
export class ConnectionComponent {
  constructor(public cs: ConnectionService) {}

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
