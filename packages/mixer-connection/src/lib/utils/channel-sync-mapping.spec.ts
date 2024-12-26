import { SoundcraftUI } from '../soundcraft-ui';
import { channelToIndex, indexToChannel } from './channel-sync-mapping';

describe('Channel Sync Mapping', () => {
  let conn: SoundcraftUI;

  beforeEach(() => {
    conn = new SoundcraftUI('0.0.0.0');
  });

  describe('indexToChannel', () => {
    it('should return master for index -1', () => {
      expect(indexToChannel(conn, 'ui12', -1)).toBe(conn.master);
      expect(indexToChannel(conn, 'ui16', -1)).toBe(conn.master);
      expect(indexToChannel(conn, 'ui16', -1)).toBe(conn.master);
    });

    it('should return input channel', () => {
      expect(indexToChannel(conn, 'ui12', 5)).toBe(conn.master.input(6));
      expect(indexToChannel(conn, 'ui16', 4)).toBe(conn.master.input(5));
      expect(indexToChannel(conn, 'ui24', 3)).toBe(conn.master.input(4));
    });

    it('should return line channel', () => {
      expect(indexToChannel(conn, 'ui12', 8)).toBe(conn.master.line(1));
      expect(indexToChannel(conn, 'ui16', 13)).toBe(conn.master.line(2));
      expect(indexToChannel(conn, 'ui24', 24)).toBe(conn.master.line(1));
    });

    it('should return player channel', () => {
      expect(indexToChannel(conn, 'ui12', 11)).toBe(conn.master.player(2));
      expect(indexToChannel(conn, 'ui16', 14)).toBe(conn.master.player(1));
      expect(indexToChannel(conn, 'ui24', 27)).toBe(conn.master.player(2));
    });

    it('should return FX channel', () => {
      expect(indexToChannel(conn, 'ui12', 12)).toBe(conn.master.fx(1));
      expect(indexToChannel(conn, 'ui16', 18)).toBe(conn.master.fx(3));
      expect(indexToChannel(conn, 'ui24', 29)).toBe(conn.master.fx(2));
    });

    it('should return subgroup channel', () => {
      expect(indexToChannel(conn, 'ui12', 19)).toBe(conn.master.sub(4));
      expect(indexToChannel(conn, 'ui16', 21)).toBe(conn.master.sub(2));
      expect(indexToChannel(conn, 'ui24', 34)).toBe(conn.master.sub(3));
    });

    it('should return AUX channel', () => {
      expect(indexToChannel(conn, 'ui12', 21)).toBe(conn.master.aux(2));
      expect(indexToChannel(conn, 'ui16', 27)).toBe(conn.master.aux(4));
      expect(indexToChannel(conn, 'ui24', 44)).toBe(conn.master.aux(7));
    });

    it('should return VCA channel', () => {
      expect(indexToChannel(conn, 'ui24', 50)).toBe(conn.master.vca(3));
    });

    it('should return null for unknown index', () => {
      expect(indexToChannel(conn, 'ui12', 100)).toBeNull();
      expect(indexToChannel(conn, 'ui16', 100)).toBeNull();
      expect(indexToChannel(conn, 'ui24', 100)).toBeNull();
    });
  });

  describe('channelToIndex', () => {
    it('should return index for master', () => {
      expect(channelToIndex('ui12', 'master')).toBe(-1);
      expect(channelToIndex('ui16', 'master')).toBe(-1);
      expect(channelToIndex('ui24', 'master')).toBe(-1);
    });

    it('should return index for input channel', () => {
      expect(channelToIndex('ui12', 'i', 6)).toBe(5);
      expect(channelToIndex('ui16', 'i', 10)).toBe(9);
      expect(channelToIndex('ui24', 'i', 19)).toBe(18);
    });

    it('should return index for line channel', () => {
      expect(channelToIndex('ui12', 'l', 2)).toBe(9);
      expect(channelToIndex('ui16', 'l', 1)).toBe(12);
      expect(channelToIndex('ui24', 'l', 2)).toBe(25);
    });

    it('should return index for player channel', () => {
      expect(channelToIndex('ui12', 'p', 1)).toBe(10);
      expect(channelToIndex('ui16', 'p', 2)).toBe(15);
      expect(channelToIndex('ui24', 'p', 1)).toBe(26);
    });

    it('should return index for FX channel', () => {
      expect(channelToIndex('ui12', 'f', 2)).toBe(13);
      expect(channelToIndex('ui16', 'f', 1)).toBe(16);
      expect(channelToIndex('ui24', 'f', 4)).toBe(31);
    });

    it('should return index for subgroup channel', () => {
      expect(channelToIndex('ui12', 's', 2)).toBe(17);
      expect(channelToIndex('ui16', 's', 4)).toBe(23);
      expect(channelToIndex('ui24', 's', 5)).toBe(36);
    });

    it('should return index for AUX channel', () => {
      expect(channelToIndex('ui12', 'a', 4)).toBe(23);
      expect(channelToIndex('ui16', 'a', 2)).toBe(25);
      expect(channelToIndex('ui24', 'a', 8)).toBe(45);
    });

    it('should return index for VCA channel', () => {
      expect(channelToIndex('ui24', 'v', 5)).toBe(52);
    });

    it('should throw if channel number is missing', () => {
      /* eslint-disable @typescript-eslint/no-explicit-any */
      expect(() => (channelToIndex as any)('ui12', 'i')).toThrow();
      expect(() => (channelToIndex as any)('ui16', 'i')).toThrow();
      expect(() => (channelToIndex as any)('ui24', 'i')).toThrow();
    });

    it('should return null for unknown channel', () => {
      expect(channelToIndex('ui12', 'i', 100)).toBeNull();
      expect(channelToIndex('ui16', 'i', 100)).toBeNull();
      expect(channelToIndex('ui24', 'i', 100)).toBeNull();
    });
  });
});
