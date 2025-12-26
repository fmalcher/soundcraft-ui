import { firstValueFrom } from 'rxjs';
import { SoundcraftUI } from '../soundcraft-ui';

describe('FX Bus', () => {
  let conn: SoundcraftUI;

  beforeEach(() => {
    conn = new SoundcraftUI('0.0.0.0');
  });

  it('should return the exact same object', () => {
    const obj1 = conn.fx(2);
    const obj2 = conn.fx(2);
    expect(obj1).toBe(obj2);
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

  describe('params', () => {
    describe('getParam', () => {
      it('should not allow params out of range 1..6', () => {
        expect(() => conn.fx(1).getParam(0)).toThrow();
        expect(() => conn.fx(2).getParam(7)).toThrow();
        expect(() => conn.fx(3).getParam(-3)).toThrow();
        expect(() => conn.fx(4).getParam(9)).toThrow();

        expect(() => conn.fx(4).getParam(3)).not.toThrow();
      });

      it('should return linear values', async () => {
        conn.conn.sendMessage('SETD^f.0.par2^0.66');
        expect(await firstValueFrom(conn.fx(1).getParam(2))).toBe(0.66);

        conn.conn.sendMessage('SETD^f.1.par1^0.123');
        expect(await firstValueFrom(conn.fx(2).getParam(1))).toBe(0.123);

        conn.conn.sendMessage('SETD^f.2.par4^0.75');
        expect(await firstValueFrom(conn.fx(3).getParam(4))).toBe(0.75);

        conn.conn.sendMessage('SETD^f.3.par5^1');
        expect(await firstValueFrom(conn.fx(4).getParam(5))).toBe(1);
      });
    });

    describe('setParam', () => {
      it('should not allow params out of range 1..6', () => {
        expect(() => conn.fx(1).setParam(0, 0.5)).toThrow();
        expect(() => conn.fx(2).setParam(7, 0.4)).toThrow();
        expect(() => conn.fx(3).setParam(-5, 0.6)).toThrow();
        expect(() => conn.fx(4).setParam(10, 0.3)).toThrow();

        expect(() => conn.fx(4).setParam(3, 0.3)).not.toThrow();
      });

      it('should set FX params', async () => {
        conn.fx(1).setParam(6, 0.55);
        expect(await firstValueFrom(conn.fx(1).getParam(6))).toBe(0.55);

        conn.fx(2).setParam(5, 1);
        expect(await firstValueFrom(conn.fx(2).getParam(5))).toBe(1);

        conn.fx(3).setParam(4, 0);
        expect(await firstValueFrom(conn.fx(3).getParam(4))).toBe(0);

        conn.fx(4).setParam(3, 0.112233);
        expect(await firstValueFrom(conn.fx(4).getParam(3))).toBe(0.112233);
      });

      it('should send messages to set params', () => {
        conn.conn.sendMessage = vi.fn();

        conn.fx(1).setParam(1, 0.55);
        expect(conn.conn.sendMessage).toHaveBeenCalledWith('SETD^f.0.par1^0.55');

        conn.fx(2).setParam(6, 0.1111);
        expect(conn.conn.sendMessage).toHaveBeenCalledWith('SETD^f.1.par6^0.1111');

        conn.fx(4).setParam(2, 1);
        expect(conn.conn.sendMessage).toHaveBeenCalledWith('SETD^f.3.par2^1');
      });
    });
  });
});
