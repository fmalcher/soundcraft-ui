import { firstValueFrom } from 'rxjs';
import { SoundcraftUI } from '../soundcraft-ui';
import { MasterBus } from './master-bus';

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
      expect(await firstValueFrom(master.dim$)).toBe(1);

      master.undim();
      expect(await firstValueFrom(master.dim$)).toBe(0);

      master.setDim(1);
      expect(await firstValueFrom(master.dim$)).toBe(1);
    });

    it('toggleDim', async () => {
      master.setDim(0);
      master.toggleDim();
      expect(await firstValueFrom(master.dim$)).toBe(1);

      master.toggleDim();
      expect(await firstValueFrom(master.dim$)).toBe(0);
    });
  });

  it('pan$', async () => {
    master.pan(0);
    expect(await firstValueFrom(master.pan$)).toBe(0);

    master.pan(1);
    expect(await firstValueFrom(master.pan$)).toBe(1);

    master.pan(0.5);
    expect(await firstValueFrom(master.pan$)).toBe(0.5);
  });
});
