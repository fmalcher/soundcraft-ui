import { Component, computed, input, output } from '@angular/core';

@Component({
  selector: 'sui-mixer-button',
  templateUrl: './mixer-button.component.html',
  styleUrls: ['./mixer-button.component.scss'],
  imports: [],
})
export class MixerButtonComponent {
  activeClass = input('default-active');
  active = input(false);
  press = output();

  classDefinition = computed(() => {
    if (!this.activeClass()) {
      return;
    }
    return {
      [this.activeClass()]: !!this.active(),
    };
  });
}
