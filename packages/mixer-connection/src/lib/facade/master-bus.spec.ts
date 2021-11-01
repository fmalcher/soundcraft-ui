import { SoundcraftUI } from '../soundcraft-ui';
import { MasterBus } from './master-bus';
import { readFirst } from '../utils/testing-utils';

describe('Master Bus', () => {
  let conn: SoundcraftUI;
  let master: MasterBus;

  beforeEach(() => {
    conn = new SoundcraftUI('0.0.0.0');
    master = conn.master;
  });

  describe('DIM', () => {
    it('dim$', async () => {
      master.dim();
      expect(await readFirst(master.dim$)).toBe(1);

      master.undim();
      expect(await readFirst(master.dim$)).toBe(0);

      master.setDim(1);
      expect(await readFirst(master.dim$)).toBe(1);
    });

    it('toggleDim', async () => {
      master.setDim(0);
      master.toggleDim();
      expect(await readFirst(master.dim$)).toBe(1);

      master.toggleDim();
      expect(await readFirst(master.dim$)).toBe(0);
    });
  });

  it('pan$', async () => {
    master.pan(0);
    expect(await readFirst(master.pan$)).toBe(0);

    master.pan(1);
    expect(await readFirst(master.pan$)).toBe(1);

    master.pan(0.5);
    expect(await readFirst(master.pan$)).toBe(0.5);
  });
});
