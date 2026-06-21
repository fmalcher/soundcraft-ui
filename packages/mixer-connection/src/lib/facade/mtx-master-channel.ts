import { map, of } from 'rxjs';

import { MixerConnection } from '../mixer-connection';
import { MixerStore } from '../state/mixer-store';
import { select, selectStereoIndex } from '../state/state-selectors';
import { getLinkedChannelNumber } from '../utils';
import { MtxChannel } from './mtx-channel';

/**
 * Represents the master mix routed to a matrix bus.
 * This is a special matrix source because the master has no channel index:
 * the state path is `m.mtx.<bus>` instead of `<type>.<channel>.mtx.<bus>`.
 * Matrix buses are only available on the Ui24R.
 */
export class MtxMasterChannel extends MtxChannel {
  name$ = of('MASTER');

  constructor(conn: MixerConnection, store: MixerStore, bus: number) {
    super(conn, store, `m.mtx.${bus - 1}`);

    // the master source is not stereo-linkable itself, but it is mirrored
    // across the stereo-linked matrix output (matrix outputs live in `a` slots).
    // pan and the other sends use the same single mirror.
    store.state$
      .pipe(
        select(selectStereoIndex('a', bus)),
        map(mtxIndex => {
          const linkedMtxNo = getLinkedChannelNumber(bus, mtxIndex);
          return linkedMtxNo !== undefined ? [`m.mtx.${linkedMtxNo - 1}`] : [];
        }),
      )
      .subscribe(mirror => {
        this.linkedChannelIds = mirror;
        this.panLinkChannelIds = mirror;
      });
  }
}
