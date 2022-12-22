import { AsyncPipe, NgFor } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ConnectionService } from '../../connection.service';
import { MixerButtonComponent } from '../../ui/mixer-button/mixer-button.component';

@Component({
  selector: 'soundcraft-ui-hwchannels',
  templateUrl: './hwchannels.component.html',
  standalone: true,
  imports: [NgFor, AsyncPipe, MixerButtonComponent],
})
export class HwchannelsComponent {
  cs = inject(ConnectionService);
}
