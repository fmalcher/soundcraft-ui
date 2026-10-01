import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ConnectionService } from '../../connection.service';
import { EqControls } from '../../ui/eq-controls/eq-controls';

@Component({
  selector: 'sui-eq-page',
  templateUrl: './eq-page.html',
  imports: [AsyncPipe, EqControls],
})
export class EqPage {
  master = inject(ConnectionService).connection.master;

  channels = [
    { channel: this.master.input(1), label: 'Input 1', lpf: true },
    { channel: this.master.input(2), label: 'Input 2', lpf: true },
    { channel: this.master.line(1), label: 'Line 1' },
    { channel: this.master.player(1), label: 'Player 1' },
    { channel: this.master.fx(1), label: 'FX 1' },
    { channel: this.master.sub(1), label: 'Sub group 1' },
  ];
}
