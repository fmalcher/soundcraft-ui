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
    const channel1 = conn.master.input(2);
    const channel2 = conn.master.input(2);
    expect(channel1).toBe(channel2);
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
      jest.useFakeTimers();
      results = [];
    });

    afterEach(() => jest.useRealTimers());

    describe('fadeTo', () => {
      beforeEach(() => {
        channel.faderLevel$.subscribe(e => results.push(e));
      });

      it('Linear', () => {
        channel.setFaderLevel(0.3);
        channel.fadeTo(0.8, 1000, Easings.Linear);
        jest.advanceTimersByTime(1000);
        expect(results).toMatchSnapshot();
      });

      it('EaseIn', () => {
        channel.setFaderLevel(1);
        channel.fadeTo(0.2, 1000, Easings.EaseIn);
        jest.advanceTimersByTime(1000);
        expect(results).toMatchSnapshot();
      });

      it('EaseOut', () => {
        channel.setFaderLevel(0.7);
        channel.fadeTo(0.9, 1000, Easings.EaseOut);
        jest.advanceTimersByTime(1000);
        expect(results).toMatchSnapshot();
      });

      it('EaseInOut', () => {
        channel.setFaderLevel(0.1);
        channel.fadeTo(0.4, 1000, Easings.EaseInOut);
        jest.advanceTimersByTime(1000);
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
        jest.advanceTimersByTime(1000);
        expect(results).toMatchSnapshot();
      });

      it('EaseIn', () => {
        channel.setFaderLevelDB(3);
        channel.fadeToDB(-15, 1000, Easings.EaseIn);
        jest.advanceTimersByTime(1000);
        expect(results).toMatchSnapshot();
      });

      it('EaseOut', () => {
        channel.setFaderLevelDB(3);
        channel.fadeToDB(-15, 1000, Easings.EaseOut);
        jest.advanceTimersByTime(1000);
        expect(results).toMatchSnapshot();
      });

      it('EaseInOut', () => {
        channel.setFaderLevelDB(6);
        channel.fadeToDB(-6, 1000, Easings.EaseInOut);
        jest.advanceTimersByTime(1000);
        expect(results).toMatchSnapshot();
      });
    });
  });
});
