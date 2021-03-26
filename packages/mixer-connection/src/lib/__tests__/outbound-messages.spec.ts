import { SoundcraftUI } from '../soundcraft-ui';

describe('Outbound messages', () => {
  let conn: SoundcraftUI;
  let message: string;

  beforeEach(() => {
    conn = new SoundcraftUI('127.0.0.1');

    message = undefined;
    conn.conn.sendMessage = msg => (message = msg);
  });

  it('master', () => {
    conn.master.setFaderLevel(0.8);
    expect(message).toMatchInlineSnapshot(`"SETD^m.mix^0.8"`);

    conn.master.setFaderLevelDB(3);
    expect(message).toMatchInlineSnapshot(`"SETD^m.mix^0.84375627202"`);

    conn.master.pan(0.3);
    expect(message).toMatchInlineSnapshot(`"SETD^m.pan^0.3"`);

    conn.master.dim();
    expect(message).toMatchInlineSnapshot(`"SETD^m.dim^1"`);

    conn.master.undim();
    expect(message).toMatchInlineSnapshot(`"SETD^m.dim^0"`);

    conn.master.setDim(1);
    expect(message).toMatchInlineSnapshot(`"SETD^m.dim^1"`);

    conn.master.setDim(0);
    expect(message).toMatchInlineSnapshot(`"SETD^m.dim^0"`);
  });

  it('master channels INPUT', () => {
    conn.master.input(3).setFaderLevel(0.4);
    expect(message).toMatchInlineSnapshot(`"SETD^i.2.mix^0.4"`);

    conn.master.input(3).setFaderLevelDB(-12);
    expect(message).toMatchInlineSnapshot(`"SETD^i.2.mix^0.49333689432"`);

    conn.master.input(3).setMute(1);
    expect(message).toMatchInlineSnapshot(`"SETD^i.2.mute^1"`);

    conn.master.input(3).setMute(0);
    expect(message).toMatchInlineSnapshot(`"SETD^i.2.mute^0"`);

    conn.master.input(3).mute();
    expect(message).toMatchInlineSnapshot(`"SETD^i.2.mute^1"`);

    conn.master.input(3).unmute();
    expect(message).toMatchInlineSnapshot(`"SETD^i.2.mute^0"`);

    conn.master.input(3).pan(0.78);
    expect(message).toMatchInlineSnapshot(`"SETD^i.2.pan^0.78"`);

    conn.master.input(3).setSolo(0);
    expect(message).toMatchInlineSnapshot(`"SETD^i.2.solo^0"`);

    conn.master.input(3).setSolo(1);
    expect(message).toMatchInlineSnapshot(`"SETD^i.2.solo^1"`);

    conn.master.input(3).solo();
    expect(message).toMatchInlineSnapshot(`"SETD^i.2.solo^1"`);

    conn.master.input(3).unsolo();
    expect(message).toMatchInlineSnapshot(`"SETD^i.2.solo^0"`);
  });

  it('master channels LINE', () => {
    conn.master.line(1).setFaderLevel(0.4);
    expect(message).toMatchInlineSnapshot(`"SETD^l.0.mix^0.4"`);

    conn.master.line(1).setFaderLevelDB(-12);
    expect(message).toMatchInlineSnapshot(`"SETD^l.0.mix^0.49333689432"`);

    conn.master.line(1).setMute(1);
    expect(message).toMatchInlineSnapshot(`"SETD^l.0.mute^1"`);

    conn.master.line(1).setMute(0);
    expect(message).toMatchInlineSnapshot(`"SETD^l.0.mute^0"`);

    conn.master.line(1).mute();
    expect(message).toMatchInlineSnapshot(`"SETD^l.0.mute^1"`);

    conn.master.line(1).unmute();
    expect(message).toMatchInlineSnapshot(`"SETD^l.0.mute^0"`);

    conn.master.line(1).pan(0.78);
    expect(message).toMatchInlineSnapshot(`"SETD^l.0.pan^0.78"`);

    conn.master.line(1).setSolo(0);
    expect(message).toMatchInlineSnapshot(`"SETD^l.0.solo^0"`);

    conn.master.line(1).setSolo(1);
    expect(message).toMatchInlineSnapshot(`"SETD^l.0.solo^1"`);

    conn.master.line(1).solo();
    expect(message).toMatchInlineSnapshot(`"SETD^l.0.solo^1"`);

    conn.master.line(1).unsolo();
    expect(message).toMatchInlineSnapshot(`"SETD^l.0.solo^0"`);
  });

  it('master channels PLAYER', () => {
    conn.master.player(2).setFaderLevel(0.4);
    expect(message).toMatchInlineSnapshot(`"SETD^p.1.mix^0.4"`);

    conn.master.player(2).setFaderLevelDB(-12);
    expect(message).toMatchInlineSnapshot(`"SETD^p.1.mix^0.49333689432"`);

    conn.master.player(2).setMute(1);
    expect(message).toMatchInlineSnapshot(`"SETD^p.1.mute^1"`);

    conn.master.player(2).setMute(0);
    expect(message).toMatchInlineSnapshot(`"SETD^p.1.mute^0"`);

    conn.master.player(2).mute();
    expect(message).toMatchInlineSnapshot(`"SETD^p.1.mute^1"`);

    conn.master.player(2).unmute();
    expect(message).toMatchInlineSnapshot(`"SETD^p.1.mute^0"`);

    conn.master.player(2).pan(0.78);
    expect(message).toMatchInlineSnapshot(`"SETD^p.1.pan^0.78"`);

    conn.master.player(2).setSolo(0);
    expect(message).toMatchInlineSnapshot(`"SETD^p.1.solo^0"`);

    conn.master.player(2).setSolo(1);
    expect(message).toMatchInlineSnapshot(`"SETD^p.1.solo^1"`);

    conn.master.player(2).solo();
    expect(message).toMatchInlineSnapshot(`"SETD^p.1.solo^1"`);

    conn.master.player(2).unsolo();
    expect(message).toMatchInlineSnapshot(`"SETD^p.1.solo^0"`);
  });

  it('master channels AUX', () => {
    conn.master.aux(1).setFaderLevel(0.4);
    expect(message).toMatchInlineSnapshot(`"SETD^a.0.mix^0.4"`);

    conn.master.aux(1).setFaderLevelDB(-12);
    expect(message).toMatchInlineSnapshot(`"SETD^a.0.mix^0.49333689432"`);

    conn.master.aux(1).setMute(1);
    expect(message).toMatchInlineSnapshot(`"SETD^a.0.mute^1"`);

    conn.master.aux(1).setMute(0);
    expect(message).toMatchInlineSnapshot(`"SETD^a.0.mute^0"`);

    conn.master.aux(1).mute();
    expect(message).toMatchInlineSnapshot(`"SETD^a.0.mute^1"`);

    conn.master.aux(1).unmute();
    expect(message).toMatchInlineSnapshot(`"SETD^a.0.mute^0"`);

    conn.master.aux(1).pan(0.78);
    expect(message).toMatchInlineSnapshot(`"SETD^a.0.pan^0.78"`);

    conn.master.aux(1).setSolo(0);
    expect(message).toMatchInlineSnapshot(`"SETD^a.0.solo^0"`);

    conn.master.aux(1).setSolo(1);
    expect(message).toMatchInlineSnapshot(`"SETD^a.0.solo^1"`);

    conn.master.aux(1).solo();
    expect(message).toMatchInlineSnapshot(`"SETD^a.0.solo^1"`);

    conn.master.aux(1).unsolo();
    expect(message).toMatchInlineSnapshot(`"SETD^a.0.solo^0"`);
  });

  it('master channels FX', () => {
    conn.master.fx(3).setFaderLevel(0.4);
    expect(message).toMatchInlineSnapshot(`"SETD^f.2.mix^0.4"`);

    conn.master.fx(3).setFaderLevelDB(-12);
    expect(message).toMatchInlineSnapshot(`"SETD^f.2.mix^0.49333689432"`);

    conn.master.fx(3).setMute(1);
    expect(message).toMatchInlineSnapshot(`"SETD^f.2.mute^1"`);

    conn.master.fx(3).setMute(0);
    expect(message).toMatchInlineSnapshot(`"SETD^f.2.mute^0"`);

    conn.master.fx(3).mute();
    expect(message).toMatchInlineSnapshot(`"SETD^f.2.mute^1"`);

    conn.master.fx(3).unmute();
    expect(message).toMatchInlineSnapshot(`"SETD^f.2.mute^0"`);

    conn.master.fx(3).pan(0.78);
    expect(message).toMatchInlineSnapshot(`"SETD^f.2.pan^0.78"`);

    conn.master.fx(3).setSolo(0);
    expect(message).toMatchInlineSnapshot(`"SETD^f.2.solo^0"`);

    conn.master.fx(3).setSolo(1);
    expect(message).toMatchInlineSnapshot(`"SETD^f.2.solo^1"`);

    conn.master.fx(3).solo();
    expect(message).toMatchInlineSnapshot(`"SETD^f.2.solo^1"`);

    conn.master.fx(3).unsolo();
    expect(message).toMatchInlineSnapshot(`"SETD^f.2.solo^0"`);
  });

  it('master channels SUB', () => {
    conn.master.sub(4).setFaderLevel(0.4);
    expect(message).toMatchInlineSnapshot(`"SETD^s.3.mix^0.4"`);

    conn.master.sub(4).setFaderLevelDB(-12);
    expect(message).toMatchInlineSnapshot(`"SETD^s.3.mix^0.49333689432"`);

    conn.master.sub(4).setMute(1);
    expect(message).toMatchInlineSnapshot(`"SETD^s.3.mute^1"`);

    conn.master.sub(4).setMute(0);
    expect(message).toMatchInlineSnapshot(`"SETD^s.3.mute^0"`);

    conn.master.sub(4).mute();
    expect(message).toMatchInlineSnapshot(`"SETD^s.3.mute^1"`);

    conn.master.sub(4).unmute();
    expect(message).toMatchInlineSnapshot(`"SETD^s.3.mute^0"`);

    conn.master.sub(4).pan(0.78);
    expect(message).toMatchInlineSnapshot(`"SETD^s.3.pan^0.78"`);

    conn.master.sub(4).setSolo(0);
    expect(message).toMatchInlineSnapshot(`"SETD^s.3.solo^0"`);

    conn.master.sub(4).setSolo(1);
    expect(message).toMatchInlineSnapshot(`"SETD^s.3.solo^1"`);

    conn.master.sub(4).solo();
    expect(message).toMatchInlineSnapshot(`"SETD^s.3.solo^1"`);

    conn.master.sub(4).unsolo();
    expect(message).toMatchInlineSnapshot(`"SETD^s.3.solo^0"`);
  });

  it('master channels VCA', () => {
    conn.master.vca(3).setFaderLevel(0.4);
    expect(message).toMatchInlineSnapshot(`"SETD^v.2.mix^0.4"`);

    conn.master.vca(3).setFaderLevelDB(-12);
    expect(message).toMatchInlineSnapshot(`"SETD^v.2.mix^0.49333689432"`);

    conn.master.vca(3).setMute(1);
    expect(message).toMatchInlineSnapshot(`"SETD^v.2.mute^1"`);

    conn.master.vca(3).setMute(0);
    expect(message).toMatchInlineSnapshot(`"SETD^v.2.mute^0"`);

    conn.master.vca(3).mute();
    expect(message).toMatchInlineSnapshot(`"SETD^v.2.mute^1"`);

    conn.master.vca(3).unmute();
    expect(message).toMatchInlineSnapshot(`"SETD^v.2.mute^0"`);

    conn.master.vca(3).pan(0.78);
    expect(message).toMatchInlineSnapshot(`"SETD^v.2.pan^0.78"`);

    conn.master.vca(3).setSolo(0);
    expect(message).toMatchInlineSnapshot(`"SETD^v.2.solo^0"`);

    conn.master.vca(3).setSolo(1);
    expect(message).toMatchInlineSnapshot(`"SETD^v.2.solo^1"`);

    conn.master.vca(3).solo();
    expect(message).toMatchInlineSnapshot(`"SETD^v.2.solo^1"`);

    conn.master.vca(3).unsolo();
    expect(message).toMatchInlineSnapshot(`"SETD^v.2.solo^0"`);
  });

  it('AUX channels INPUT', () => {
    conn.aux(2).input(7).setFaderLevel(0.897);
    expect(message).toMatchInlineSnapshot(`"SETD^i.6.aux.1.value^0.897"`);

    conn.aux(2).input(7).setFaderLevelDB(6);
    expect(message).toMatchInlineSnapshot(`"SETD^i.6.aux.1.value^0.91653908203"`);

    conn.aux(2).input(7).setMute(1);
    expect(message).toMatchInlineSnapshot(`"SETD^i.6.aux.1.mute^1"`);

    conn.aux(2).input(7).setMute(0);
    expect(message).toMatchInlineSnapshot(`"SETD^i.6.aux.1.mute^0"`);

    conn.aux(2).input(7).mute();
    expect(message).toMatchInlineSnapshot(`"SETD^i.6.aux.1.mute^1"`);

    conn.aux(2).input(7).unmute();
    expect(message).toMatchInlineSnapshot(`"SETD^i.6.aux.1.mute^0"`);

    conn.aux(2).input(7).pan(0.12);
    expect(message).toMatchInlineSnapshot(`"SETD^i.6.aux.1.pan^0.12"`);

    conn.aux(2).input(7).pre();
    expect(message).toMatchInlineSnapshot(`"SETD^i.6.aux.1.post^0"`);

    conn.aux(2).input(7).post();
    expect(message).toMatchInlineSnapshot(`"SETD^i.6.aux.1.post^1"`);

    conn.aux(2).input(7).setPost(1);
    expect(message).toMatchInlineSnapshot(`"SETD^i.6.aux.1.post^1"`);

    conn.aux(2).input(7).setPost(0);
    expect(message).toMatchInlineSnapshot(`"SETD^i.6.aux.1.post^0"`);

    conn.aux(2).input(7).preProc();
    expect(message).toMatchInlineSnapshot(`"SETD^i.6.aux.1.postproc^0"`);

    conn.aux(2).input(7).postProc();
    expect(message).toMatchInlineSnapshot(`"SETD^i.6.aux.1.postproc^1"`);

    conn.aux(2).input(7).setPostProc(1);
    expect(message).toMatchInlineSnapshot(`"SETD^i.6.aux.1.postproc^1"`);

    conn.aux(2).input(7).setPostProc(0);
    expect(message).toMatchInlineSnapshot(`"SETD^i.6.aux.1.postproc^0"`);
  });

  it('AUX channels LINE', () => {
    conn.aux(2).line(1).setFaderLevel(0.897);
    expect(message).toMatchInlineSnapshot(`"SETD^l.0.aux.1.value^0.897"`);

    conn.aux(2).line(1).setFaderLevelDB(6);
    expect(message).toMatchInlineSnapshot(`"SETD^l.0.aux.1.value^0.91653908203"`);

    conn.aux(2).line(1).setMute(1);
    expect(message).toMatchInlineSnapshot(`"SETD^l.0.aux.1.mute^1"`);

    conn.aux(2).line(1).setMute(0);
    expect(message).toMatchInlineSnapshot(`"SETD^l.0.aux.1.mute^0"`);

    conn.aux(2).line(1).mute();
    expect(message).toMatchInlineSnapshot(`"SETD^l.0.aux.1.mute^1"`);

    conn.aux(2).line(1).unmute();
    expect(message).toMatchInlineSnapshot(`"SETD^l.0.aux.1.mute^0"`);

    conn.aux(2).line(1).pan(0.12);
    expect(message).toMatchInlineSnapshot(`"SETD^l.0.aux.1.pan^0.12"`);

    conn.aux(2).line(1).pre();
    expect(message).toMatchInlineSnapshot(`"SETD^l.0.aux.1.post^0"`);

    conn.aux(2).line(1).post();
    expect(message).toMatchInlineSnapshot(`"SETD^l.0.aux.1.post^1"`);

    conn.aux(2).line(1).setPost(1);
    expect(message).toMatchInlineSnapshot(`"SETD^l.0.aux.1.post^1"`);

    conn.aux(2).line(1).setPost(0);
    expect(message).toMatchInlineSnapshot(`"SETD^l.0.aux.1.post^0"`);

    conn.aux(2).line(1).preProc();
    expect(message).toMatchInlineSnapshot(`"SETD^l.0.aux.1.postproc^0"`);

    conn.aux(2).line(1).postProc();
    expect(message).toMatchInlineSnapshot(`"SETD^l.0.aux.1.postproc^1"`);

    conn.aux(2).line(1).setPostProc(1);
    expect(message).toMatchInlineSnapshot(`"SETD^l.0.aux.1.postproc^1"`);

    conn.aux(2).line(1).setPostProc(0);
    expect(message).toMatchInlineSnapshot(`"SETD^l.0.aux.1.postproc^0"`);
  });

  it('AUX channels PLAYER', () => {
    conn.aux(2).player(2).setFaderLevel(0.897);
    expect(message).toMatchInlineSnapshot(`"SETD^p.1.aux.1.value^0.897"`);

    conn.aux(2).player(2).setFaderLevelDB(6);
    expect(message).toMatchInlineSnapshot(`"SETD^p.1.aux.1.value^0.91653908203"`);

    conn.aux(2).player(2).setMute(1);
    expect(message).toMatchInlineSnapshot(`"SETD^p.1.aux.1.mute^1"`);

    conn.aux(2).player(2).setMute(0);
    expect(message).toMatchInlineSnapshot(`"SETD^p.1.aux.1.mute^0"`);

    conn.aux(2).player(2).mute();
    expect(message).toMatchInlineSnapshot(`"SETD^p.1.aux.1.mute^1"`);

    conn.aux(2).player(2).unmute();
    expect(message).toMatchInlineSnapshot(`"SETD^p.1.aux.1.mute^0"`);

    conn.aux(2).player(2).pan(0.12);
    expect(message).toMatchInlineSnapshot(`"SETD^p.1.aux.1.pan^0.12"`);

    conn.aux(2).player(2).pre();
    expect(message).toMatchInlineSnapshot(`"SETD^p.1.aux.1.post^0"`);

    conn.aux(2).player(2).post();
    expect(message).toMatchInlineSnapshot(`"SETD^p.1.aux.1.post^1"`);

    conn.aux(2).player(2).setPost(1);
    expect(message).toMatchInlineSnapshot(`"SETD^p.1.aux.1.post^1"`);

    conn.aux(2).player(2).setPost(0);
    expect(message).toMatchInlineSnapshot(`"SETD^p.1.aux.1.post^0"`);

    conn.aux(2).player(2).preProc();
    expect(message).toMatchInlineSnapshot(`"SETD^p.1.aux.1.postproc^0"`);

    conn.aux(2).player(2).postProc();
    expect(message).toMatchInlineSnapshot(`"SETD^p.1.aux.1.postproc^1"`);

    conn.aux(2).player(2).setPostProc(1);
    expect(message).toMatchInlineSnapshot(`"SETD^p.1.aux.1.postproc^1"`);

    conn.aux(2).player(2).setPostProc(0);
    expect(message).toMatchInlineSnapshot(`"SETD^p.1.aux.1.postproc^0"`);
  });

  it('AUX channels FX', () => {
    conn.aux(2).fx(1).setFaderLevel(0.897);
    expect(message).toMatchInlineSnapshot(`"SETD^f.0.aux.1.value^0.897"`);

    conn.aux(2).fx(1).setFaderLevelDB(6);
    expect(message).toMatchInlineSnapshot(`"SETD^f.0.aux.1.value^0.91653908203"`);

    conn.aux(2).fx(1).setMute(1);
    expect(message).toMatchInlineSnapshot(`"SETD^f.0.aux.1.mute^1"`);

    conn.aux(2).fx(1).setMute(0);
    expect(message).toMatchInlineSnapshot(`"SETD^f.0.aux.1.mute^0"`);

    conn.aux(2).fx(1).mute();
    expect(message).toMatchInlineSnapshot(`"SETD^f.0.aux.1.mute^1"`);

    conn.aux(2).fx(1).unmute();
    expect(message).toMatchInlineSnapshot(`"SETD^f.0.aux.1.mute^0"`);

    conn.aux(2).fx(1).pan(0.12);
    expect(message).toMatchInlineSnapshot(`"SETD^f.0.aux.1.pan^0.12"`);

    conn.aux(2).fx(1).pre();
    expect(message).toMatchInlineSnapshot(`"SETD^f.0.aux.1.post^0"`);

    conn.aux(2).fx(1).post();
    expect(message).toMatchInlineSnapshot(`"SETD^f.0.aux.1.post^1"`);

    conn.aux(2).fx(1).setPost(1);
    expect(message).toMatchInlineSnapshot(`"SETD^f.0.aux.1.post^1"`);

    conn.aux(2).fx(1).setPost(0);
    expect(message).toMatchInlineSnapshot(`"SETD^f.0.aux.1.post^0"`);

    conn.aux(2).fx(1).preProc();
    expect(message).toMatchInlineSnapshot(`"SETD^f.0.aux.1.postproc^0"`);

    conn.aux(2).fx(1).postProc();
    expect(message).toMatchInlineSnapshot(`"SETD^f.0.aux.1.postproc^1"`);

    conn.aux(2).fx(1).setPostProc(1);
    expect(message).toMatchInlineSnapshot(`"SETD^f.0.aux.1.postproc^1"`);

    conn.aux(2).fx(1).setPostProc(0);
    expect(message).toMatchInlineSnapshot(`"SETD^f.0.aux.1.postproc^0"`);
  });

  it('FX channels INPUT', () => {
    conn.fx(3).input(6).setFaderLevel(0.47679);
    expect(message).toMatchInlineSnapshot(`"SETD^i.5.fx.2.value^0.47679"`);

    conn.fx(3).input(6).setFaderLevelDB(9.4);
    expect(message).toMatchInlineSnapshot(`"SETD^i.5.fx.2.value^0.98845064599"`);

    conn.fx(3).input(6).setMute(1);
    expect(message).toMatchInlineSnapshot(`"SETD^i.5.fx.2.mute^1"`);

    conn.fx(3).input(6).setMute(0);
    expect(message).toMatchInlineSnapshot(`"SETD^i.5.fx.2.mute^0"`);

    conn.fx(3).input(6).mute();
    expect(message).toMatchInlineSnapshot(`"SETD^i.5.fx.2.mute^1"`);

    conn.fx(3).input(6).unmute();
    expect(message).toMatchInlineSnapshot(`"SETD^i.5.fx.2.mute^0"`);

    conn.fx(3).input(6).pre();
    expect(message).toMatchInlineSnapshot(`"SETD^i.5.fx.2.post^0"`);

    conn.fx(3).input(6).post();
    expect(message).toMatchInlineSnapshot(`"SETD^i.5.fx.2.post^1"`);

    conn.fx(3).input(6).setPost(1);
    expect(message).toMatchInlineSnapshot(`"SETD^i.5.fx.2.post^1"`);

    conn.fx(3).input(6).setPost(0);
    expect(message).toMatchInlineSnapshot(`"SETD^i.5.fx.2.post^0"`);
  });

  it('FX channels LINE', () => {
    conn.fx(3).line(2).setFaderLevel(0.47679);
    expect(message).toMatchInlineSnapshot(`"SETD^l.1.fx.2.value^0.47679"`);

    conn.fx(3).line(2).setFaderLevelDB(9.4);
    expect(message).toMatchInlineSnapshot(`"SETD^l.1.fx.2.value^0.98845064599"`);

    conn.fx(3).line(2).setMute(1);
    expect(message).toMatchInlineSnapshot(`"SETD^l.1.fx.2.mute^1"`);

    conn.fx(3).line(2).setMute(0);
    expect(message).toMatchInlineSnapshot(`"SETD^l.1.fx.2.mute^0"`);

    conn.fx(3).line(2).mute();
    expect(message).toMatchInlineSnapshot(`"SETD^l.1.fx.2.mute^1"`);

    conn.fx(3).line(2).unmute();
    expect(message).toMatchInlineSnapshot(`"SETD^l.1.fx.2.mute^0"`);

    conn.fx(3).line(2).pre();
    expect(message).toMatchInlineSnapshot(`"SETD^l.1.fx.2.post^0"`);

    conn.fx(3).line(2).post();
    expect(message).toMatchInlineSnapshot(`"SETD^l.1.fx.2.post^1"`);

    conn.fx(3).line(2).setPost(1);
    expect(message).toMatchInlineSnapshot(`"SETD^l.1.fx.2.post^1"`);

    conn.fx(3).line(2).setPost(0);
    expect(message).toMatchInlineSnapshot(`"SETD^l.1.fx.2.post^0"`);
  });

  it('FX channels PLAYER', () => {
    conn.fx(3).player(1).setFaderLevel(0.47679);
    expect(message).toMatchInlineSnapshot(`"SETD^p.0.fx.2.value^0.47679"`);

    conn.fx(3).player(1).setFaderLevelDB(9.4);
    expect(message).toMatchInlineSnapshot(`"SETD^p.0.fx.2.value^0.98845064599"`);

    conn.fx(3).player(1).setMute(1);
    expect(message).toMatchInlineSnapshot(`"SETD^p.0.fx.2.mute^1"`);

    conn.fx(3).player(1).setMute(0);
    expect(message).toMatchInlineSnapshot(`"SETD^p.0.fx.2.mute^0"`);

    conn.fx(3).player(1).mute();
    expect(message).toMatchInlineSnapshot(`"SETD^p.0.fx.2.mute^1"`);

    conn.fx(3).player(1).unmute();
    expect(message).toMatchInlineSnapshot(`"SETD^p.0.fx.2.mute^0"`);

    conn.fx(3).player(1).pre();
    expect(message).toMatchInlineSnapshot(`"SETD^p.0.fx.2.post^0"`);

    conn.fx(3).player(1).post();
    expect(message).toMatchInlineSnapshot(`"SETD^p.0.fx.2.post^1"`);

    conn.fx(3).player(1).setPost(1);
    expect(message).toMatchInlineSnapshot(`"SETD^p.0.fx.2.post^1"`);

    conn.fx(3).player(1).setPost(0);
    expect(message).toMatchInlineSnapshot(`"SETD^p.0.fx.2.post^0"`);
  });

  it('FX channels SUB', () => {
    conn.fx(3).sub(4).setFaderLevel(0.47679);
    expect(message).toMatchInlineSnapshot(`"SETD^s.3.fx.2.value^0.47679"`);

    conn.fx(3).sub(4).setFaderLevelDB(9.4);
    expect(message).toMatchInlineSnapshot(`"SETD^s.3.fx.2.value^0.98845064599"`);

    conn.fx(3).sub(4).setMute(1);
    expect(message).toMatchInlineSnapshot(`"SETD^s.3.fx.2.mute^1"`);

    conn.fx(3).sub(4).setMute(0);
    expect(message).toMatchInlineSnapshot(`"SETD^s.3.fx.2.mute^0"`);

    conn.fx(3).sub(4).mute();
    expect(message).toMatchInlineSnapshot(`"SETD^s.3.fx.2.mute^1"`);

    conn.fx(3).sub(4).unmute();
    expect(message).toMatchInlineSnapshot(`"SETD^s.3.fx.2.mute^0"`);

    conn.fx(3).sub(4).pre();
    expect(message).toMatchInlineSnapshot(`"SETD^s.3.fx.2.post^0"`);

    conn.fx(3).sub(4).post();
    expect(message).toMatchInlineSnapshot(`"SETD^s.3.fx.2.post^1"`);

    conn.fx(3).sub(4).setPost(1);
    expect(message).toMatchInlineSnapshot(`"SETD^s.3.fx.2.post^1"`);

    conn.fx(3).sub(4).setPost(0);
    expect(message).toMatchInlineSnapshot(`"SETD^s.3.fx.2.post^0"`);
  });

  it('Media player', () => {
    conn.player.play();
    expect(message).toMatchInlineSnapshot(`"MEDIA_PLAY"`);

    conn.player.pause();
    expect(message).toMatchInlineSnapshot(`"MEDIA_PAUSE"`);

    conn.player.stop();
    expect(message).toMatchInlineSnapshot(`"MEDIA_STOP"`);

    conn.player.next();
    expect(message).toMatchInlineSnapshot(`"MEDIA_NEXT"`);

    conn.player.prev();
    expect(message).toMatchInlineSnapshot(`"MEDIA_PREV"`);

    conn.player.loadPlaylist('~all~');
    expect(message).toMatchInlineSnapshot(`"MEDIA_SWITCH_PLIST^~all~"`);

    conn.player.loadPlaylist('myplaylist');
    expect(message).toMatchInlineSnapshot(`"MEDIA_SWITCH_PLIST^myplaylist"`);

    conn.player.loadTrack('~root~', 'mytrack.mp3');
    expect(message).toMatchInlineSnapshot(`"MEDIA_SWITCH_TRACK^~root~^mytrack.mp3"`);

    conn.player.setShuffle(1);
    expect(message).toMatchInlineSnapshot(`"SETD^settings.shuffle^1"`);

    conn.player.setShuffle(0);
    expect(message).toMatchInlineSnapshot(`"SETD^settings.shuffle^0"`);

    conn.player.setPlayMode(0);
    expect(message).toMatchInlineSnapshot(`"SETD^settings.playMode^0"`);

    conn.player.setPlayMode(2);
    expect(message).toMatchInlineSnapshot(`"SETD^settings.playMode^2"`);

    conn.player.setManual();
    expect(message).toMatchInlineSnapshot(`"SETD^settings.playMode^0"`);

    conn.player.setAuto();
    expect(message).toMatchInlineSnapshot(`"SETD^settings.playMode^3"`);
  });

  it('2-track recorder', () => {
    conn.recorderDualTrack.recordToggle();
    expect(message).toMatchInlineSnapshot(`"RECTOGGLE"`);
  });

  it('Volume Buses', () => {
    conn.volume.solo.setFaderLevel(0.47679);
    expect(message).toMatchInlineSnapshot(`"SETD^settings.solovol^0.47679"`);

    conn.volume.solo.setFaderLevelDB(10);
    expect(message).toMatchInlineSnapshot(`"SETD^settings.solovol^1"`);

    conn.volume.headphone(1).setFaderLevel(0.47679);
    expect(message).toMatchInlineSnapshot(`"SETD^settings.hpvol.0^0.47679"`);

    conn.volume.headphone(1).setFaderLevelDB(10);
    expect(message).toMatchInlineSnapshot(`"SETD^settings.hpvol.0^1"`);

    conn.volume.headphone(2).setFaderLevel(0.47679);
    expect(message).toMatchInlineSnapshot(`"SETD^settings.hpvol.1^0.47679"`);

    conn.volume.headphone(3).setFaderLevelDB(10);
    expect(message).toMatchInlineSnapshot(`"SETD^settings.hpvol.2^1"`);
  });
});
