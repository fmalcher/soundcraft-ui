import { Component } from '@angular/core';
import { ConnectionService } from './connection.service';

@Component({
  selector: 'soundcraft-ui-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  navLinks = [
    { label: 'Connection', target: '/connection' },
    { label: 'Master bus', target: '/masterchannels' },
    { label: 'AUX bus 1', target: '/auxbus/1' },
    { label: 'AUX bus 2', target: '/auxbus/2' },
    { label: 'FX bus 1', target: '/fxbus/1' },
    { label: 'Full state', target: '/fullstate' },
  ];

  status$ = this.cs.conn.status$;

  constructor(public cs: ConnectionService) {}
}
