import { firstValueFrom } from 'rxjs';
import { SoundcraftUI } from '../soundcraft-ui';

describe('FX Bus', () => {
  let conn: SoundcraftUI;

  beforeEach(() => {
    conn = new SoundcraftUI('0.0.0.0');
  });

  it('fxType$', async () => {
    conn.conn.sendMessage('SETD^f.1.fxtype^0');
    expect(await firstValueFrom(conn.fx(2).fxType$)).toBe(0);

    conn.conn.sendMessage('SETD^f.2.fxtype^1');
    expect(await firstValueFrom(conn.fx(3).fxType$)).toBe(1);

    conn.conn.sendMessage('SETD^f.3.fxtype^2');
    expect(await firstValueFrom(conn.fx(4).fxType$)).toBe(2);

    conn.conn.sendMessage('SETD^f.0.fxtype^3');
    expect(await firstValueFrom(conn.fx(1).fxType$)).toBe(3);
  });

  it('bpm$', async () => {
    const bus = conn.fx(2);

    conn.conn.sendMessage('SETD^f.1.bpm^111');
    expect(await firstValueFrom(bus.bpm$)).toBe(111);

    bus.setBpm(100);
    expect(await firstValueFrom(bus.bpm$)).toBe(100);

    bus.setBpm(60);
    expect(await firstValueFrom(bus.bpm$)).toBe(60);
  });
});
