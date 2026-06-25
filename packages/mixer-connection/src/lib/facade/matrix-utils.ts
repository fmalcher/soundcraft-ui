import { take } from 'rxjs';

import { MixerConnection } from '../mixer-connection';
import { MixerStore } from '../state/mixer-store';
import { select, selectStereoIndex } from '../state/state-selectors';
import { getLinkedChannelNumber } from '../utils';

/**
 * Switch an AUX/matrix slot between a regular AUX bus and a matrix bus.
 *
 * The slot itself is always switched. If it is currently stereo-linked, the
 * linked neighbour slot is switched as well, so a linked pair always stays
 * consistent (both AUX or both matrix). Matrix buses are only available on the Ui24R.
 *
 * @param value `true` to switch to matrix, `false` to switch back to a regular AUX bus
 */
export function setMatrixMode(
  conn: MixerConnection,
  store: MixerStore,
  bus: number,
  value: boolean,
) {
  // always switch the slot itself
  conn.setdBool(`a.${bus - 1}.matrix`, value);

  // also switch the stereo-linked neighbour, if the slot is currently linked
  store.state$.pipe(select(selectStereoIndex('a', bus)), take(1)).subscribe(stereoIndex => {
    const linkedBus = getLinkedChannelNumber(bus, stereoIndex);
    if (linkedBus !== undefined) {
      conn.setdBool(`a.${linkedBus - 1}.matrix`, value);
    }
  });
}
