import { firstValueFrom, of } from 'rxjs';
import { SoundcraftUI } from '../soundcraft-ui';
import { MtkState } from '../types';
import { MultiTrackRecorder } from './multi-track-recorder';

describe('Multi-track recorder', () => {
  let conn: SoundcraftUI;
  let mtk: MultiTrackRecorder;

  beforeEach(() => {
    conn = new SoundcraftUI('0.0.0.0');
    mtk = conn.recorderMultiTrack;
  });

  it('state$', async () => {
    conn.conn.sendMessage('SETD^var.mtk.currentState^0');
    expect(await firstValueFrom(mtk.state$)).toBe(MtkState.Stopped);

    conn.conn.sendMessage('SETD^var.mtk.currentState^1');
    expect(await firstValueFrom(mtk.state$)).toBe(MtkState.Paused);

    conn.conn.sendMessage('SETD^var.mtk.currentState^2');
    expect(await firstValueFrom(mtk.state$)).toBe(MtkState.Playing);
  });

  it('session$', async () => {
    conn.conn.sendMessage('SETS^var.mtk.session^0003');
    expect(await firstValueFrom(mtk.session$)).toBe('0003');

    conn.conn.sendMessage('SETS^var.mtk.session^A');
    expect(await firstValueFrom(mtk.session$)).toBe('A');

    conn.conn.sendMessage('SETS^var.mtk.session^ABCDEFG');
    expect(await firstValueFrom(mtk.session$)).toBe('ABCDEFG');
  });

  it('length$', async () => {
    conn.conn.sendMessage('SETD^var.mtk.currentLength^98');
    expect(await firstValueFrom(mtk.length$)).toBe(98);
  });

  it('elapsedTime$', async () => {
    conn.conn.sendMessage('SETD^var.mtk.currentLength^111');
    conn.conn.sendMessage('SETD^var.mtk.currentTrackPos^0.55'); // between 0 and 1
    expect(await firstValueFrom(mtk.elapsedTime$)).toBe(61);
  });

  it('remainingTime$', async () => {
    conn.conn.sendMessage('SETD^var.mtk.currentLength^111');
    conn.conn.sendMessage('SETD^var.mtk.currentTrackPos^0.55'); // between 0 and 1
    expect(await firstValueFrom(mtk.remainingTime$)).toBe(50);
  });

  it('recording$', async () => {
    conn.conn.sendMessage('SETD^var.mtk.rec.currentState^0');
    expect(await firstValueFrom(mtk.recording$)).toBe(0);

    conn.conn.sendMessage('SETD^var.mtk.rec.currentState^1');
    expect(await firstValueFrom(mtk.recording$)).toBe(1);
  });

  it('busy$', async () => {
    conn.conn.sendMessage('SETD^var.mtk.rec.busy^1');
    expect(await firstValueFrom(mtk.busy$)).toBe(1);

    conn.conn.sendMessage('SETD^var.mtk.rec.busy^0');
    expect(await firstValueFrom(mtk.busy$)).toBe(0);
  });

  describe('recordingTime$', () => {
    it('should emit 0 when not recording', async () => {
      conn.conn.sendMessage('SETD^var.mtk.rec.currentState^0');
      conn.conn.sendMessage('SETD^var.mtk.rec.time^23');
      expect(await firstValueFrom(mtk.recordingTime$)).toBe(0);
    });

    it('should emit time when recording', async () => {
      conn.conn.sendMessage('SETD^var.mtk.rec.currentState^1');
      conn.conn.sendMessage('SETD^var.mtk.rec.time^25');
      expect(await firstValueFrom(mtk.recordingTime$)).toBe(25);
    });
  });

  describe('Soundcheck', () => {
    it('soundcheck$', async () => {
      conn.conn.sendMessage('SETD^var.mtk.soundcheck^0');
      expect(await firstValueFrom(mtk.soundcheck$)).toBe(0);

      conn.conn.sendMessage('SETD^var.mtk.soundcheck^1');
      expect(await firstValueFrom(mtk.soundcheck$)).toBe(1);
    });

    it('setSoundcheck', async () => {
      mtk.setSoundcheck(0);
      expect(await firstValueFrom(mtk.soundcheck$)).toBe(0);

      mtk.setSoundcheck(1);
      expect(await firstValueFrom(mtk.soundcheck$)).toBe(1);
    });

    it('activate/deactivateSoundcheck', async () => {
      mtk.activateSoundcheck();
      expect(await firstValueFrom(mtk.soundcheck$)).toBe(1);

      mtk.deactivateSoundcheck();
      expect(await firstValueFrom(mtk.soundcheck$)).toBe(0);
    });

    it('toggleSoundcheck', async () => {
      mtk.setSoundcheck(0);
      mtk.toggleSoundcheck();
      expect(await firstValueFrom(mtk.soundcheck$)).toBe(1);

      mtk.toggleSoundcheck();
      expect(await firstValueFrom(mtk.soundcheck$)).toBe(0);
    });
  });

  describe('Recording Start/Stop', () => {
    beforeEach(() => {
      conn.conn.sendMessage = vi.fn();
    });

    it('recordStart should toggle when stopped', () => {
      mtk.recording$ = of(0); // stopped;
      mtk.recordStart();

      expect(conn.conn.sendMessage).toHaveBeenCalledWith('MTK_REC_TOGGLE');
    });

    it('recordStart should not toggle when recording', () => {
      mtk.recording$ = of(1); // recording;
      mtk.recordStart();

      expect(conn.conn.sendMessage).not.toHaveBeenCalled();
    });

    it('recordStop should toggle when recording', () => {
      mtk.recording$ = of(1); // recording;
      mtk.recordStop();

      expect(conn.conn.sendMessage).toHaveBeenCalledWith('MTK_REC_TOGGLE');
    });

    it('recordStop should not toggle when stopped', () => {
      mtk.recording$ = of(0); // stopped;
      mtk.recordStop();

      expect(conn.conn.sendMessage).not.toHaveBeenCalled();
    });
  });
});
