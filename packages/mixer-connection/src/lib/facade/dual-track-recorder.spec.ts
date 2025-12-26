import { firstValueFrom, of } from 'rxjs';
import { SoundcraftUI } from '../soundcraft-ui';
import { DualTrackRecorder } from './dual-track-recorder';

describe('DualTrackRecorder', () => {
  let conn: SoundcraftUI;
  let recorder: DualTrackRecorder;

  beforeEach(() => {
    conn = new SoundcraftUI('0.0.0.0');
    recorder = conn.recorderDualTrack;
  });

  it('recording$', async () => {
    conn.conn.sendMessage('SETD^var.isRecording^1');
    expect(await firstValueFrom(recorder.recording$)).toBe(1);

    conn.conn.sendMessage('SETD^var.isRecording^0');
    expect(await firstValueFrom(recorder.recording$)).toBe(0);
  });

  it('busy$', async () => {
    conn.conn.sendMessage('SETD^var.recBusy^1');
    expect(await firstValueFrom(recorder.busy$)).toBe(1);

    conn.conn.sendMessage('SETD^var.recBusy^0');
    expect(await firstValueFrom(recorder.busy$)).toBe(0);
  });

  describe('Recording Start/Stop', () => {
    beforeEach(() => {
      conn.conn.sendMessage = vi.fn();
    });

    it('recordStart should toggle when stopped', () => {
      recorder.recording$ = of(0); // stopped;
      recorder.recordStart();

      expect(conn.conn.sendMessage).toHaveBeenCalledWith('RECTOGGLE');
    });

    it('recordStart should not toggle when recording', () => {
      recorder.recording$ = of(1); // recording;
      recorder.recordStart();

      expect(conn.conn.sendMessage).not.toHaveBeenCalled();
    });

    it('recordStop should toggle when recording', () => {
      recorder.recording$ = of(1); // recording;
      recorder.recordStop();

      expect(conn.conn.sendMessage).toHaveBeenCalledWith('RECTOGGLE');
    });

    it('recordStop should not toggle when stopped', () => {
      recorder.recording$ = of(0); // stopped;
      recorder.recordStop();

      expect(conn.conn.sendMessage).not.toHaveBeenCalled();
    });
  });
});
