import { MixerStore } from '../state/mixer-store';
import { selectRawValue } from '../state/state-selectors';
import { MixerModel } from '../types';

export class DeviceInfo {
  /**
   * Hardware model of the mixer.
   * Possible values: `ui12`, `ui16`, `ui24`
   */
  model$ = this.store.state$.pipe(selectRawValue<MixerModel>('model'));

  /** Firmware version of ther mixer */
  firmware$ = this.store.state$.pipe(selectRawValue<string>('firmware'));

  /**
   * Hardware model of the mixer.
   * Possible values: `ui12`, `ui16`, `ui24`
   */
  model?: MixerModel;

  constructor(private store: MixerStore) {
    this.model$.subscribe(model => (this.model = model));
  }
}
