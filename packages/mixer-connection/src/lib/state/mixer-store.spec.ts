import { describe, it, expect, beforeEach } from 'vitest';
import { firstValueFrom, Subject } from 'rxjs';
import { MixerConnection } from '../mixer-connection';
import { MixerStore } from './mixer-store';

describe('Mixer Store', () => {
  let conn: { allMessages$: Subject<string>; inbound$: Subject<string> };
  let mixerStore: MixerStore;

  function sendMessage(message: string): void {
    conn.allMessages$.next(message);
  }

  function sendInbound(message: string): void {
    conn.inbound$.next(message);
  }

  beforeEach(() => {
    conn = {
      allMessages$: new Subject<string>(),
      inbound$: new Subject<string>(),
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

    it('should convert SETD values to numbers (int and float, incl. negative)', async () => {
      sendMessage('SETD^i.3.mute^1');
      sendMessage('SETD^i.3.mix^0.5236732');
      sendMessage('SETD^i.3.pan^-0.25');
      expect(await firstValueFrom(mixerStore.state$)).toEqual({
        'i.3.mute': 1,
        'i.3.mix': 0.5236732,
        'i.3.pan': -0.25,
      });
    });

    it('should keep SETS values as strings even when they look numeric', async () => {
      sendMessage('SETS^i.3.name^34534');
      sendMessage('SETS^var.mtk.session^0004');
      expect(await firstValueFrom(mixerStore.state$)).toEqual({
        'i.3.name': '34534',
        'var.mtk.session': '0004',
      });
    });

    it('should keep the full value when it contains the ^ separator', async () => {
      sendMessage('SETS^i.3.name^foo^bar');
      sendMessage('SETS^i.4.name^a^b^c');
      expect(await firstValueFrom(mixerStore.state$)).toEqual({
        'i.3.name': 'foo^bar',
        'i.4.name': 'a^b^c',
      });
    });

    it('should ignore messages other than SETD or SETS', async () => {
      sendMessage('SETD^abc^1');
      sendMessage('SETS^def^ghi');

      sendMessage('FOO^bar^baz');
      sendMessage('XYZ^xyz^xyz');
      expect(await firstValueFrom(mixerStore.state$)).toEqual({ abc: 1, def: 'ghi' });
    });
  });

  describe('resourceListState$', () => {
    it('stores flat lists under the command and keyed lists under command^key', async () => {
      sendInbound('PLISTS^List1^List2^~all~');
      sendInbound('PLIST_TRACKS^List1^a.mp3^b.mp3');
      expect(await firstValueFrom(mixerStore.resourceListState$)).toEqual({
        PLISTS: ['List1', 'List2', '~all~'],
        'PLIST_TRACKS^List1': ['a.mp3', 'b.mp3'],
      });
    });

    it('replaces a flat list when it is sent again', async () => {
      sendInbound('PLISTS^List1^List2');
      sendInbound('PLISTS^List1');
      expect(await firstValueFrom(mixerStore.resourceListState$)).toEqual({
        PLISTS: ['List1'],
      });
    });

    it('treats a trailing-separator list as empty (e.g. `PLIST_TRACKS^List1^`)', async () => {
      sendInbound('PLISTS^List1');
      sendInbound('PLIST_TRACKS^List1^');
      expect(await firstValueFrom(mixerStore.resourceListState$)).toEqual({
        PLISTS: ['List1'],
        'PLIST_TRACKS^List1': [],
      });
    });

    it('stores shows, snapshots and cues under their addresses', async () => {
      sendInbound('SHOWLIST^Default^test');
      sendInbound('SNAPSHOTLIST^Default^snap1^snap2');
      sendInbound('CUELIST^Default^cue1');
      expect(await firstValueFrom(mixerStore.resourceListState$)).toEqual({
        SHOWLIST: ['Default', 'test'],
        'SNAPSHOTLIST^Default': ['snap1', 'snap2'],
        'CUELIST^Default': ['cue1'],
      });
    });

    it('ignores messages that are not configured resource lists', async () => {
      sendInbound('SETD^i.3.mute^1');
      sendInbound('FOO^bar');
      sendInbound('PLISTS^List1');
      expect(await firstValueFrom(mixerStore.resourceListState$)).toEqual({
        PLISTS: ['List1'],
      });
    });
  });
});
