import { firstValueFrom } from 'rxjs';
import { SoundcraftUI } from '../soundcraft-ui';
import { setMixerModel } from '../test.utils';
import { ChannelSync } from './channel-sync';

describe('ChannelSync', () => {
  let conn: SoundcraftUI;
  let cs: ChannelSync;

  beforeEach(() => {
    conn = new SoundcraftUI('0.0.0.0');
    cs = conn.channelSync;
  });

  it('should select channel index and read the same value', async () => {
    // default SYNC ID
    const indexDefault$ = cs.getSelectedChannelIndex();
    cs.selectChannelIndex(5);
    expect(await firstValueFrom(indexDefault$)).toBe(5);

    cs.selectChannelIndex(13);
    expect(await firstValueFrom(indexDefault$)).toBe(13);

    // custom SYNC ID
    const indexCustom$ = cs.getSelectedChannelIndex('THESYNCID');
    cs.selectChannelIndex(3, 'THESYNCID');
    expect(await firstValueFrom(indexCustom$)).toBe(3);

    cs.selectChannelIndex(9, 'THESYNCID');
    expect(await firstValueFrom(indexCustom$)).toBe(9);
  });

  it('should send message when selecting a channel', () => {
    conn.conn.sendMessage = jest.fn();
    cs.selectChannelIndex(5);
    expect(conn.conn.sendMessage).toHaveBeenCalledWith('BMSG^SYNC^SYNC_ID^5');

    cs.selectChannelIndex(5, 'mySyncId123');
    expect(conn.conn.sendMessage).toHaveBeenCalledWith('BMSG^SYNC^mySyncId123^5');
  });

  it('should emit nothing when no channel is selected', () => {
    const nextCallback = jest.fn();
    cs.getSelectedChannelIndex().subscribe(nextCallback);

    expect(nextCallback).not.toHaveBeenCalled();
  });

  describe('selectChannel', () => {
    beforeEach(() => {
      jest.spyOn(conn.conn, 'sendMessage');
      setMixerModel('ui24', conn);
    });

    it('should select master', () => {
      setMixerModel('ui12', conn);
      cs.selectChannel('master');
      expect(conn.conn.sendMessage).toHaveBeenCalledWith('BMSG^SYNC^SYNC_ID^-1');

      cs.selectChannel('master', 'mySyncId');
      expect(conn.conn.sendMessage).toHaveBeenCalledWith('BMSG^SYNC^mySyncId^-1');

      setMixerModel('ui16', conn);
      cs.selectChannel('master');
      expect(conn.conn.sendMessage).toHaveBeenCalledWith('BMSG^SYNC^SYNC_ID^-1');

      cs.selectChannel('master', 'mySyncId2');
      expect(conn.conn.sendMessage).toHaveBeenCalledWith('BMSG^SYNC^mySyncId2^-1');

      setMixerModel('ui24', conn);
      cs.selectChannel('master');
      expect(conn.conn.sendMessage).toHaveBeenCalledWith('BMSG^SYNC^SYNC_ID^-1');

      cs.selectChannel('master', 'mySyncId3');
      expect(conn.conn.sendMessage).toHaveBeenCalledWith('BMSG^SYNC^mySyncId3^-1');
    });

    it('should select input channel', () => {
      setMixerModel('ui12', conn);
      cs.selectChannel('i', 3);
      expect(conn.conn.sendMessage).toHaveBeenCalledWith('BMSG^SYNC^SYNC_ID^2');

      cs.selectChannel('i', 2, 'mySyncId');
      expect(conn.conn.sendMessage).toHaveBeenCalledWith('BMSG^SYNC^mySyncId^1');

      setMixerModel('ui16', conn);
      cs.selectChannel('i', 7);
      expect(conn.conn.sendMessage).toHaveBeenCalledWith('BMSG^SYNC^SYNC_ID^6');

      cs.selectChannel('i', 10, 'mySyncId2');
      expect(conn.conn.sendMessage).toHaveBeenCalledWith('BMSG^SYNC^mySyncId2^9');

      setMixerModel('ui24', conn);
      cs.selectChannel('i', 15);
      expect(conn.conn.sendMessage).toHaveBeenCalledWith('BMSG^SYNC^SYNC_ID^14');

      cs.selectChannel('i', 20, 'mySyncId3');
      expect(conn.conn.sendMessage).toHaveBeenCalledWith('BMSG^SYNC^mySyncId3^19');
    });

    it('should select player and line channels', () => {
      setMixerModel('ui12', conn);
      cs.selectChannel('p', 2);
      expect(conn.conn.sendMessage).toHaveBeenCalledWith('BMSG^SYNC^SYNC_ID^11');

      cs.selectChannel('p', 1, 'theid');
      expect(conn.conn.sendMessage).toHaveBeenCalledWith('BMSG^SYNC^theid^10');

      cs.selectChannel('l', 1);
      expect(conn.conn.sendMessage).toHaveBeenCalledWith('BMSG^SYNC^SYNC_ID^8');

      cs.selectChannel('l', 2, 'foobar');
      expect(conn.conn.sendMessage).toHaveBeenCalledWith('BMSG^SYNC^foobar^9');

      setMixerModel('ui16', conn);
      cs.selectChannel('p', 1);
      expect(conn.conn.sendMessage).toHaveBeenCalledWith('BMSG^SYNC^SYNC_ID^14');

      cs.selectChannel('p', 2, 'xyz');
      expect(conn.conn.sendMessage).toHaveBeenCalledWith('BMSG^SYNC^xyz^15');

      cs.selectChannel('l', 1);
      expect(conn.conn.sendMessage).toHaveBeenCalledWith('BMSG^SYNC^SYNC_ID^12');

      cs.selectChannel('l', 2, 'xyz');
      expect(conn.conn.sendMessage).toHaveBeenCalledWith('BMSG^SYNC^xyz^13');

      setMixerModel('ui24', conn);
      cs.selectChannel('p', 1);
      expect(conn.conn.sendMessage).toHaveBeenCalledWith('BMSG^SYNC^SYNC_ID^26');

      cs.selectChannel('p', 2, 'abc');
      expect(conn.conn.sendMessage).toHaveBeenCalledWith('BMSG^SYNC^abc^27');

      cs.selectChannel('l', 2);
      expect(conn.conn.sendMessage).toHaveBeenCalledWith('BMSG^SYNC^SYNC_ID^25');

      cs.selectChannel('l', 1, 'abc');
      expect(conn.conn.sendMessage).toHaveBeenCalledWith('BMSG^SYNC^abc^24');
    });

    it('should select FX channel', () => {
      setMixerModel('ui12', conn);
      cs.selectChannel('f', 4);
      expect(conn.conn.sendMessage).toHaveBeenCalledWith('BMSG^SYNC^SYNC_ID^15');

      cs.selectChannel('f', 3, 'myid');
      expect(conn.conn.sendMessage).toHaveBeenCalledWith('BMSG^SYNC^myid^14');

      setMixerModel('ui16', conn);
      cs.selectChannel('f', 2);
      expect(conn.conn.sendMessage).toHaveBeenCalledWith('BMSG^SYNC^SYNC_ID^17');

      cs.selectChannel('f', 1, 'foobar');
      expect(conn.conn.sendMessage).toHaveBeenCalledWith('BMSG^SYNC^foobar^16');

      setMixerModel('ui24', conn);
      cs.selectChannel('f', 4);
      expect(conn.conn.sendMessage).toHaveBeenCalledWith('BMSG^SYNC^SYNC_ID^31');

      cs.selectChannel('f', 3, 'foobar');
      expect(conn.conn.sendMessage).toHaveBeenCalledWith('BMSG^SYNC^foobar^30');
    });

    it('should select subgroup channel', () => {
      setMixerModel('ui12', conn);
      cs.selectChannel('s', 2);
      expect(conn.conn.sendMessage).toHaveBeenCalledWith('BMSG^SYNC^SYNC_ID^17');

      cs.selectChannel('s', 1, 'abc');
      expect(conn.conn.sendMessage).toHaveBeenCalledWith('BMSG^SYNC^abc^16');

      setMixerModel('ui16', conn);
      cs.selectChannel('s', 3);
      expect(conn.conn.sendMessage).toHaveBeenCalledWith('BMSG^SYNC^SYNC_ID^22');

      cs.selectChannel('s', 1, 'def');
      expect(conn.conn.sendMessage).toHaveBeenCalledWith('BMSG^SYNC^def^20');

      setMixerModel('ui24', conn);
      cs.selectChannel('s', 4);
      expect(conn.conn.sendMessage).toHaveBeenCalledWith('BMSG^SYNC^SYNC_ID^35');

      cs.selectChannel('s', 3, 'ghi');
      expect(conn.conn.sendMessage).toHaveBeenCalledWith('BMSG^SYNC^ghi^34');
    });

    it('should select AUX channel', () => {
      setMixerModel('ui12', conn);
      cs.selectChannel('a', 3);
      expect(conn.conn.sendMessage).toHaveBeenCalledWith('BMSG^SYNC^SYNC_ID^22');

      cs.selectChannel('a', 2, 'abc');
      expect(conn.conn.sendMessage).toHaveBeenCalledWith('BMSG^SYNC^abc^21');

      setMixerModel('ui16', conn);
      cs.selectChannel('a', 5);
      expect(conn.conn.sendMessage).toHaveBeenCalledWith('BMSG^SYNC^SYNC_ID^28');

      cs.selectChannel('a', 4, 'def');
      expect(conn.conn.sendMessage).toHaveBeenCalledWith('BMSG^SYNC^def^27');

      setMixerModel('ui24', conn);
      cs.selectChannel('a', 10);
      expect(conn.conn.sendMessage).toHaveBeenCalledWith('BMSG^SYNC^SYNC_ID^47');

      cs.selectChannel('a', 8, 'ghi');
      expect(conn.conn.sendMessage).toHaveBeenCalledWith('BMSG^SYNC^ghi^45');
    });

    it('should select VCA channel', () => {
      setMixerModel('ui24', conn);
      cs.selectChannel('v', 6);
      expect(conn.conn.sendMessage).toHaveBeenCalledWith('BMSG^SYNC^SYNC_ID^53');

      cs.selectChannel('v', 2, 'abc');
      expect(conn.conn.sendMessage).toHaveBeenCalledWith('BMSG^SYNC^abc^49');
    });

    it('should throw when wrong arguments are used', () => {
      /* eslint-disable @typescript-eslint/no-explicit-any */
      setMixerModel('ui24', conn);
      // no arguments
      expect(() => (cs.selectChannel as any)()).toThrow();

      // no channel number
      expect(() => (cs.selectChannel as any)('i')).toThrow();

      // channel number confused with SYNC ID
      expect(() => (cs.selectChannel as any)('i', 'abc')).toThrow();

      // master with channel number
      expect(() => (cs.selectChannel as any)('master', 1)).toThrow();

      // master with SYNC ID and additional argument
      expect(() => (cs.selectChannel as any)('master', 'abc', 'def')).toThrow();
    });

    it('should throw when channel number is out of range', () => {
      setMixerModel('ui24', conn);
      expect(() => cs.selectChannel('i', 100)).toThrow();
      expect(() => cs.selectChannel('a', 20)).toThrow();
      expect(() => cs.selectChannel('f', 10)).toThrow();
      expect(() => cs.selectChannel('p', 3)).toThrow();
      expect(() => cs.selectChannel('l', 4)).toThrow();
      expect(() => cs.selectChannel('v', 8)).toThrow();
      expect(() => cs.selectChannel('s', 30)).toThrow();
    });
  });

  describe('getSelectedChannel', () => {
    it('should return null when channel index is out of range', async () => {
      setMixerModel('ui24', conn);
      cs.selectChannelIndex(100);
      expect(await firstValueFrom(cs.getSelectedChannel())).toBe(null);

      cs.selectChannelIndex(100, 'abc');
      expect(await firstValueFrom(cs.getSelectedChannel('abc'))).toBe(null);
    });

    it('should return master', async () => {
      setMixerModel('ui12', conn);
      cs.selectChannel('master');
      expect(await firstValueFrom(cs.getSelectedChannel())).toBe(conn.master);

      cs.selectChannel('master', 'abc');
      expect(await firstValueFrom(cs.getSelectedChannel('abc'))).toBe(conn.master);

      setMixerModel('ui16', conn);
      cs.selectChannel('master');
      expect(await firstValueFrom(cs.getSelectedChannel())).toBe(conn.master);

      cs.selectChannel('master', 'def');
      expect(await firstValueFrom(cs.getSelectedChannel('def'))).toBe(conn.master);

      setMixerModel('ui24', conn);
      cs.selectChannel('master');
      expect(await firstValueFrom(cs.getSelectedChannel())).toBe(conn.master);

      cs.selectChannel('master', 'xyz');
      expect(await firstValueFrom(cs.getSelectedChannel('xyz'))).toBe(conn.master);
    });

    it('should return input channel', async () => {
      setMixerModel('ui12', conn);
      cs.selectChannel('i', 2);
      expect(await firstValueFrom(cs.getSelectedChannel())).toBe(conn.master.input(2));

      cs.selectChannel('i', 1, 'abc');
      expect(await firstValueFrom(cs.getSelectedChannel('abc'))).toBe(conn.master.input(1));

      setMixerModel('ui16', conn);
      cs.selectChannel('i', 3);
      expect(await firstValueFrom(cs.getSelectedChannel())).toBe(conn.master.input(3));

      cs.selectChannel('i', 2, 'def');
      expect(await firstValueFrom(cs.getSelectedChannel('def'))).toBe(conn.master.input(2));

      setMixerModel('ui24', conn);
      cs.selectChannel('i', 5);
      expect(await firstValueFrom(cs.getSelectedChannel())).toBe(conn.master.input(5));

      cs.selectChannel('i', 4, 'ghi');
      expect(await firstValueFrom(cs.getSelectedChannel('ghi'))).toBe(conn.master.input(4));
    });

    it('should return player and line channels', async () => {
      setMixerModel('ui12', conn);
      cs.selectChannel('p', 2);
      expect(await firstValueFrom(cs.getSelectedChannel())).toBe(conn.master.player(2));

      cs.selectChannel('p', 1, 'abc');
      expect(await firstValueFrom(cs.getSelectedChannel('abc'))).toBe(conn.master.player(1));

      cs.selectChannel('l', 2);
      expect(await firstValueFrom(cs.getSelectedChannel())).toBe(conn.master.line(2));

      cs.selectChannel('l', 1, 'def');
      expect(await firstValueFrom(cs.getSelectedChannel('def'))).toBe(conn.master.line(1));

      setMixerModel('ui16', conn);
      cs.selectChannel('p', 1);
      expect(await firstValueFrom(cs.getSelectedChannel())).toBe(conn.master.player(1));

      cs.selectChannel('p', 2, 'ghi');
      expect(await firstValueFrom(cs.getSelectedChannel('ghi'))).toBe(conn.master.player(2));

      cs.selectChannel('l', 1);
      expect(await firstValueFrom(cs.getSelectedChannel())).toBe(conn.master.line(1));

      cs.selectChannel('l', 2, 'jkl');
      expect(await firstValueFrom(cs.getSelectedChannel('jkl'))).toBe(conn.master.line(2));

      setMixerModel('ui24', conn);
      cs.selectChannel('p', 1);
      expect(await firstValueFrom(cs.getSelectedChannel())).toBe(conn.master.player(1));

      cs.selectChannel('p', 2, 'mno');
      expect(await firstValueFrom(cs.getSelectedChannel('mno'))).toBe(conn.master.player(2));

      cs.selectChannel('l', 1);
      expect(await firstValueFrom(cs.getSelectedChannel())).toBe(conn.master.line(1));

      cs.selectChannel('l', 2, 'pqr');
      expect(await firstValueFrom(cs.getSelectedChannel('pqr'))).toBe(conn.master.line(2));
    });

    it('should return FX channel', async () => {
      setMixerModel('ui12', conn);
      cs.selectChannel('f', 2);
      expect(await firstValueFrom(cs.getSelectedChannel())).toBe(conn.master.fx(2));

      cs.selectChannel('f', 1, 'abc');
      expect(await firstValueFrom(cs.getSelectedChannel('abc'))).toBe(conn.master.fx(1));

      setMixerModel('ui16', conn);
      cs.selectChannel('f', 3);
      expect(await firstValueFrom(cs.getSelectedChannel())).toBe(conn.master.fx(3));

      cs.selectChannel('f', 2, 'def');
      expect(await firstValueFrom(cs.getSelectedChannel('def'))).toBe(conn.master.fx(2));

      setMixerModel('ui24', conn);
      cs.selectChannel('f', 3);
      expect(await firstValueFrom(cs.getSelectedChannel())).toBe(conn.master.fx(3));

      cs.selectChannel('f', 4, 'ghi');
      expect(await firstValueFrom(cs.getSelectedChannel('ghi'))).toBe(conn.master.fx(4));
    });

    it('should return subgroup channel', async () => {
      setMixerModel('ui12', conn);
      cs.selectChannel('s', 2);
      expect(await firstValueFrom(cs.getSelectedChannel())).toBe(conn.master.sub(2));

      cs.selectChannel('s', 1, 'abc');
      expect(await firstValueFrom(cs.getSelectedChannel('abc'))).toBe(conn.master.sub(1));

      setMixerModel('ui16', conn);
      cs.selectChannel('s', 3);
      expect(await firstValueFrom(cs.getSelectedChannel())).toBe(conn.master.sub(3));

      cs.selectChannel('s', 2, 'def');
      expect(await firstValueFrom(cs.getSelectedChannel('def'))).toBe(conn.master.sub(2));

      setMixerModel('ui24', conn);
      cs.selectChannel('s', 4);
      expect(await firstValueFrom(cs.getSelectedChannel())).toBe(conn.master.sub(4));

      cs.selectChannel('s', 3, 'ghi');
      expect(await firstValueFrom(cs.getSelectedChannel('ghi'))).toBe(conn.master.sub(3));
    });

    it('should return AUX channel', async () => {
      setMixerModel('ui12', conn);
      cs.selectChannel('a', 2);
      expect(await firstValueFrom(cs.getSelectedChannel())).toBe(conn.master.aux(2));

      cs.selectChannel('a', 1, 'abc');
      expect(await firstValueFrom(cs.getSelectedChannel('abc'))).toBe(conn.master.aux(1));

      setMixerModel('ui16', conn);
      cs.selectChannel('a', 3);
      expect(await firstValueFrom(cs.getSelectedChannel())).toBe(conn.master.aux(3));

      cs.selectChannel('a', 2, 'def');
      expect(await firstValueFrom(cs.getSelectedChannel('def'))).toBe(conn.master.aux(2));

      setMixerModel('ui24', conn);
      cs.selectChannel('a', 5);
      expect(await firstValueFrom(cs.getSelectedChannel())).toBe(conn.master.aux(5));

      cs.selectChannel('a', 4, 'ghi');
      expect(await firstValueFrom(cs.getSelectedChannel('ghi'))).toBe(conn.master.aux(4));
    });

    it('should return VCA channel', async () => {
      setMixerModel('ui24', conn);
      cs.selectChannel('v', 6);
      expect(await firstValueFrom(cs.getSelectedChannel())).toBe(conn.master.vca(6));

      cs.selectChannel('v', 2, 'abc');
      expect(await firstValueFrom(cs.getSelectedChannel('abc'))).toBe(conn.master.vca(2));
    });
  });
});
