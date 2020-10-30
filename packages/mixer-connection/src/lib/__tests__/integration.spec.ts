import { SoundcraftUI } from '../soundcraft-ui';

describe('Outbound messages', () => {
  let conn: SoundcraftUI;
  let message: string;

  beforeEach(() => {
    conn = new SoundcraftUI('127.0.0.1');

    message = undefined;
    conn.conn.sendMessage = msg => (message = msg);
  });

  describe('Master dim', () => {
    it('dim', () => {
      conn.master.dim();
      expect(message).toMatchInlineSnapshot(`"SETD^m.dim^1"`);
    });

    it('undim', () => {
      conn.master.undim();
      expect(message).toMatchInlineSnapshot(`"SETD^m.dim^0"`);
    });

    it('set fader level', () => {
      conn.master.setFaderLevel(0.22222);
      expect(message).toMatchInlineSnapshot(`"SETD^m.mix^0.22222"`);
    });
  });

  describe('Master channel mute', () => {
    it('input mute', () => {
      conn.master.input(3).mute();
      expect(message).toMatchInlineSnapshot(`"SETD^i.2.mute^1"`);
    });

    it('input unmute', () => {
      conn.master.input(3).unmute();
      expect(message).toMatchInlineSnapshot(`"SETD^i.2.mute^0"`);
    });

    it('player mute', () => {
      conn.master.player(1).mute();
      expect(message).toMatchInlineSnapshot(`"SETD^p.0.mute^1"`);
    });

    it('player unmute', () => {
      conn.master.player(1).unmute();
      expect(message).toMatchInlineSnapshot(`"SETD^p.0.mute^0"`);
    });

    it('line mute', () => {
      conn.master.line(1).mute();
      expect(message).toMatchInlineSnapshot(`"SETD^l.0.mute^1"`);
    });

    it('line unmute', () => {
      conn.master.line(1).unmute();
      expect(message).toMatchInlineSnapshot(`"SETD^l.0.mute^0"`);
    });

    it('aux mute', () => {
      conn.master.aux(2).mute();
      expect(message).toMatchInlineSnapshot(`"SETD^a.1.mute^1"`);
    });

    it('aux unmute', () => {
      conn.master.aux(2).unmute();
      expect(message).toMatchInlineSnapshot(`"SETD^a.1.mute^0"`);
    });

    it('fx mute', () => {
      conn.master.fx(2).mute();
      expect(message).toMatchInlineSnapshot(`"SETD^f.1.mute^1"`);
    });

    it('aux unmute', () => {
      conn.master.fx(2).unmute();
      expect(message).toMatchInlineSnapshot(`"SETD^f.1.mute^0"`);
    });

    it('Sub mute', () => {
      conn.master.sub(2).mute();
      expect(message).toMatchInlineSnapshot(`"SETD^s.1.mute^1"`);
    });

    it('Sub unmute', () => {
      conn.master.sub(2).unmute();
      expect(message).toMatchInlineSnapshot(`"SETD^s.1.mute^0"`);
    });

    it('VCA mute', () => {
      conn.master.vca(2).mute();
      expect(message).toMatchInlineSnapshot(`"SETD^v.1.mute^1"`);
    });

    it('VCA unmute', () => {
      conn.master.vca(2).unmute();
      expect(message).toMatchInlineSnapshot(`"SETD^v.1.mute^0"`);
    });
  });

  describe('Master channel solo', () => {
    it('input solo', () => {
      conn.master.input(3).solo();
      expect(message).toMatchInlineSnapshot(`"SETD^i.2.solo^1"`);
    });

    it('input unsolo', () => {
      conn.master.input(3).unsolo();
      expect(message).toMatchInlineSnapshot(`"SETD^i.2.solo^0"`);
    });

    it('player solo', () => {
      conn.master.player(1).solo();
      expect(message).toMatchInlineSnapshot(`"SETD^p.0.solo^1"`);
    });

    it('player unsolo', () => {
      conn.master.player(1).unsolo();
      expect(message).toMatchInlineSnapshot(`"SETD^p.0.solo^0"`);
    });

    it('line solo', () => {
      conn.master.line(1).solo();
      expect(message).toMatchInlineSnapshot(`"SETD^l.0.solo^1"`);
    });

    it('line unsolo', () => {
      conn.master.line(1).unsolo();
      expect(message).toMatchInlineSnapshot(`"SETD^l.0.solo^0"`);
    });

    it('aux solo', () => {
      conn.master.aux(2).solo();
      expect(message).toMatchInlineSnapshot(`"SETD^a.1.solo^1"`);
    });

    it('aux unsolo', () => {
      conn.master.aux(2).unsolo();
      expect(message).toMatchInlineSnapshot(`"SETD^a.1.solo^0"`);
    });

    it('fx solo', () => {
      conn.master.fx(2).solo();
      expect(message).toMatchInlineSnapshot(`"SETD^f.1.solo^1"`);
    });

    it('fx unsolo', () => {
      conn.master.fx(2).unsolo();
      expect(message).toMatchInlineSnapshot(`"SETD^f.1.solo^0"`);
    });

    it('Sub solo', () => {
      conn.master.sub(2).solo();
      expect(message).toMatchInlineSnapshot(`"SETD^s.1.solo^1"`);
    });

    it('Sub unsolo', () => {
      conn.master.sub(2).unsolo();
      expect(message).toMatchInlineSnapshot(`"SETD^s.1.solo^0"`);
    });

    it('VCA solo', () => {
      conn.master.vca(2).solo();
      expect(message).toMatchInlineSnapshot(`"SETD^v.1.solo^1"`);
    });

    it('VCA unsolo', () => {
      conn.master.vca(2).unsolo();
      expect(message).toMatchInlineSnapshot(`"SETD^v.1.solo^0"`);
    });
  });

  describe('Master channel fader level', () => {
    it('input fader level', () => {
      conn.master.input(3).setFaderLevel(0.12345);
      expect(message).toMatchInlineSnapshot(`"SETD^i.2.mix^0.12345"`);
    });

    it('player fader level', () => {
      conn.master.player(1).setFaderLevel(0.12345);
      expect(message).toMatchInlineSnapshot(`"SETD^p.0.mix^0.12345"`);
    });

    it('line fader level', () => {
      conn.master.line(1).setFaderLevel(0.12345);
      expect(message).toMatchInlineSnapshot(`"SETD^l.0.mix^0.12345"`);
    });

    it('aux fader level', () => {
      conn.master.aux(2).setFaderLevel(0.12345);
      expect(message).toMatchInlineSnapshot(`"SETD^a.1.mix^0.12345"`);
    });

    it('fx fader level', () => {
      conn.master.fx(2).setFaderLevel(0.12345);
      expect(message).toMatchInlineSnapshot(`"SETD^f.1.mix^0.12345"`);
    });

    it('Sub fader level', () => {
      conn.master.sub(2).setFaderLevel(0.12345);
      expect(message).toMatchInlineSnapshot(`"SETD^s.1.mix^0.12345"`);
    });

    it('VCA fader level', () => {
      conn.master.vca(2).setFaderLevel(0.12345);
      expect(message).toMatchInlineSnapshot(`"SETD^v.1.mix^0.12345"`);
    });
  });
});
