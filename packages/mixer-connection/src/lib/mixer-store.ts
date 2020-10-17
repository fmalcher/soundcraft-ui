import { Observable } from 'rxjs';

import { MixerState } from './mixer-state.models';
import { BusType, ChannelType } from './types';
import {
  select,
  selectFaderValue,
  selectMasterDim,
  selectMasterPan,
  selectMasterValue,
  selectMute,
  selectPan,
  selectSolo,
} from './state-selectors';
import { reduceState } from './state-reducer';

export class MixerStore {
  state$: Observable<MixerState>;

  constructor(private rawMessages$: Observable<string>) {
    this.state$ = this.rawMessages$.pipe(reduceState);
  }

  getMute(
    channelType: ChannelType,
    channel: number,
    busType: BusType = 'master',
    bus = 0
  ) {
    return this.state$.pipe(
      select(selectMute(channelType, channel, busType, bus))
    );
  }

  getSolo(channelType: ChannelType, channel: number) {
    return this.state$.pipe(select(selectSolo(channelType, channel)));
  }

  getPan(
    channelType: ChannelType,
    channel: number,
    busType: BusType = 'master',
    bus = 0
  ) {
    return this.state$.pipe(
      select(selectPan(channelType, channel, busType, bus))
    );
  }

  getFaderValue(
    channelType: ChannelType,
    channel: number,
    busType: BusType = 'master',
    bus = 0
  ) {
    return this.state$.pipe(
      select(selectFaderValue(channelType, channel, busType, bus))
    );
  }

  getMasterValue() {
    return this.state$.pipe(select(selectMasterValue()));
  }

  getMasterPan() {
    return this.state$.pipe(select(selectMasterPan()));
  }

  getMasterDim() {
    return this.state$.pipe(select(selectMasterDim()));
  }
}
