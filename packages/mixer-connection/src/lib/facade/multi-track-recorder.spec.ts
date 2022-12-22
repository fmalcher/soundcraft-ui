import { firstValueFrom } from 'rxjs';
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
});
