import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { AsyncPipe } from '@angular/common';

import { ConnectionService } from '../../connection.service';
import { MuteButtonComponent } from '../../ui/mute-button/mute-button.component';
import { PrepostComponent } from '../../ui/prepost/prepost.component';
import { MixerButtonComponent } from '../../ui/mixer-button/mixer-button.component';
import { FaderLevelComponent } from '../../ui/fader-level/fader-level.component';
import { PanComponent } from '../../ui/pan/pan.component';
import { TransitionComponent } from '../../ui/transition/transition.component';
import { InputComponent } from '../../ui/input/input.component';

@Component({
  selector: 'sui-aux-bus',
  templateUrl: './aux-bus.component.html',
  imports: [
    AsyncPipe,
    MuteButtonComponent,
    PrepostComponent,
    MixerButtonComponent,
    FaderLevelComponent,
    PanComponent,
    TransitionComponent,
    InputComponent,
  ],
})
export class AuxBusComponent {
  cs = inject(ConnectionService);

  channels$ = inject(ActivatedRoute).paramMap.pipe(
    map(params => +params.get('bus')),
    map(bus => [
      { channel: this.cs.conn.aux(bus).input(2), label: 'Input 2' },
      { channel: this.cs.conn.aux(bus).line(1), label: 'Line 1' },
      { channel: this.cs.conn.aux(bus).player(1), label: 'Player 1' },
      { channel: this.cs.conn.aux(bus).fx(2), label: 'FX 2' },
    ])
  );
}
