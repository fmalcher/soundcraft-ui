import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { ConnectionService } from './connection.service';

@Component({
  selector: 'sui-root',
  templateUrl: './app.html',
  imports: [RouterOutlet, AsyncPipe, RouterLink, RouterLinkActive],
})
export class App {
  cs = inject(ConnectionService);

  navLinks = [
    { label: 'Master', target: '/master' },
    { label: 'Master bus', target: '/masterbus' },
    { label: 'AUX bus 1', target: '/auxbus/1' },
    { label: 'AUX bus 2', target: '/auxbus/2' },
    { label: 'FX bus 1', target: '/fxbus/1' },
    { label: 'FX Settings', target: '/fx' },
    { label: 'Player/Rec', target: '/player' },
    { label: 'Multitrack', target: '/multitrack' },
    { label: 'MUTE Groups', target: '/mutegroups' },
    { label: 'Volume Buses', target: '/volumebus' },
    { label: 'Shows', target: '/shows' },
    { label: 'HW Channels', target: '/hwchannels' },
    { label: 'Automix', target: '/automix' },
    { label: 'Channel Sync', target: '/channelsync' },
    { label: 'Full state', target: '/fullstate' },
    { label: 'VU', target: '/vu' },
  ];

  connectCustomIp(ip: string) {
    if (ip) {
      localStorage.setItem('mixerIP', ip);
      this.cs.createConnectionAndConnect(ip);
    }
  }

  getCustomIPFromStorage() {
    return localStorage.getItem('mixerIP');
  }
}
