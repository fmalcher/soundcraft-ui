import { AsyncPipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { AuxChannel, MasterBus, MasterChannel } from 'soundcraft-ui-connection';

@Component({
  selector: 'sui-pan-controls',
  templateUrl: './pan-controls.html',
  styleUrl: './pan-controls.css',
  imports: [AsyncPipe],
})
export class PanControls {
  readonly channel = input.required<MasterChannel | AuxChannel | MasterBus>();

  setPan(value: string) {
    this.channel().setPan(Number(value));
  }
}
