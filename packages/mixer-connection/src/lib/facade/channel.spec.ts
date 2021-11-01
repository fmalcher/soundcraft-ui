import { SoundcraftUI } from '../soundcraft-ui';
import { readFirst } from '../utils/testing-utils';
import { Easings } from '../utils/transitions/easings';
import { Channel } from './channel';

describe('Channel', () => {
  let conn: SoundcraftUI;
  let channel: Channel;

  beforeEach(() => {
    conn = new SoundcraftUI('0.0.0.0');
    channel = conn.master.input(2);
  });

  describe('Fader Level', () => {
    it('faderLevel$', async () => {
      channel.setFaderLevel(0.5);
      expect(await readFirst(channel.faderLevel$)).toBe(0.5);

      channel.setFaderLevel(0.8889);
      expect(await readFirst(channel.faderLevel$)).toBe(0.8889);

      channel.setFaderLevelDB(0);
      expect(await readFirst(channel.faderLevel$)).toBe(0.76470588235);
    });

    it('faderLevelDB$', async () => {
      channel.setFaderLevelDB(-6);
      expect(await readFirst(channel.faderLevelDB$)).toBe(-6);

      channel.setFaderLevelDB(-12);
      expect(await readFirst(channel.faderLevelDB$)).toBe(-12);

      channel.setFaderLevel(0.76470588235);
      expect(await readFirst(channel.faderLevelDB$)).toBe(0);
    });

    it('changeFaderLevelDB', async () => {
      channel.setFaderLevelDB(-12);
      channel.changeFaderLevelDB(3);
      expect(await readFirst(channel.faderLevelDB$)).toBe(-9);

      channel.changeFaderLevelDB(-6);
      expect(await readFirst(channel.faderLevelDB$)).toBe(-15);
    });
  });

  describe('MUTE', () => {
    it('mute$', async () => {
      channel.mute();
      expect(await readFirst(channel.mute$)).toBe(1);

      channel.unmute();
      expect(await readFirst(channel.mute$)).toBe(0);

      channel.setMute(1);
      expect(await readFirst(channel.mute$)).toBe(1);
    });

    it('toggleMute', async () => {
      channel.setMute(0);
      channel.toggleMute();
      expect(await readFirst(channel.mute$)).toBe(1);

      channel.toggleMute();
      expect(await readFirst(channel.mute$)).toBe(0);
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
