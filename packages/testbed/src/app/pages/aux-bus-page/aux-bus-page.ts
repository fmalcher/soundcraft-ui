import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { AsyncPipe } from '@angular/common';

import { ConnectionService } from '../../connection.service';
import { MuteButton } from '../../ui/mute-button/mute-button';
import { PrepostControls } from '../../ui/prepost-controls/prepost-controls';
import { MixerButton } from '../../ui/mixer-button/mixer-button';
import { FaderLevelControls } from '../../ui/fader-level-controls/fader-level-controls';
import { PanControls } from '../../ui/pan-controls/pan-controls';
import { TransitionControls } from '../../ui/transition-controls/transition-controls';
import { InputField } from '../../ui/input-field/input-field';

@Component({
  selector: 'sui-aux-bus-page',
  templateUrl: './aux-bus-page.html',
  imports: [
    AsyncPipe,
    MuteButton,
    PrepostControls,
    MixerButton,
    FaderLevelControls,
    PanControls,
    TransitionControls,
    InputField,
  ],
})
export class AuxBusPage {
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
