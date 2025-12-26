import { describe, it, expect, beforeEach } from 'vitest';
import { firstValueFrom } from 'rxjs';
import { SoundcraftUI } from '../soundcraft-ui';
import { Easings } from '../utils/transitions/easings';
import { Channel } from './channel';

describe('Channel', () => {
  let conn: SoundcraftUI;
  let channel: Channel;

  beforeEach(() => {
    conn = new SoundcraftUI('0.0.0.0');
    channel = conn.master.input(2);
  });

  it('should return the exact same channel object', () => {
    const obj1 = conn.master.input(2);
    const obj2 = conn.master.input(2);
    expect(obj1).toBe(obj2);
  });

  describe('Fader Level', () => {
    it('faderLevel$', async () => {
      channel.setFaderLevel(0.5);
      expect(await firstValueFrom(channel.faderLevel$)).toBe(0.5);

      channel.setFaderLevel(0.8889);
      expect(await firstValueFrom(channel.faderLevel$)).toBe(0.8889);

      channel.setFaderLevelDB(0);
      expect(await firstValueFrom(channel.faderLevel$)).toBe(0.76470588235);
    });

    it('faderLevelDB$', async () => {
      channel.setFaderLevelDB(-6);
      expect(await firstValueFrom(channel.faderLevelDB$)).toBe(-6);

      channel.setFaderLevelDB(-12);
      expect(await firstValueFrom(channel.faderLevelDB$)).toBe(-12);

      channel.setFaderLevel(0.76470588235);
      expect(await firstValueFrom(channel.faderLevelDB$)).toBe(0);
    });

    it('changeFaderLevelDB', async () => {
      channel.setFaderLevelDB(-12);
      channel.changeFaderLevelDB(3);
      expect(await firstValueFrom(channel.faderLevelDB$)).toBe(-9);

      channel.changeFaderLevelDB(-6);
      expect(await firstValueFrom(channel.faderLevelDB$)).toBe(-15);
    });

    it('should change level from -Infinity dB upwards', async () => {
      channel.setFaderLevel(0); // -Infinity dB
      channel.changeFaderLevelDB(3);

      expect(await firstValueFrom(channel.faderLevelDB$)).toBe(-97);
      expect(await firstValueFrom(channel.faderLevel$)).not.toBe(0);
    });
  });

  describe('MUTE', () => {
    it('mute$', async () => {
      channel.mute();
      expect(await firstValueFrom(channel.mute$)).toBe(1);

      channel.unmute();
      expect(await firstValueFrom(channel.mute$)).toBe(0);

      channel.setMute(1);
      expect(await firstValueFrom(channel.mute$)).toBe(1);
    });

    it('toggleMute', async () => {
      channel.setMute(0);
      channel.toggleMute();
      expect(await firstValueFrom(channel.mute$)).toBe(1);

      channel.toggleMute();
      expect(await firstValueFrom(channel.mute$)).toBe(0);
    });
  });

  describe('Fades', () => {
    let results: number[];

    beforeEach(() => {
      vi.useFakeTimers();
      results = [];
    });

    afterEach(() => vi.useRealTimers());

    describe('fadeTo', () => {
      beforeEach(() => {
        channel.faderLevel$.subscribe(e => results.push(e));
      });

      it('Linear', () => {
        channel.setFaderLevel(0.3);
        channel.fadeTo(0.8, 1000, Easings.Linear);
        vi.advanceTimersByTime(1000);
        expect(results).toMatchSnapshot();
      });

      it('EaseIn', () => {
        channel.setFaderLevel(1);
        channel.fadeTo(0.2, 1000, Easings.EaseIn);
        vi.advanceTimersByTime(1000);
        expect(results).toMatchSnapshot();
      });

      it('EaseOut', () => {
        channel.setFaderLevel(0.7);
        channel.fadeTo(0.9, 1000, Easings.EaseOut);
        vi.advanceTimersByTime(1000);
        expect(results).toMatchSnapshot();
      });

      it('EaseInOut', () => {
        channel.setFaderLevel(0.1);
        channel.fadeTo(0.4, 1000, Easings.EaseInOut);
        vi.advanceTimersByTime(1000);
        expect(results).toMatchSnapshot();
      });
    });

    describe('fadeToDB', () => {
      beforeEach(() => {
        channel.faderLevelDB$.subscribe(e => results.push(e));
      });

      it('Linear', () => {
        channel.setFaderLevelDB(-60);
        channel.fadeToDB(-3, 1000, Easings.Linear);
        vi.advanceTimersByTime(1000);
        expect(results).toMatchSnapshot();
      });

      it('EaseIn', () => {
        channel.setFaderLevelDB(3);
        channel.fadeToDB(-15, 1000, Easings.EaseIn);
        vi.advanceTimersByTime(1000);
        expect(results).toMatchSnapshot();
      });

      it('EaseOut', () => {
        channel.setFaderLevelDB(3);
        channel.fadeToDB(-15, 1000, Easings.EaseOut);
        vi.advanceTimersByTime(1000);
        expect(results).toMatchSnapshot();
      });

      it('EaseInOut', () => {
        channel.setFaderLevelDB(6);
        channel.fadeToDB(-6, 1000, Easings.EaseInOut);
        vi.advanceTimersByTime(1000);
        expect(results).toMatchSnapshot();
      });
    });

    describe('Channel Name', () => {
      describe('name$', () => {
        it('should read name for master channels', async () => {
          conn.conn.sendMessage('SETS^i.3.name^TESTNAME');
          expect(await firstValueFrom(conn.master.input(4).name$)).toBe('TESTNAME');

          conn.conn.sendMessage('SETS^p.0.name^PLAYER');
          expect(await firstValueFrom(conn.master.player(1).name$)).toBe('PLAYER');

          conn.conn.sendMessage('SETS^l.1.name^THELINE');
          expect(await firstValueFrom(conn.master.line(2).name$)).toBe('THELINE');

          conn.conn.sendMessage('SETS^s.3.name^SUBGROUP');
          expect(await firstValueFrom(conn.master.sub(4).name$)).toBe('SUBGROUP');

          conn.conn.sendMessage('SETS^a.4.name^AUXMASTER');
          expect(await firstValueFrom(conn.master.aux(5).name$)).toBe('AUXMASTER');

          conn.conn.sendMessage('SETS^v.1.name^THEVCA');
          expect(await firstValueFrom(conn.master.vca(2).name$)).toBe('THEVCA');
        });

        it('should read name for channels on AUX and FX buses', async () => {
          conn.conn.sendMessage('SETS^i.1.name^FOOBAR');
          expect(await firstValueFrom(conn.aux(2).input(2).name$)).toBe('FOOBAR');

          conn.conn.sendMessage('SETS^i.4.name^BARFOO');
          expect(await firstValueFrom(conn.fx(3).input(5).name$)).toBe('BARFOO');

          conn.conn.sendMessage('SETS^p.1.name^THEPLAYER');
          expect(await firstValueFrom(conn.aux(1).player(2).name$)).toBe('THEPLAYER');
        });

        it('should return generic readable name (CH 6) when no name is set', async () => {
          conn.conn.sendMessage('SETS^i.5.name^');
          expect(await firstValueFrom(conn.master.input(6).name$)).toBe('CH 6');
        });
      });

      describe('setName', () => {
        it('should set the channel name', async () => {
          conn.master.input(3).setName('TESTNAME');
          expect(await firstValueFrom(conn.master.input(3).name$)).toBe('TESTNAME');

          conn.master.player(1).setName('TESTNAME');
          expect(await firstValueFrom(conn.master.player(1).name$)).toBe('TESTNAME');

          conn.master.fx(3).setName('FXNAME');
          expect(await firstValueFrom(conn.master.fx(3).name$)).toBe('FXNAME');

          conn.master.aux(6).setName('AUXNAME');
          expect(await firstValueFrom(conn.master.aux(6).name$)).toBe('AUXNAME');

          conn.master.sub(3).setName('SUBGROUP');
          expect(await firstValueFrom(conn.master.sub(3).name$)).toBe('SUBGROUP');

          conn.master.vca(2).setName('THEVCA');
          expect(await firstValueFrom(conn.master.vca(2).name$)).toBe('THEVCA');

          conn.aux(2).input(4).setName('FOOBAR');
          expect(await firstValueFrom(conn.aux(2).input(4).name$)).toBe('FOOBAR');

          conn.fx(3).input(1).setName('BARFOO');
          expect(await firstValueFrom(conn.fx(3).input(1).name$)).toBe('BARFOO');
        });
      });
    });
  });
});
