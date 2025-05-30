import { Component, computed, input, output } from '@angular/core';

@Component({
  selector: 'sui-mixer-button',
  templateUrl: './mixer-button.html',
  styleUrl: './mixer-button.scss',
  imports: [],
})
export class MixerButton {
  readonly activeClass = input('default-active');
  readonly active = input(false);
  readonly press = output();

  readonly classDefinition = computed(() => {
    if (!this.activeClass()) {
      return;
    }
    return {
      [this.activeClass()]: !!this.active(),
    };
  });
}
