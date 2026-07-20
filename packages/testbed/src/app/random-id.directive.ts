import { Directive } from '@angular/core';

@Directive({
  selector: '[suiRandomId]',
  host: { '[id]': 'id' },
  exportAs: 'randomId',
})
export class RandomIdDirective {
  readonly id = Math.random().toString(36).slice(2, 12);
}
