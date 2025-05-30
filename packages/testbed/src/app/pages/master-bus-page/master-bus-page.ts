import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MasterChannel, DelayableMasterChannel } from 'soundcraft-ui-connection';

import { ConnectionService } from '../../connection.service';
import { DelayControls } from '../../ui/delay-controls/delay-controls';
import { FaderLevelControls } from '../../ui/fader-level-controls/fader-level-controls';
import { MuteButton } from '../../ui/mute-button/mute-button';
import { PanControls } from '../../ui/pan-controls/pan-controls';
import { SoloButton } from '../../ui/solo-button/solo-button';
import { TransitionControls } from '../../ui/transition-controls/transition-controls';
import { InputField } from '../../ui/input-field/input-field';

@Component({
  selector: 'sui-master-bus-page',
  templateUrl: './master-bus-page.html',
  imports: [
    AsyncPipe,
    FaderLevelControls,
    SoloButton,
    MuteButton,
    TransitionControls,
    DelayControls,
    PanControls,
    InputField,
  ],
})
export class MasterBusPage {
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
