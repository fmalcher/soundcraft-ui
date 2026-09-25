import { AsyncPipe } from '@angular/common';
import { Component, input } from '@angular/core';
import {
  ChannelEq,
  EQ_FILTERS,
  EqBand,
  EqFilter,
  EqFilterSlope,
  faderValueToFrequency,
  faderValueToQ,
  frequencyToFaderValue,
  qToFaderValue,
} from 'soundcraft-ui-connection';
import { RandomIdDirective } from '../../random-id.directive';
import { MixerButton } from '../mixer-button/mixer-button';

@Component({
  selector: 'sui-eq-controls',
  templateUrl: './eq-controls.html',
  imports: [AsyncPipe, MixerButton, RandomIdDirective],
})
export class EqControls {
  readonly eq = input.required<ChannelEq>();
  readonly showLpf = input(false);

  readonly bands = [1, 2, 3, 4];
  readonly slopes: EqFilterSlope[] = [12, 24, 36];

  // frequency and Q sliders work on the linear 0..1 value (log scale)
  readonly frequencyToFaderValue = frequencyToFaderValue;
  readonly qToFaderValue = qToFaderValue;
  readonly hpfMax = frequencyToFaderValue(EQ_FILTERS.hpf.maxHz);
  readonly lpfMin = frequencyToFaderValue(EQ_FILTERS.lpf.minHz);

  setBandFrequency(band: EqBand, value: string) {
    band.setFrequency(faderValueToFrequency(Number(value)));
  }

  setBandQ(band: EqBand, value: string) {
    band.setQ(faderValueToQ(Number(value)));
  }

  setBandGain(band: EqBand, value: string) {
    band.setGain(Number(value));
  }

  setFilterFrequency(filter: EqFilter, value: string) {
    filter.setFrequency(faderValueToFrequency(Number(value)));
  }
}
