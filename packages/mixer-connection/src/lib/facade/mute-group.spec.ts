import { describe, it, expect, beforeEach } from 'vitest';
import { firstValueFrom } from 'rxjs';
import { SoundcraftUI } from '../soundcraft-ui';
import { MuteGroup } from './mute-group';

describe('Mute Group', () => {
  let conn: SoundcraftUI;
  let group: MuteGroup;

  beforeEach(() => {
    conn = new SoundcraftUI('0.0.0.0');
    conn.conn.sendMessage('SETD^mgmask^0'); // reset
  });

  it('should return the exact same object', () => {
    const obj1 = conn.muteGroup(2);
    const obj2 = conn.muteGroup(2);
    expect(obj1).toBe(obj2);
  });

  describe('numeric', () => {
    beforeEach(() => (group = conn.muteGroup(2)));

    it('state$', async () => {
      group.mute();
      expect(await firstValueFrom(group.state$)).toBe(1);

      group.unmute();
      expect(await firstValueFrom(group.state$)).toBe(0);
    });

    it('toggle', async () => {
      group.toggle();
      expect(await firstValueFrom(group.state$)).toBe(1);

      group.toggle();
      expect(await firstValueFrom(group.state$)).toBe(0);
    });
  });

  describe('all', () => {
    beforeEach(() => (group = conn.muteGroup('all')));

    it('state$', async () => {
      group.mute();
      expect(await firstValueFrom(group.state$)).toBe(1);

      group.unmute();
      expect(await firstValueFrom(group.state$)).toBe(0);
    });

    it('toggle', async () => {
      group.toggle();
      expect(await firstValueFrom(group.state$)).toBe(1);

      group.toggle();
      expect(await firstValueFrom(group.state$)).toBe(0);
    });
  });

  describe('fx', () => {
    beforeEach(() => (group = conn.muteGroup('fx')));

    it('state$', async () => {
      group.mute();
      expect(await firstValueFrom(group.state$)).toBe(1);

      group.unmute();
      expect(await firstValueFrom(group.state$)).toBe(0);
    });

    it('toggle', async () => {
      group.toggle();
      expect(await firstValueFrom(group.state$)).toBe(1);

      group.toggle();
      expect(await firstValueFrom(group.state$)).toBe(0);
    });
  });
});
