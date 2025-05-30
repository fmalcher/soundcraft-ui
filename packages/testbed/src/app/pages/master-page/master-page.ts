import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ConnectionService } from '../../connection.service';
import { FaderLevelControls } from '../../ui/fader-level-controls/fader-level-controls';
import { MixerButton } from '../../ui/mixer-button/mixer-button';
import { PanControls } from '../../ui/pan-controls/pan-controls';
import { TransitionControls } from '../../ui/transition-controls/transition-controls';

@Component({
  selector: 'sui-master-page',
  templateUrl: './master-page.html',
  imports: [AsyncPipe, MixerButton, FaderLevelControls, PanControls, TransitionControls],
})
export class MasterPage {
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
