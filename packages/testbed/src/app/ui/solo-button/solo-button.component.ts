import { AsyncPipe, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MasterChannel } from 'soundcraft-ui-connection';
import { MixerButtonComponent } from '../mixer-button/mixer-button.component';

@Component({
  selector: 'soundcraft-ui-solo-button',
  templateUrl: './solo-button.component.html',
  styleUrls: ['./solo-button.component.css'],
  standalone: true,
  imports: [MixerButtonComponent, AsyncPipe, NgIf],
})
export class SoloButtonComponent {
  @Input() channel?: MasterChannel;
  @Input() label = '';
}
