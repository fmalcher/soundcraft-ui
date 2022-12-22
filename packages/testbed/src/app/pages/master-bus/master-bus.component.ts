import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MasterChannel, DelayableMasterChannel } from 'soundcraft-ui-connection';

import { ConnectionService } from '../../connection.service';
import { DelayComponent } from '../../ui/delay/delay.component';
import { FaderLevelComponent } from '../../ui/fader-level/fader-level.component';
import { MuteButtonComponent } from '../../ui/mute-button/mute-button.component';
import { PanComponent } from '../../ui/pan/pan.component';
import { SoloButtonComponent } from '../../ui/solo-button/solo-button.component';
import { TransitionComponent } from '../../ui/transition/transition.component';

@Component({
  selector: 'soundcraft-ui-master-bus',
  templateUrl: './master-bus.component.html',
  standalone: true,
  imports: [
    NgFor,
    AsyncPipe,
    NgIf,
    FaderLevelComponent,
    SoloButtonComponent,
    MuteButtonComponent,
    TransitionComponent,
    DelayComponent,
    PanComponent,
  ],
})
export class MasterBusComponent {
  master = inject(ConnectionService).conn.master;

  channels = [
    { channel: this.master.input(2), label: 'Input 2' },
    { channel: this.master.line(1), label: 'Line 1' },
    { channel: this.master.player(1), label: 'Player 1' },
    { channel: this.master.fx(2), label: 'FX 2' },
    { channel: this.master.sub(3), label: 'Sub group 3' },
    { channel: this.master.aux(2), label: 'AUX 2', noPan: true, delayMax: 500 },
    { channel: this.master.vca(4), label: 'VCA 4', noPan: true },
  ];

  isDelayable(c: MasterChannel): c is DelayableMasterChannel {
    return c instanceof DelayableMasterChannel;
  }
}
