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

  describe('PAN', () => {
    it('pan$', async () => {
      master.pan(0);
      expect(await firstValueFrom(master.pan$)).toBe(0);

      master.pan(1);
      expect(await firstValueFrom(master.pan$)).toBe(1);

      master.pan(0.5);
      expect(await firstValueFrom(master.pan$)).toBe(0.5);
    });

    it('should be clamped to 0..1', async () => {
      master.pan(1.4);
      expect(await firstValueFrom(master.pan$)).toBe(1);

      master.pan(-4.3);
      expect(await firstValueFrom(master.pan$)).toBe(0);
    });
  });

  describe('left delay', () => {
    it('delayL$', async () => {
      master.setDelayL(0.35);
      expect(await firstValueFrom(master.delayL$)).toBe(0.35);
    });

    it('setDelayL should be clamped to 0..500', async () => {
      master.setDelayL(600);
      expect(await firstValueFrom(master.delayL$)).toBe(500);

      master.setDelayL(-20);
      expect(await firstValueFrom(master.delayL$)).toBe(0);
    });

    it('changeDelayL', async () => {
      master.setDelayL(100);
      master.changeDelayL(40);
      expect(await firstValueFrom(master.delayL$)).toBe(140);

      master.changeDelayL(-60);
      expect(await firstValueFrom(master.delayL$)).toBe(80);
    });

    it('changeDelayL values should be clamped to 0..500', async () => {
      master.setDelayL(450);
      master.changeDelayL(110);
      expect(await firstValueFrom(master.delayL$)).toBe(500);

      master.setDelayL(10);
      master.changeDelayL(-100);
      expect(await firstValueFrom(master.delayL$)).toBe(0);
    });
  });

  describe('right delay', () => {
    it('delayR$', async () => {
      master.setDelayR(0.22);
      expect(await firstValueFrom(master.delayR$)).toBe(0.22);
    });

    it('setDelayR should be clamped to 0..500', async () => {
      master.setDelayR(550);
      expect(await firstValueFrom(master.delayR$)).toBe(500);

      master.setDelayR(-100);
      expect(await firstValueFrom(master.delayR$)).toBe(0);
    });

    it('changeDelayR', async () => {
      master.setDelayR(150);
      master.changeDelayR(-40);
      expect(await firstValueFrom(master.delayR$)).toBe(110);

      master.changeDelayR(90);
      expect(await firstValueFrom(master.delayR$)).toBe(200);
    });

    it('changeDelayR values should be clamped to 0..500', async () => {
      master.setDelayR(400);
      master.changeDelayR(150);
      expect(await firstValueFrom(master.delayR$)).toBe(500);

      master.setDelayR(100);
      master.changeDelayR(-150);
      expect(await firstValueFrom(master.delayR$)).toBe(0);
    });
  });
});
