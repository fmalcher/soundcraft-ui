import { firstValueFrom, Subject } from 'rxjs';
import { MixerConnection } from '../mixer-connection';
import { MixerStore } from './mixer-store';

describe('Mixer Store', () => {
  let conn: { allMessages$: Subject<string> };
  let mixerStore: MixerStore;

  function sendMessage(message: string): void {
    conn.allMessages$.next(message);
  }

  beforeEach(() => {
    conn = {
      allMessages$: new Subject<string>(),
    };

    mixerStore = new MixerStore(conn as unknown as MixerConnection);
  });

  it('should reduce channel sync state', async () => {
    sendMessage('BMSG^SYNC^mySyncId^5');
    sendMessage('BMSG^SYNC^mySyncId^6');
    sendMessage('BMSG^SYNC^mySyncId^10');
    expect(await firstValueFrom(mixerStore.syncState$)).toEqual({ mySyncId: 10 });

    sendMessage('BMSG^SYNC^SYNC_ID^8');
    sendMessage('BMSG^SYNC^SYNC_ID^20');
    expect(await firstValueFrom(mixerStore.syncState$)).toEqual({ mySyncId: 10, SYNC_ID: 20 });

    sendMessage('BMSG^SYNC^mySyncId^44');
    sendMessage('BMSG^SYNC^anotherSyncId^11');
    expect(await firstValueFrom(mixerStore.syncState$)).toEqual({
      mySyncId: 44,
      SYNC_ID: 20,
      anotherSyncId: 11,
    });
  });

  describe('state$', () => {
    it('should reduce SETD/SETS messages to state', async () => {
      sendMessage('SETD^i.3.mute^0');
      sendMessage('SETD^i.4.mute^1');
      sendMessage('SETS^i.10.name^channelname');
      expect(await firstValueFrom(mixerStore.state$)).toEqual({
        'i.3.mute': 0,
        'i.4.mute': 1,
        'i.10.name': 'channelname',
      });

      sendMessage('SETS^i.10.name^anothername');
      sendMessage('SETD^i.3.mute^1');
      expect(await firstValueFrom(mixerStore.state$)).toEqual({
        'i.3.mute': 1,
        'i.4.mute': 1,
        'i.10.name': 'anothername',
      });
    });

    it('should ignore messages other than SETD or SETS', async () => {
      sendMessage('SETD^abc^def');

      sendMessage('FOO^bar^baz');
      sendMessage('XYZ^xyz^xyz');
      expect(await firstValueFrom(mixerStore.state$)).toEqual({ abc: 'def' });
    });
  });
});
