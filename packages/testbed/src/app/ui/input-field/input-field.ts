import { Component, input, model } from '@angular/core';
import { RandomIdDirective } from '../../random-id.directive';

@Component({
  selector: 'sui-input-field',
  templateUrl: './input-field.html',
  styleUrl: './input-field.css',
  imports: [RandomIdDirective],
})
export class InputField {
  readonly value = model('');
  readonly label = input('');
  readonly buttonLabel = input('');
}
