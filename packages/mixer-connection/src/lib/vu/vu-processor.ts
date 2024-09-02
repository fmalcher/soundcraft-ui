import { filter, map, Observable, share } from 'rxjs';

import { MixerConnection } from '../mixer-connection';
import {
  AuxChannelVuData,
  FxVuData,
  InputChannelVuData,
  StereoMasterVuData,
  SubGroupVuData,
  VuData,
} from './vu.types';
import { parseVuMessageArray, vuMessageToArray } from './vu.utils';

export class VuProcessor {
  /** VU data for all master channels */
  vuData$: Observable<VuData> = this.conn.inbound$.pipe(
    filter(message => message.startsWith('VU2^')),
    map(message => message.slice(4)),
    map(message => parseVuMessageArray(vuMessageToArray(message))),
    share()
  );

  constructor(private conn: MixerConnection) {}

  /**
   * Get VU info for input channel on the master bus
   * @param channel Channel number
   */
  input(channel: number): Observable<InputChannelVuData> {
    return this.vuData$.pipe(map(data => data.input[channel - 1]));
  }

  /**
   * Get VU info for line channel on the master bus
   * @param channel Channel number
   */
  line(channel: number): Observable<InputChannelVuData> {
    return this.vuData$.pipe(map(data => data.line[channel - 1]));
  }

  /**
   * Get VU info for player channel on the master bus
   * @param channel Channel number
   */
  player(channel: number): Observable<InputChannelVuData> {
    return this.vuData$.pipe(map(data => data.player[channel - 1]));
  }

  /**
   * Get VU info for AUX output channel on the master bus
   * @param channel Channel number
   */
  aux(channel: number): Observable<AuxChannelVuData> {
    return this.vuData$.pipe(map(data => data.aux[channel - 1]));
  }

  /**
   * Get VU info for FX channel on the master bus
   * @param channel Channel number
   */
  fx(channel: number): Observable<FxVuData> {
    return this.vuData$.pipe(map(data => data.fx[channel - 1]));
  }

  /**
   * Get VU info for sub group channel on the master bus
   * @param channel Channel number
   */
  sub(channel: number): Observable<SubGroupVuData> {
    return this.vuData$.pipe(map(data => data.sub[channel - 1]));
  }

  /**
   * Get VU info for the stereo grand master
   */
  master(): Observable<StereoMasterVuData> {
    return this.vuData$.pipe(
      map(data => {
        if (data.master.length < 2) {
          throw new Error('Master VU data has less than 2 channels.');
        }
        return {
          vuPostL: data.master[0].vuPost,
          vuPostR: data.master[1].vuPost,
          vuPostFaderL: data.master[0].vuPostFader,
          vuPostFaderR: data.master[1].vuPostFader,
        };
      })
    );
  }
}
