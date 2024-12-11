import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ConnectionService } from '../../connection.service';
import { MixerButtonComponent } from '../../ui/mixer-button/mixer-button.component';
import { MasterChannel } from 'soundcraft-ui-connection';

@Component({
  selector: 'sui-automix',
  templateUrl: './automix.component.html',
  styleUrls: ['./automix.component.css'],
  imports: [AsyncPipe, MixerButtonComponent],
})
export class AutomixComponent {
  cs = inject(ConnectionService);

  automix = this.cs.conn.automix;
  groups = [
    { label: 'Automix Group A', group: this.automix.groups.a },
    { label: 'Automix Group B', group: this.automix.groups.b },
  ];

  channels = [
    { channel: this.cs.conn.master.input(1), label: 'Input 1' },
    { channel: this.cs.conn.master.input(2), label: 'Input 2' },
    { channel: this.cs.conn.master.input(3), label: 'Input 3' },
    { channel: this.cs.conn.master.input(4), label: 'Input 4' },
  ];

  setWeight(channel: MasterChannel, value: string) {
    channel.automixSetWeight(Number(value));
  }

  setTime(value: string) {
    this.automix.setResponseTime(Number(value));
  }
}
