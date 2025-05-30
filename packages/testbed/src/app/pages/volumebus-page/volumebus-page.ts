import { Component, inject } from '@angular/core';
import { ConnectionService } from '../../connection.service';
import { FaderLevelControls } from '../../ui/fader-level-controls/fader-level-controls';
import { TransitionControls } from '../../ui/transition-controls/transition-controls';

@Component({
  selector: 'sui-volumebus-page',
  templateUrl: './volumebus-page.html',
  imports: [FaderLevelControls, TransitionControls],
})
export class VolumebusPage {
  cs = inject(ConnectionService);

  channels = [
    { label: 'Solo Level', channel: this.cs.conn.volume.solo },
    { label: 'Headphone 1 Volume', channel: this.cs.conn.volume.headphone(1) },
    { label: 'Headphone 2 Volume', channel: this.cs.conn.volume.headphone(2) },
  ];
}
