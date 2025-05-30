import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';

import { ConnectionService } from '../../connection.service';
import { AsyncPipe } from '@angular/common';
import { MuteButton } from '../../ui/mute-button/mute-button';
import { PrepostControls } from '../../ui/prepost-controls/prepost-controls';
import { FaderLevelControls } from '../../ui/fader-level-controls/fader-level-controls';
import { TransitionControls } from '../../ui/transition-controls/transition-controls';
import { InputField } from '../../ui/input-field/input-field';

@Component({
  selector: 'sui-fx-bus-page',
  templateUrl: './fx-bus-page.html',
  imports: [
    AsyncPipe,
    MuteButton,
    PrepostControls,
    FaderLevelControls,
    TransitionControls,
    InputField,
  ],
})
export class FxBusPage {
  cs = inject(ConnectionService);

  channels$ = inject(ActivatedRoute).paramMap.pipe(
    map(params => +params.get('bus')),
    map(bus => [
      { channel: this.cs.conn.fx(bus).input(2), label: 'Input 2' },
      { channel: this.cs.conn.fx(bus).line(1), label: 'Line 1' },
      { channel: this.cs.conn.fx(bus).player(1), label: 'Player 1' },
      { channel: this.cs.conn.fx(bus).sub(3), label: 'Sub group 3' },
    ])
  );
}
