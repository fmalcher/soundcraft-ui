import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { MtxChannel, MtxMasterChannel } from 'soundcraft-ui-connection';

import { ConnectionService } from '../../connection.service';
import { DelayControls } from '../../ui/delay-controls/delay-controls';
import { FaderLevelControls } from '../../ui/fader-level-controls/fader-level-controls';
import { InputField } from '../../ui/input-field/input-field';
import { MixerButton } from '../../ui/mixer-button/mixer-button';
import { MuteButton } from '../../ui/mute-button/mute-button';
import { PanControls } from '../../ui/pan-controls/pan-controls';
import { PostprocControls } from '../../ui/postproc-controls/postproc-controls';
import { SoloButton } from '../../ui/solo-button/solo-button';
import { TransitionControls } from '../../ui/transition-controls/transition-controls';

@Component({
  selector: 'sui-mtx-bus-page',
  templateUrl: './mtx-bus-page.html',
  imports: [
    AsyncPipe,
    MixerButton,
    MuteButton,
    SoloButton,
    PanControls,
    PostprocControls,
    FaderLevelControls,
    TransitionControls,
    DelayControls,
    InputField,
  ],
})
export class MtxBusPage {
  cs = inject(ConnectionService);
  conn = this.cs.connection;

  vm$ = inject(ActivatedRoute).paramMap.pipe(
    map(params => Number(params.get('bus'))),
    map(bus => ({
      bus,
      aux: this.conn.aux(bus),
      mtx: this.conn.mtx(bus),
      // matrix output lives in the AUX slot it replaced
      output: this.conn.master.mtx(bus),
      sources: [
        { channel: this.conn.mtx(bus).aux(1), label: 'AUX 1' },
        { channel: this.conn.mtx(bus).sub(1), label: 'Sub 1' },
        { channel: this.conn.mtx(bus).master(), label: 'Master' },
      ] as { channel: MtxChannel | MtxMasterChannel; label: string }[],
    })),
  );
}
