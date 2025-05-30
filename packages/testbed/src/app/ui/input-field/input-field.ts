import { Component, input, model } from '@angular/core';

@Component({
  selector: 'sui-input-field',
  templateUrl: './input-field.html',
  styleUrl: './input-field.css',
  imports: [],
})
export class InputField {
  readonly value = model('');
  readonly label = input('');
  readonly buttonLabel = input('');
}
