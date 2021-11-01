import { SoundcraftUI } from '../soundcraft-ui';
import { readFirst } from '../utils/testing-utils';
import { VolumeBus } from './volume-bus';

describe('Volume Bus', () => {
  let conn: SoundcraftUI;
  let bus: VolumeBus;

  beforeEach(() => {
    conn = new SoundcraftUI('0.0.0.0');
    bus = conn.volume.headphone(1);
  });

  describe('Fader Level', () => {
    it('faderLevel$', async () => {
      bus.setFaderLevel(0.5);
      expect(await readFirst(bus.faderLevel$)).toBe(0.5);

      bus.setFaderLevel(0.8889);
      expect(await readFirst(bus.faderLevel$)).toBe(0.8889);

      bus.setFaderLevelDB(0);
      expect(await readFirst(bus.faderLevel$)).toBe(0.76470588235);
    });

    it('faderLevelDB$', async () => {
      bus.setFaderLevelDB(-6);
      expect(await readFirst(bus.faderLevelDB$)).toBe(-6);

      bus.setFaderLevelDB(-12);
      expect(await readFirst(bus.faderLevelDB$)).toBe(-12);

      bus.setFaderLevel(0.76470588235);
      expect(await readFirst(bus.faderLevelDB$)).toBe(0);
    });

    it('changeFaderLevelDB', async () => {
      bus.setFaderLevelDB(-12);
      bus.changeFaderLevelDB(3);
      expect(await readFirst(bus.faderLevelDB$)).toBe(-9);

      bus.changeFaderLevelDB(-6);
      expect(await readFirst(bus.faderLevelDB$)).toBe(-15);
    });
  });

  describe('Fades', () => {
    beforeEach(() => jest.useFakeTimers());
    afterEach(() => jest.useRealTimers());

    it('fadeTo', async () => {
      bus.setFaderLevel(0.3);

      const results = [];
      bus.faderLevel$.subscribe(e => results.push(e));

      bus.fadeTo(0.8, 500);
      jest.advanceTimersByTime(500);

      expect(results).toMatchInlineSnapshot(`
        Array [
          0.3,
          0.3384615384615385,
          0.3769230769230769,
          0.41538461538461535,
          0.45384615384615384,
          0.49230769230769234,
          0.5307692307692308,
          0.5692307692307692,
          0.6076923076923078,
          0.6461538461538461,
          0.6846153846153846,
          0.7230769230769231,
          0.7615384615384615,
        ]
      `);
    });

    it('fadeToDB', async () => {
      bus.setFaderLevelDB(-15);

      const results = [];
      bus.faderLevelDB$.subscribe(e => results.push(e));

      bus.fadeToDB(-3, 500);
      jest.advanceTimersByTime(500);

      expect(results).toMatchInlineSnapshot(`
        Array [
          -15,
          -13.8,
          -12.7,
          -11.6,
          -10.6,
          -9.6,
          -8.6,
          -7.7,
          -6.9,
          -6.1,
          -5.3,
          -4.5,
          -3.7,
        ]
      `);
    });
  });
});
