import { AsyncPipe, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { AuxChannel, MasterBus, MasterChannel } from 'soundcraft-ui-connection';

@Component({
  selector: 'soundcraft-ui-pan',
  templateUrl: './pan.component.html',
  styleUrls: ['./pan.component.css'],
  standalone: true,
  imports: [NgIf, AsyncPipe],
})
export class PanComponent {
  @Input() channel?: MasterChannel | AuxChannel | MasterBus;

  pan(value: string) {
    this.channel && this.channel.pan(Number(value));
  }
}
