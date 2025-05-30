import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'sui-vu-meter',
  imports: [],
  templateUrl: './vu-meter.html',
  styleUrl: './vu-meter.scss',
})
export class VuMeter {
  readonly mode = input<'pre' | 'post' | 'postFader'>('pre');
  readonly value = input<number>();
  readonly label = input('');

  readonly barWidth = computed(() => (1 - this.value()) * 100 + '%');
  readonly sanitizedLabel = computed(() => {
    if (this.label()) {
      return this.label();
    } else {
      switch (this.mode()) {
        case 'pre':
          return 'PRE';
        case 'post':
          return 'POST';
        case 'postFader':
          return 'POST FADER';
      }
    }
  });
}
