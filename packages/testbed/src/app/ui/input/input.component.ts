import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'soundcraft-ui-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css'],
  standalone: true,
  imports: [],
})
export class InputComponent {
  @Input() value = '';
  @Input() label = '';
  @Input() buttonLabel = '';
  @Output() valueChange = new EventEmitter<string>();
}
