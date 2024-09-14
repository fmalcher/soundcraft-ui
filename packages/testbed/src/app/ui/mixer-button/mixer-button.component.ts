import { NgClass } from '@angular/common';
import { Component, input, output } from '@angular/core';

@Component({
  selector: 'sui-mixer-button',
  templateUrl: './mixer-button.component.html',
  styleUrls: ['./mixer-button.component.scss'],
  standalone: true,
  imports: [NgClass],
})
export class MixerButtonComponent {
  activeClass = input('default-active');
  active = input(false);
  press = output();

  get ngClassDefinition() {
    if (!this.activeClass) {
      return;
    }
    return {
      [this.activeClass()]: !!this.active(),
    };
  }
}
