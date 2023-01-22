import { AsyncPipe, NgFor } from '@angular/common';
import { Component, inject } from '@angular/core';
import { HwChannel } from 'soundcraft-ui-connection';
import { ConnectionService } from '../../connection.service';
import { MixerButtonComponent } from '../../ui/mixer-button/mixer-button.component';

@Component({
  selector: 'soundcraft-ui-hwchannels',
  templateUrl: './hwchannels.component.html',
  styleUrls: ['./hwchannels.component.css'],
  standalone: true,
  imports: [NgFor, AsyncPipe, MixerButtonComponent],
})
export class HwchannelsComponent {
  cs = inject(ConnectionService);

  channels = [this.cs.conn.hw(1), this.cs.conn.hw(2), this.cs.conn.hw(3)];

  setGain(channel: HwChannel, value: string) {
    channel.setGain(Number(value));
  }
}
