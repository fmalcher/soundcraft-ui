import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { ConnectionService } from './connection.service';

@Component({
  selector: 'soundcraft-ui-root',
  templateUrl: './app.component.html',
  standalone: true,
  imports: [RouterOutlet, AsyncPipe, NgIf, NgFor, RouterLink, RouterLinkActive],
})
export class AppComponent {
  cs = inject(ConnectionService);
  status$ = this.cs.conn.status$;

  navLinks = [
    { label: 'Connection', target: '/connection' },
    { label: 'Master', target: '/master' },
    { label: 'Master bus', target: '/masterbus' },
    { label: 'AUX bus 1', target: '/auxbus/1' },
    { label: 'AUX bus 2', target: '/auxbus/2' },
    { label: 'FX bus 1', target: '/fxbus/1' },
    { label: 'Player/Rec', target: '/player' },
    { label: 'Multitrack', target: '/multitrack' },
    { label: 'MUTE Groups', target: '/mutegroups' },
    { label: 'Volume Buses', target: '/volumebus' },
    { label: 'Shows', target: '/shows' },
    { label: 'HW Channels', target: '/hwchannels' },
    { label: 'Full state', target: '/fullstate' },
  ];

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
}
