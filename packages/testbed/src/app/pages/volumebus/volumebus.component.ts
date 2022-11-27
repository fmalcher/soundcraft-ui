import { Component } from '@angular/core';
import { ConnectionService } from '../../connection.service';

@Component({
  selector: 'soundcraft-ui-volumebus',
  templateUrl: './volumebus.component.html',
  styleUrls: ['./volumebus.component.scss'],
})
export class VolumebusComponent {
  channels = [
    { label: 'Solo Level', channel: this.cs.conn.volume.solo },
    { label: 'Headphone 1 Volume', channel: this.cs.conn.volume.headphone(1) },
    { label: 'Headphone 2 Volume', channel: this.cs.conn.volume.headphone(2) },
  ];

  constructor(private cs: ConnectionService) {}
}
