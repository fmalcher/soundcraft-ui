import { Component, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'soundcraft-ui-mixer-button',
  templateUrl: './mixer-button.component.html',
  styleUrls: ['./mixer-button.component.scss'],
})
export class MixerButtonComponent {
  @Input() activeClass = 'default-active';
  @Input() active: boolean = false;
  @Output() press = new EventEmitter<void>();

  get ngClassDefinition() {
    if (!this.activeClass) {
      return;
    }
    return {
      [this.activeClass]: !!this.active,
    };
  }
}
