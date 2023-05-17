import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';

import { ConnectionService } from '../../connection.service';
import { AsyncPipe, NgFor } from '@angular/common';
import { MuteButtonComponent } from '../../ui/mute-button/mute-button.component';
import { PrepostComponent } from '../../ui/prepost/prepost.component';
import { FaderLevelComponent } from '../../ui/fader-level/fader-level.component';
import { TransitionComponent } from '../../ui/transition/transition.component';

@Component({
  selector: 'sui-fx-bus',
  templateUrl: './fx-bus.component.html',
  standalone: true,
  imports: [
    NgFor,
    AsyncPipe,
    MuteButtonComponent,
    PrepostComponent,
    FaderLevelComponent,
    TransitionComponent,
  ],
})
export class FxBusComponent {
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
