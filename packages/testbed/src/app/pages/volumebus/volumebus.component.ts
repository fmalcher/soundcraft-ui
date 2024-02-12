import { Component, inject } from '@angular/core';
import { ConnectionService } from '../../connection.service';
import { FaderLevelComponent } from '../../ui/fader-level/fader-level.component';
import { TransitionComponent } from '../../ui/transition/transition.component';

@Component({
  selector: 'sui-volumebus',
  templateUrl: './volumebus.component.html',
  standalone: true,
  imports: [FaderLevelComponent, TransitionComponent],
})
export class VolumebusComponent {
  cs = inject(ConnectionService);

  channels = [
    { label: 'Solo Level', channel: this.cs.conn.volume.solo },
    { label: 'Headphone 1 Volume', channel: this.cs.conn.volume.headphone(1) },
    { label: 'Headphone 2 Volume', channel: this.cs.conn.volume.headphone(2) },
  ];
}
