import { Component, computed, input } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'sui-vu-meter',
  standalone: true,
  imports: [NgClass],
  templateUrl: './vu-meter.component.html',
  styleUrl: './vu-meter.component.scss',
})
export class VuMeterComponent {
  mode = input<'pre' | 'post' | 'postFader'>('pre');
  value = input<number>();
  label = input('');

  barWidth = computed(() => (1 - this.value()) * 100 + '%');
  sanitizedLabel = computed(() => {
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
