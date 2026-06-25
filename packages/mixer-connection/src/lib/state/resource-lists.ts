import { Observable, filter, map, take } from 'rxjs';

import { MixerConnection } from '../mixer-connection';

/**
 * Per-client resource listings (playlists, shows, snapshots, cues) are not part of the
 * global SETD/SETS mixer state. They are sent only on request, via dedicated list messages.
 *
 * This config maps each reply command to whether it is keyed by a parent:
 * - flat list `CMD^entry^entry…`            (`keyed: false`, e.g. `PLISTS`, `SHOWLIST`)
 * - keyed list `CMD^key^entry^entry…`       (`keyed: true`, e.g. `PLIST_TRACKS`, `SNAPSHOTLIST`,
 *   `CUELIST`), where `key` is the parent (playlist/show)
 *
 * The store stores each message under its "address" (the command plus its key, i.e. everything
 * before the entries): 1 leading part for flat lists, 2 for keyed lists.
 *
 * An empty list is sent with a trailing separator and no entries (e.g. `CUELIST^Default^`),
 * which splits into a single empty-string entry — so empty entries are filtered out on parsing.
 */
export const RESOURCE_LIST_CONFIG: Record<string, { keyed: boolean }> = {
  PLISTS: { keyed: false },
  PLIST_TRACKS: { keyed: true },
  SHOWLIST: { keyed: false },
  SNAPSHOTLIST: { keyed: true },
  CUELIST: { keyed: true },
};

/** Key addresses and prefixes in the state */
export const PLAYLISTS_KEY = 'PLISTS';
export const PLAYLIST_TRACKS_KEY = 'PLIST_TRACKS';
export const SHOWS_KEY = 'SHOWLIST';
export const SNAPSHOTS_KEY = 'SNAPSHOTLIST';
export const CUES_KEY = 'CUELIST';

/**
 * Request a per-client resource list and emit the entries of the matching reply once.
 * Subscribes to the reply BEFORE sending the request, so the reply is never missed.
 * @param conn connection
 * @param requestCmd full message to send, e.g. `MEDIA_GET_PLISTS` or `SHOWLIST`
 * @param replyCmd reply command to wait for, e.g. `PLISTS` or `SHOWLIST`
 */
export function requestResourceList(
  conn: MixerConnection,
  requestCmd: string,
  replyCmd: string,
): Observable<string[]> {
  return new Observable<string[]>(subscriber => {
    const sub = conn.inbound$
      .pipe(
        filter(msg => msg.startsWith(replyCmd + '^')),
        take(1),
        // drop the trailing empty entry of an empty list (e.g. `SHOWLIST^`)
        map(msg => msg.split('^').slice(1).filter(Boolean)),
      )
      .subscribe(subscriber);
    conn.sendMessage(requestCmd);
    return sub;
  });
}
