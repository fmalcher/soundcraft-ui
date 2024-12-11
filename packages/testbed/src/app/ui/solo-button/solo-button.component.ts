import { AsyncPipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { MasterChannel } from 'soundcraft-ui-connection';
import { MixerButtonComponent } from '../mixer-button/mixer-button.component';

@Component({
  selector: 'sui-solo-button',
  templateUrl: './solo-button.component.html',
  styleUrls: ['./solo-button.component.css'],
  imports: [MixerButtonComponent, AsyncPipe],
})
export class SoloButtonComponent {
  channel = input.required<MasterChannel>();
  label = input('');
}
