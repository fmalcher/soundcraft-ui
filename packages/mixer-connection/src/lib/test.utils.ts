import { SoundcraftUI } from './soundcraft-ui';
import { MixerModel } from './types';

/** Manually set mixer model for testing */
export function setMixerModel(model: MixerModel, conn: SoundcraftUI) {
  conn.conn.sendMessage('SETD^model^' + model);
}
