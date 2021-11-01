import { SoundcraftUI } from '../soundcraft-ui';
import { readFirst } from '../utils/testing-utils';
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
    expect(await readFirst(recorder.recording$)).toBe(1);

    conn.conn.sendMessage('SETD^var.isRecording^0');
    expect(await readFirst(recorder.recording$)).toBe(0);
  });

  it('busy$', async () => {
    conn.conn.sendMessage('SETD^var.recBusy^1');
    expect(await readFirst(recorder.busy$)).toBe(1);

    conn.conn.sendMessage('SETD^var.recBusy^0');
    expect(await readFirst(recorder.busy$)).toBe(0);
  });
});
