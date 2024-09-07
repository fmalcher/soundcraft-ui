import { SoundcraftUI } from '../soundcraft-ui';

describe('Channel Store Singletons', () => {
  let conn: SoundcraftUI;

  beforeEach(() => {
    conn = new SoundcraftUI('0.0.0.0');
  });

  // Note: comparing class instances with toBe() directly doesn't work because of circular structure errors.
  // This is why we used toBe(true) as a workaround.

  describe('should create objects only once and retrieve them from the ChannelStore', () => {
    it('MasterChannel', () => {
      const ch1 = conn.master.player(2);
      const ch2 = conn.master.player(2);
      expect(ch1 === ch2).toBe(true);
    });

    it('DelayableMasterChannel', () => {
      const ch1 = conn.master.input(10);
      const ch2 = conn.master.input(10);
      expect(ch1 === ch2).toBe(true);
    });

    it('AuxChannel', () => {
      const ch1 = conn.aux(2).input(4);
      const ch2 = conn.aux(2).input(4);
      expect(ch1 === ch2).toBe(true);
    });

    it('FxChannel', () => {
      const ch1 = conn.fx(1).input(2);
      const ch2 = conn.fx(1).input(2);
      expect(ch1 === ch2).toBe(true);
    });

    it('VolumeBus', () => {
      const bus1 = conn.volume.headphone(1);
      const bus2 = conn.volume.headphone(1);
      expect(bus1 === bus2).toBe(true);
    });

    it('MuteGroup', () => {
      const bus1 = conn.muteGroup(2);
      const bus2 = conn.muteGroup(2);
      expect(bus1 === bus2).toBe(true);
    });

    it('HwChannel', () => {
      const ch1 = conn.hw(4);
      const ch2 = conn.hw(4);
      expect(ch1 === ch2).toBe(true);
    });
  });
});
