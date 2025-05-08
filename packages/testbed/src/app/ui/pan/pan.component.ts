import { AsyncPipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { AuxChannel, MasterBus, MasterChannel } from 'soundcraft-ui-connection';

@Component({
  selector: 'sui-pan',
  templateUrl: './pan.component.html',
  styleUrls: ['./pan.component.css'],
  imports: [AsyncPipe],
})
export class PanComponent {
  channel = input.required<MasterChannel | AuxChannel | MasterBus>();

  setPan(value: string) {
    this.channel().setPan(Number(value));
  }
}
