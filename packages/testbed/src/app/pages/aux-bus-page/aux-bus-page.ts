import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { AsyncPipe } from '@angular/common';

import { ConnectionService } from '../../connection.service';
import { MuteButton } from '../../ui/mute-button/mute-button';
import { PrepostControls } from '../../ui/prepost-controls/prepost-controls';
import { PostprocControls } from '../../ui/postproc-controls/postproc-controls';
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
    PostprocControls,
    FaderLevelControls,
    PanControls,
    TransitionControls,
    InputField,
  ],
})
export class AuxBusPage {
  cs = inject(ConnectionService);
  conn = this.cs.connection;

  channels$ = inject(ActivatedRoute).paramMap.pipe(
    map(params => Number(params.get('bus'))),
    map(bus => [
      { channel: this.conn.aux(bus).input(2), label: 'Input 2' },
      { channel: this.conn.aux(bus).line(1), label: 'Line 1' },
      { channel: this.conn.aux(bus).player(1), label: 'Player 1' },
      { channel: this.conn.aux(bus).fx(2), label: 'FX 2' },
    ]),
  );
}
