import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { HwChannel } from 'soundcraft-ui-connection';
import { ConnectionService } from '../../connection.service';
import { MixerButton } from '../../ui/mixer-button/mixer-button';

@Component({
  selector: 'sui-hwchannels-page',
  templateUrl: './hwchannels-page.html',
  styleUrl: './hwchannels-page.css',
  imports: [AsyncPipe, MixerButton],
})
export class HwchannelsPage {
  cs = inject(ConnectionService);

  channels = [this.cs.conn.hw(1), this.cs.conn.hw(2), this.cs.conn.hw(3)];

  setGain(channel: HwChannel, value: string) {
    channel.setGain(Number(value));
  }
}
