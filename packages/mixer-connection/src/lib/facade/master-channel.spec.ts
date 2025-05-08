import { firstValueFrom } from 'rxjs';
import { SoundcraftUI } from '../soundcraft-ui';
import { MasterChannel } from './master-channel';

describe('Master Channel', () => {
  let conn: SoundcraftUI;
  let channel: MasterChannel;

  beforeEach(() => {
    conn = new SoundcraftUI('0.0.0.0');
    channel = conn.master.input(2);
  });

  it('should return the exact same channel object', () => {
    const obj1 = conn.master.input(5);
    const obj2 = conn.master.input(5);
    expect(obj1).toBe(obj2);
  });

  describe('Pan', () => {
    it('pan$', async () => {
      channel.setPan(0);
      expect(await firstValueFrom(channel.pan$)).toBe(0);

      channel.setPan(1);
      expect(await firstValueFrom(channel.pan$)).toBe(1);

      channel.setPan(0.5);
      expect(await firstValueFrom(channel.pan$)).toBe(0.5);
    });

    it('should be clamped to 0..1', async () => {
      channel.setPan(1.1);
      expect(await firstValueFrom(channel.pan$)).toBe(1);

      channel.setPan(-0.2);
      expect(await firstValueFrom(channel.pan$)).toBe(0);
    });

    it('changePan', async () => {
      channel.setPan(0.3);
      channel.changePan(0.63);
      expect(await firstValueFrom(channel.pan$)).toBe(0.93);

      channel.changePan(-0.54);
      expect(await firstValueFrom(channel.pan$)).toBe(0.39);
    });
  });

  describe('SOLO', () => {
    it('solo$', async () => {
      channel.solo();
      expect(await firstValueFrom(channel.solo$)).toBe(1);

      channel.unsolo();
      expect(await firstValueFrom(channel.solo$)).toBe(0);

      channel.setSolo(1);
      expect(await firstValueFrom(channel.solo$)).toBe(1);
    });

    it('toggleSolo', async () => {
      channel.setSolo(0);
      channel.toggleSolo();
      expect(await firstValueFrom(channel.solo$)).toBe(1);

      channel.toggleSolo();
      expect(await firstValueFrom(channel.solo$)).toBe(0);
    });
  });

  describe('Automix', () => {
    it('automixGroup$', async () => {
      conn.conn.sendMessage('SETD^i.1.amixgroup^0');
      expect(await firstValueFrom(channel.automixGroup$)).toBe('a');

      conn.conn.sendMessage('SETD^i.1.amixgroup^1');
      expect(await firstValueFrom(channel.automixGroup$)).toBe('b');

      conn.conn.sendMessage('SETD^i.1.amixgroup^-1');
      expect(await firstValueFrom(channel.automixGroup$)).toBe('none');
    });

    it('automixAssignGroup', async () => {
      channel.automixAssignGroup('a');
      expect(await firstValueFrom(channel.automixGroup$)).toBe('a');

      channel.automixAssignGroup('b');
      expect(await firstValueFrom(channel.automixGroup$)).toBe('b');

      channel.automixAssignGroup('none');
      expect(await firstValueFrom(channel.automixGroup$)).toBe('none');
    });

    it('automixRemove', async () => {
      channel.automixRemove();
      expect(await firstValueFrom(channel.automixGroup$)).toBe('none');
    });

    it('weight$', async () => {
      channel.automixSetWeight(0.25396825396825395);
      expect(await firstValueFrom(channel.automixWeight$)).toBe(0.25396825396825395);

      channel.automixSetWeight(0);
      expect(await firstValueFrom(channel.automixWeight$)).toBe(0);

      channel.automixSetWeight(1);
      expect(await firstValueFrom(channel.automixWeight$)).toBe(1);
    });

    it('weightDB$', async () => {
      channel.automixSetWeightDB(-3);
      expect(await firstValueFrom(channel.automixWeightDB$)).toBe(-3);

      channel.automixSetWeightDB(10);
      expect(await firstValueFrom(channel.automixWeightDB$)).toBe(10);

      channel.automixSetWeightDB(-12);
      expect(await firstValueFrom(channel.automixWeightDB$)).toBe(-12);
    });

    it('changeWeightDB', async () => {
      channel.automixSetWeightDB(4);
      channel.automixChangeWeightDB(3);
      expect(await firstValueFrom(channel.automixWeightDB$)).toBe(7);

      channel.automixChangeWeightDB(-10);
      expect(await firstValueFrom(channel.automixWeightDB$)).toBe(-3);
    });

    it('should only work for input channels', () => {
      const playerChannel = conn.master.player(1);
      expect(() => {
        playerChannel.automixAssignGroup('a');
      }).toThrow();
    });
  });

  describe('Multitrack Config', () => {
    it('select', async () => {
      channel.multiTrackSelect();
      expect(await firstValueFrom(channel.multiTrackSelected$)).toBe(1);
    });

    it('unselect', async () => {
      channel.multiTrackUnselect();
      expect(await firstValueFrom(channel.multiTrackSelected$)).toBe(0);
    });

    it('toggle', async () => {
      channel.multiTrackUnselect();
      channel.multiTrackToggle();
      expect(await firstValueFrom(channel.multiTrackSelected$)).toBe(1);

      channel.multiTrackToggle();
      expect(await firstValueFrom(channel.multiTrackSelected$)).toBe(0);
    });

    it('should only work for input and line channels', () => {
      const playerChannel = conn.master.player(1);
      expect(() => playerChannel.multiTrackToggle()).toThrow();
      expect(() => playerChannel.multiTrackSelect()).toThrow();
      expect(() => playerChannel.multiTrackUnselect()).toThrow();
    });
  });
});
