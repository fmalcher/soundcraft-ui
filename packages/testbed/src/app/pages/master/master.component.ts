import { AsyncPipe, NgFor } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ConnectionService } from '../../connection.service';
import { FaderLevelComponent } from '../../ui/fader-level/fader-level.component';
import { MixerButtonComponent } from '../../ui/mixer-button/mixer-button.component';
import { PanComponent } from '../../ui/pan/pan.component';
import { TransitionComponent } from '../../ui/transition/transition.component';

@Component({
  selector: 'soundcraft-ui-master',
  templateUrl: './master.component.html',
  standalone: true,
  imports: [
    AsyncPipe,
    NgFor,
    MixerButtonComponent,
    FaderLevelComponent,
    PanComponent,
    TransitionComponent,
  ],
})
export class MasterComponent {
  master = inject(ConnectionService).conn.master;

  delays = [
    {
      side: 'L',
      data$: this.master.delayL$,
      setDelay: (v: number) => this.master.setDelayL(v),
      changeDelay: (v: number) => this.master.changeDelayL(v),
    },
    {
      side: 'R',
      data$: this.master.delayR$,
      setDelay: (v: number) => this.master.setDelayR(v),
      changeDelay: (v: number) => this.master.changeDelayR(v),
    },
  ];
}
