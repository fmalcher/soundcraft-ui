import { SoundcraftUI } from '../soundcraft-ui';

describe('Object Store Singletons', () => {
  let conn: SoundcraftUI;

  beforeEach(() => {
    conn = new SoundcraftUI('0.0.0.0');
  });

  // Note: comparing class instances with toBe() directly doesn't work because of circular structure errors.
  // This is why we used toBe(true) as a workaround.

  describe('should create objects only once and retrieve them from the ObjectStore', () => {
    it('MasterChannel', () => {
      const obj1 = conn.master.player(2);
      const obj2 = conn.master.player(2);
      expect(obj1 === obj2).toBe(true);
    });

    it('DelayableMasterChannel', () => {
      const obj1 = conn.master.input(10);
      const obj2 = conn.master.input(10);
      expect(obj1 === obj2).toBe(true);
    });

    it('AuxChannel', () => {
      const obj1 = conn.aux(2).input(4);
      const obj2 = conn.aux(2).input(4);
      expect(obj1 === obj2).toBe(true);
    });

    it('FxChannel', () => {
      const obj1 = conn.fx(1).input(2);
      const obj2 = conn.fx(1).input(2);
      expect(obj1 === obj2).toBe(true);
    });

    it('VolumeBus', () => {
      const obj1 = conn.volume.headphone(1);
      const obj2 = conn.volume.headphone(1);
      expect(obj1 === obj2).toBe(true);
    });

    it('MuteGroup', () => {
      const obj1 = conn.muteGroup(2);
      const obj2 = conn.muteGroup(2);
      expect(obj1 === obj2).toBe(true);
    });

    it('HwChannel', () => {
      const obj1 = conn.hw(4);
      const obj2 = conn.hw(4);
      expect(obj1 === obj2).toBe(true);
    });

    it('FxBus', () => {
      const obj1 = conn.fx(3);
      const obj2 = conn.fx(3);
      expect(obj1 === obj2).toBe(true);
    });
  });
});
