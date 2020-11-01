import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'soundcraft-ui-mixer-button',
  templateUrl: './mixer-button.component.html',
  styleUrls: ['./mixer-button.component.scss'],
})
export class MixerButtonComponent implements OnInit {
  @Input() activeClass: string;
  @Input() active: boolean;
  @Output() press = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}

  get ngClassDefinition() {
    if (!this.activeClass) {
      return;
    }
    return {
      [this.activeClass]: !!this.active,
    };
  }
}
