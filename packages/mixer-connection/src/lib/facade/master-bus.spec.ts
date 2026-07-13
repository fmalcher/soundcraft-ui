import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { firstValueFrom } from 'rxjs';
import { SoundcraftUI } from '../soundcraft-ui';
import { Easings } from '../utils/transitions/easings';
import { DBToFaderValue } from '../utils/value-converters';
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
      expect(await firstValueFrom(master.dim$)).toBe(true);

      master.undim();
      expect(await firstValueFrom(master.dim$)).toBe(false);

      master.setDim(true);
      expect(await firstValueFrom(master.dim$)).toBe(true);
    });

    it('toggleDim', async () => {
      master.setDim(false);
      master.toggleDim();
      expect(await firstValueFrom(master.dim$)).toBe(true);

      master.toggleDim();
      expect(await firstValueFrom(master.dim$)).toBe(false);
    });
  });

  describe('PAN', () => {
    it('pan$', async () => {
      master.setPan(0);
      expect(await firstValueFrom(master.pan$)).toBe(0);

      master.setPan(1);
      expect(await firstValueFrom(master.pan$)).toBe(1);

      master.setPan(0.5);
      expect(await firstValueFrom(master.pan$)).toBe(0.5);
    });

    it('should be clamped to 0..1', async () => {
      master.setPan(1.4);
      expect(await firstValueFrom(master.pan$)).toBe(1);

      master.setPan(-4.3);
      expect(await firstValueFrom(master.pan$)).toBe(0);
    });

    it('changePan', async () => {
      master.setPan(0.6);
      master.changePan(0.1);
      expect(await firstValueFrom(master.pan$)).toBe(0.7);

      master.changePan(-0.5);
      expect(await firstValueFrom(master.pan$)).toBe(0.2);
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

  describe('fader level', () => {
    it('changeFaderLevel', async () => {
      master.setFaderLevel(0.5);
      master.changeFaderLevel(0.2);
      expect(await firstValueFrom(master.faderLevel$)).toBe(0.7);

      master.changeFaderLevel(-0.4);
      expect(await firstValueFrom(master.faderLevel$)).toBe(0.3);
    });

    it('changeFaderLevel should be clamped to 0..1', async () => {
      master.setFaderLevel(0.9);
      master.changeFaderLevel(0.3);
      expect(await firstValueFrom(master.faderLevel$)).toBe(1);

      master.setFaderLevel(0.1);
      master.changeFaderLevel(-0.5);
      expect(await firstValueFrom(master.faderLevel$)).toBe(0);
    });

    it('should change level from -Infinity dB upwards', async () => {
      master.setFaderLevel(0); // -Infinity dB
      master.changeFaderLevelDB(3);

      expect(await firstValueFrom(master.faderLevelDB$)).toBe(-97);
      expect(await firstValueFrom(master.faderLevel$)).toBe(DBToFaderValue(-97));
    });
  });

  describe('fader transition', () => {
    beforeEach(() => vi.useFakeTimers());
    afterEach(() => vi.useRealTimers());

    it('fadeTo should transition the master fader to the target linear value', () => {
      const results: number[] = [];
      master.faderLevel$.subscribe(v => results.push(v));

      master.setFaderLevel(0.3);
      master.fadeTo(0.8, 1000, Easings.Linear);
      vi.advanceTimersByTime(1000);

      expect(results.length).toBeGreaterThan(2); // multiple intermediate steps
      expect(results.at(-1)).toBe(0.8);
    });

    it('fadeToDB should transition the master fader to the target dB value', () => {
      const results: number[] = [];
      master.faderLevelDB$.subscribe(v => results.push(v));

      master.setFaderLevelDB(-60);
      master.fadeToDB(-3, 1000, Easings.Linear);
      vi.advanceTimersByTime(1000);

      expect(results.at(-1)).toBe(-3);
    });
  });
});
