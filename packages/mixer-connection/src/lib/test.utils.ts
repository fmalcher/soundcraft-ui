import { SoundcraftUI } from './soundcraft-ui';
import { MixerModel } from './types';

/** Manually set mixer model for testing */
export function setMixerModel(model: MixerModel, conn: SoundcraftUI) {
  conn.conn.sets('model', model);
}

/** Collect all outbound/inbound messages into an array. */
export function collectMessages(conn: SoundcraftUI): string[] {
  const messages: string[] = [];
  conn.conn.allMessages$.subscribe(m => messages.push(m));
  return messages;
}
