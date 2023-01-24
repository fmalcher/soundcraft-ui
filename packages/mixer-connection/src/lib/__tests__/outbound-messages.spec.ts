import { SoundcraftUI } from '../soundcraft-ui';
import { setMixerModel } from '../util';

describe('Outbound messages', () => {
  let conn: SoundcraftUI;
  let message: string;

  beforeEach(() => {
    conn = new SoundcraftUI('127.0.0.1');

    message = undefined;
    conn.conn.allMessages$.subscribe(msg => (message = msg));
  });

  it('master', () => {
    conn.master.setFaderLevel(0.8);
    expect(message).toBe('SETD^m.mix^0.8');

    conn.master.setFaderLevel(1.2); // clamp upper
    expect(message).toBe('SETD^m.mix^1');

    conn.master.setFaderLevel(-4); // clamp lower
    expect(message).toBe('SETD^m.mix^0');

    conn.master.setFaderLevelDB(3);
    expect(message).toBe('SETD^m.mix^0.84375627202');

    conn.master.setFaderLevelDB(20);
    expect(message).toBe('SETD^m.mix^1');

    conn.master.setFaderLevelDB(-200);
    expect(message).toBe('SETD^m.mix^0.00126941502');

    conn.master.setFaderLevelDB(-Infinity);
    expect(message).toBe('SETD^m.mix^0');

    conn.master.pan(0.3);
    expect(message).toBe('SETD^m.pan^0.3');

    conn.master.pan(-3);
    expect(message).toBe('SETD^m.pan^0'); // clamp

    conn.master.pan(1.1);
    expect(message).toBe('SETD^m.pan^1'); // clamp

    conn.master.dim();
    expect(message).toBe('SETD^m.dim^1');

    conn.master.undim();
    expect(message).toBe('SETD^m.dim^0');

    conn.master.setDim(1);
    expect(message).toBe('SETD^m.dim^1');

    conn.master.setDim(0);
    expect(message).toBe('SETD^m.dim^0');

    conn.master.setDelayL(500);
    expect(message).toBe('SETD^m.delayL^0.5');

    conn.master.setDelayR(350);
    expect(message).toBe('SETD^m.delayR^0.35');
  });

  it('master channels INPUT', () => {
    conn.master.input(3).setFaderLevel(0.4);
    expect(message).toBe('SETD^i.2.mix^0.4');

    conn.master.input(3).setFaderLevel(1.2); // clamp upper
    expect(message).toBe('SETD^i.2.mix^1');

    conn.master.input(3).setFaderLevel(-4); // clamp lower
    expect(message).toBe('SETD^i.2.mix^0');

    conn.master.input(3).setFaderLevelDB(-12);
    expect(message).toBe('SETD^i.2.mix^0.49333689432');

    conn.master.input(3).setMute(1);
    expect(message).toBe('SETD^i.2.mute^1');

    conn.master.input(3).setMute(0);
    expect(message).toBe('SETD^i.2.mute^0');

    conn.master.input(3).mute();
    expect(message).toBe('SETD^i.2.mute^1');

    conn.master.input(3).unmute();
    expect(message).toBe('SETD^i.2.mute^0');

    conn.master.input(3).pan(0.78);
    expect(message).toBe('SETD^i.2.pan^0.78');

    conn.master.input(3).pan(-3);
    expect(message).toBe('SETD^i.2.pan^0'); // clamp

    conn.master.input(3).pan(1.1);
    expect(message).toBe('SETD^i.2.pan^1'); // clamp

    conn.master.input(3).setSolo(0);
    expect(message).toBe('SETD^i.2.solo^0');

    conn.master.input(3).setSolo(1);
    expect(message).toBe('SETD^i.2.solo^1');

    conn.master.input(3).solo();
    expect(message).toBe('SETD^i.2.solo^1');

    conn.master.input(3).unsolo();
    expect(message).toBe('SETD^i.2.solo^0');

    conn.master.input(3).setDelay(210);
    expect(message).toBe('SETD^i.2.delay^0.21');
  });

  it('master channels LINE', () => {
    conn.master.line(1).setFaderLevel(0.4);
    expect(message).toBe('SETD^l.0.mix^0.4');

    conn.master.line(1).setFaderLevel(1.2); // clamp upper
    expect(message).toBe('SETD^l.0.mix^1');

    conn.master.line(1).setFaderLevel(-4); // clamp lower
    expect(message).toBe('SETD^l.0.mix^0');

    conn.master.line(1).setFaderLevelDB(-12);
    expect(message).toBe('SETD^l.0.mix^0.49333689432');

    conn.master.line(1).setMute(1);
    expect(message).toBe('SETD^l.0.mute^1');

    conn.master.line(1).setMute(0);
    expect(message).toBe('SETD^l.0.mute^0');

    conn.master.line(1).mute();
    expect(message).toBe('SETD^l.0.mute^1');

    conn.master.line(1).unmute();
    expect(message).toBe('SETD^l.0.mute^0');

    conn.master.line(1).pan(0.78);
    expect(message).toBe('SETD^l.0.pan^0.78');

    conn.master.line(1).pan(-0.1);
    expect(message).toBe('SETD^l.0.pan^0'); // clamp

    conn.master.line(1).pan(3);
    expect(message).toBe('SETD^l.0.pan^1'); // clamp

    conn.master.line(1).setSolo(0);
    expect(message).toBe('SETD^l.0.solo^0');

    conn.master.line(1).setSolo(1);
    expect(message).toBe('SETD^l.0.solo^1');

    conn.master.line(1).solo();
    expect(message).toBe('SETD^l.0.solo^1');

    conn.master.line(1).unsolo();
    expect(message).toBe('SETD^l.0.solo^0');

    conn.master.line(1).setDelay(130);
    expect(message).toBe('SETD^l.0.delay^0.13');
  });

  it('master channels PLAYER', () => {
    conn.master.player(2).setFaderLevel(0.4);
    expect(message).toBe('SETD^p.1.mix^0.4');

    conn.master.player(2).setFaderLevel(1.2); // clamp upper
    expect(message).toBe('SETD^p.1.mix^1');

    conn.master.player(2).setFaderLevel(-4); // clamp lower
    expect(message).toBe('SETD^p.1.mix^0');

    conn.master.player(2).setFaderLevelDB(-12);
    expect(message).toBe('SETD^p.1.mix^0.49333689432');

    conn.master.player(2).setMute(1);
    expect(message).toBe('SETD^p.1.mute^1');

    conn.master.player(2).setMute(0);
    expect(message).toBe('SETD^p.1.mute^0');

    conn.master.player(2).mute();
    expect(message).toBe('SETD^p.1.mute^1');

    conn.master.player(2).unmute();
    expect(message).toBe('SETD^p.1.mute^0');

    conn.master.player(2).pan(0.78);
    expect(message).toBe('SETD^p.1.pan^0.78');

    conn.master.player(2).pan(-3.2);
    expect(message).toBe('SETD^p.1.pan^0'); // clamp

    conn.master.player(2).pan(1.3);
    expect(message).toBe('SETD^p.1.pan^1'); // clamp

    conn.master.player(2).setSolo(0);
    expect(message).toBe('SETD^p.1.solo^0');

    conn.master.player(2).setSolo(1);
    expect(message).toBe('SETD^p.1.solo^1');

    conn.master.player(2).solo();
    expect(message).toBe('SETD^p.1.solo^1');

    conn.master.player(2).unsolo();
    expect(message).toBe('SETD^p.1.solo^0');
  });

  it('master channels AUX', () => {
    conn.master.aux(1).setFaderLevel(0.4);
    expect(message).toBe('SETD^a.0.mix^0.4');

    conn.master.aux(1).setFaderLevel(1.2); // clamp upper
    expect(message).toBe('SETD^a.0.mix^1');

    conn.master.aux(1).setFaderLevel(-4); // clamp lower
    expect(message).toBe('SETD^a.0.mix^0');

    conn.master.aux(1).setFaderLevelDB(-12);
    expect(message).toBe('SETD^a.0.mix^0.49333689432');

    conn.master.aux(1).setMute(1);
    expect(message).toBe('SETD^a.0.mute^1');

    conn.master.aux(1).setMute(0);
    expect(message).toBe('SETD^a.0.mute^0');

    conn.master.aux(1).mute();
    expect(message).toBe('SETD^a.0.mute^1');

    conn.master.aux(1).unmute();
    expect(message).toBe('SETD^a.0.mute^0');

    conn.master.aux(1).pan(0.78);
    expect(message).toBe('SETD^a.0.pan^0.78');

    conn.master.aux(1).pan(-1.3);
    expect(message).toBe('SETD^a.0.pan^0'); // clamp

    conn.master.aux(1).pan(2.2);
    expect(message).toBe('SETD^a.0.pan^1'); // clamp

    conn.master.aux(1).setSolo(0);
    expect(message).toBe('SETD^a.0.solo^0');

    conn.master.aux(1).setSolo(1);
    expect(message).toBe('SETD^a.0.solo^1');

    conn.master.aux(1).solo();
    expect(message).toBe('SETD^a.0.solo^1');

    conn.master.aux(1).unsolo();
    expect(message).toBe('SETD^a.0.solo^0');

    conn.master.aux(1).setDelay(400);
    expect(message).toBe('SETD^a.0.delay^0.4');
  });

  it('master channels FX', () => {
    conn.master.fx(3).setFaderLevel(0.4);
    expect(message).toBe('SETD^f.2.mix^0.4');

    conn.master.fx(3).setFaderLevel(1.2); // clamp upper
    expect(message).toBe('SETD^f.2.mix^1');

    conn.master.fx(3).setFaderLevel(-4); // clamp lower
    expect(message).toBe('SETD^f.2.mix^0');

    conn.master.fx(3).setFaderLevelDB(-12);
    expect(message).toBe('SETD^f.2.mix^0.49333689432');

    conn.master.fx(3).setMute(1);
    expect(message).toBe('SETD^f.2.mute^1');

    conn.master.fx(3).setMute(0);
    expect(message).toBe('SETD^f.2.mute^0');

    conn.master.fx(3).mute();
    expect(message).toBe('SETD^f.2.mute^1');

    conn.master.fx(3).unmute();
    expect(message).toBe('SETD^f.2.mute^0');

    conn.master.fx(3).pan(0.78);
    expect(message).toBe('SETD^f.2.pan^0.78');

    conn.master.fx(3).pan(-10);
    expect(message).toBe('SETD^f.2.pan^0'); // clamp

    conn.master.fx(3).pan(10);
    expect(message).toBe('SETD^f.2.pan^1'); // clamp

    conn.master.fx(3).setSolo(0);
    expect(message).toBe('SETD^f.2.solo^0');

    conn.master.fx(3).setSolo(1);
    expect(message).toBe('SETD^f.2.solo^1');

    conn.master.fx(3).solo();
    expect(message).toBe('SETD^f.2.solo^1');

    conn.master.fx(3).unsolo();
    expect(message).toBe('SETD^f.2.solo^0');
  });

  it('master channels SUB', () => {
    conn.master.sub(4).setFaderLevel(0.4);
    expect(message).toBe('SETD^s.3.mix^0.4');

    conn.master.sub(4).setFaderLevel(1.2); // clamp upper
    expect(message).toBe('SETD^s.3.mix^1');

    conn.master.sub(4).setFaderLevel(-4); // clamp lower
    expect(message).toBe('SETD^s.3.mix^0');

    conn.master.sub(4).setFaderLevelDB(-12);
    expect(message).toBe('SETD^s.3.mix^0.49333689432');

    conn.master.sub(4).setMute(1);
    expect(message).toBe('SETD^s.3.mute^1');

    conn.master.sub(4).setMute(0);
    expect(message).toBe('SETD^s.3.mute^0');

    conn.master.sub(4).mute();
    expect(message).toBe('SETD^s.3.mute^1');

    conn.master.sub(4).unmute();
    expect(message).toBe('SETD^s.3.mute^0');

    conn.master.sub(4).pan(0.78);
    expect(message).toBe('SETD^s.3.pan^0.78');

    conn.master.sub(4).pan(-100.2);
    expect(message).toBe('SETD^s.3.pan^0'); // clamp

    conn.master.sub(4).pan(5.4);
    expect(message).toBe('SETD^s.3.pan^1'); // clamp

    conn.master.sub(4).setSolo(0);
    expect(message).toBe('SETD^s.3.solo^0');

    conn.master.sub(4).setSolo(1);
    expect(message).toBe('SETD^s.3.solo^1');

    conn.master.sub(4).solo();
    expect(message).toBe('SETD^s.3.solo^1');

    conn.master.sub(4).unsolo();
    expect(message).toBe('SETD^s.3.solo^0');
  });

  it('master channels VCA', () => {
    conn.master.vca(3).setFaderLevel(0.4);
    expect(message).toBe('SETD^v.2.mix^0.4');

    conn.master.vca(3).setFaderLevel(1.2); // clamp upper
    expect(message).toBe('SETD^v.2.mix^1');

    conn.master.vca(3).setFaderLevel(-4); // clamp lower
    expect(message).toBe('SETD^v.2.mix^0');

    conn.master.vca(3).setFaderLevelDB(-12);
    expect(message).toBe('SETD^v.2.mix^0.49333689432');

    conn.master.vca(3).setMute(1);
    expect(message).toBe('SETD^v.2.mute^1');

    conn.master.vca(3).setMute(0);
    expect(message).toBe('SETD^v.2.mute^0');

    conn.master.vca(3).mute();
    expect(message).toBe('SETD^v.2.mute^1');

    conn.master.vca(3).unmute();
    expect(message).toBe('SETD^v.2.mute^0');

    conn.master.vca(3).pan(0.78);
    expect(message).toBe('SETD^v.2.pan^0.78');

    conn.master.vca(3).pan(1.1);
    expect(message).toBe('SETD^v.2.pan^1'); // clamp

    conn.master.vca(3).pan(-0.1);
    expect(message).toBe('SETD^v.2.pan^0'); // clamp

    conn.master.vca(3).setSolo(0);
    expect(message).toBe('SETD^v.2.solo^0');

    conn.master.vca(3).setSolo(1);
    expect(message).toBe('SETD^v.2.solo^1');

    conn.master.vca(3).solo();
    expect(message).toBe('SETD^v.2.solo^1');

    conn.master.vca(3).unsolo();
    expect(message).toBe('SETD^v.2.solo^0');
  });

  it('AUX channels INPUT', () => {
    conn.aux(2).input(7).setFaderLevel(0.897);
    expect(message).toBe('SETD^i.6.aux.1.value^0.897');

    conn.aux(2).input(7).setFaderLevel(2); // clamp upper
    expect(message).toBe('SETD^i.6.aux.1.value^1');

    conn.aux(2).input(7).setFaderLevel(-1); // clamp lower
    expect(message).toBe('SETD^i.6.aux.1.value^0');

    conn.aux(2).input(7).setFaderLevelDB(6);
    expect(message).toBe('SETD^i.6.aux.1.value^0.91653908203');

    conn.aux(2).input(7).setMute(1);
    expect(message).toBe('SETD^i.6.aux.1.mute^1');

    conn.aux(2).input(7).setMute(0);
    expect(message).toBe('SETD^i.6.aux.1.mute^0');

    conn.aux(2).input(7).mute();
    expect(message).toBe('SETD^i.6.aux.1.mute^1');

    conn.aux(2).input(7).unmute();
    expect(message).toBe('SETD^i.6.aux.1.mute^0');

    conn.aux(2).input(7).pan(0.12);
    expect(message).toBe('SETD^i.6.aux.1.pan^0.12');

    conn.aux(2).input(7).pan(1.12);
    expect(message).toBe('SETD^i.6.aux.1.pan^1'); // clamp

    conn.aux(2).input(7).pan(-0.12);
    expect(message).toBe('SETD^i.6.aux.1.pan^0'); // clamp

    conn.aux(2).input(7).pre();
    expect(message).toBe('SETD^i.6.aux.1.post^0');

    conn.aux(2).input(7).post();
    expect(message).toBe('SETD^i.6.aux.1.post^1');

    conn.aux(2).input(7).setPost(1);
    expect(message).toBe('SETD^i.6.aux.1.post^1');

    conn.aux(2).input(7).setPost(0);
    expect(message).toBe('SETD^i.6.aux.1.post^0');

    conn.aux(2).input(7).preProc();
    expect(message).toBe('SETD^i.6.aux.1.postproc^0');

    conn.aux(2).input(7).postProc();
    expect(message).toBe('SETD^i.6.aux.1.postproc^1');

    conn.aux(2).input(7).setPostProc(1);
    expect(message).toBe('SETD^i.6.aux.1.postproc^1');

    conn.aux(2).input(7).setPostProc(0);
    expect(message).toBe('SETD^i.6.aux.1.postproc^0');
  });

  it('AUX channels LINE', () => {
    conn.aux(2).line(1).setFaderLevel(0.897);
    expect(message).toBe('SETD^l.0.aux.1.value^0.897');

    conn.aux(2).line(1).setFaderLevel(2); // clamp upper
    expect(message).toBe('SETD^l.0.aux.1.value^1');

    conn.aux(2).line(1).setFaderLevel(-1); // clamp lower
    expect(message).toBe('SETD^l.0.aux.1.value^0');

    conn.aux(2).line(1).setFaderLevelDB(6);
    expect(message).toBe('SETD^l.0.aux.1.value^0.91653908203');

    conn.aux(2).line(1).setMute(1);
    expect(message).toBe('SETD^l.0.aux.1.mute^1');

    conn.aux(2).line(1).setMute(0);
    expect(message).toBe('SETD^l.0.aux.1.mute^0');

    conn.aux(2).line(1).mute();
    expect(message).toBe('SETD^l.0.aux.1.mute^1');

    conn.aux(2).line(1).unmute();
    expect(message).toBe('SETD^l.0.aux.1.mute^0');

    conn.aux(2).line(1).pan(0.12);
    expect(message).toBe('SETD^l.0.aux.1.pan^0.12');

    conn.aux(2).line(1).pan(1.3);
    expect(message).toBe('SETD^l.0.aux.1.pan^1'); // clamp

    conn.aux(2).line(1).pan(-1.3);
    expect(message).toBe('SETD^l.0.aux.1.pan^0'); // clamp

    conn.aux(2).line(1).pre();
    expect(message).toBe('SETD^l.0.aux.1.post^0');

    conn.aux(2).line(1).post();
    expect(message).toBe('SETD^l.0.aux.1.post^1');

    conn.aux(2).line(1).setPost(1);
    expect(message).toBe('SETD^l.0.aux.1.post^1');

    conn.aux(2).line(1).setPost(0);
    expect(message).toBe('SETD^l.0.aux.1.post^0');

    conn.aux(2).line(1).preProc();
    expect(message).toBe('SETD^l.0.aux.1.postproc^0');

    conn.aux(2).line(1).postProc();
    expect(message).toBe('SETD^l.0.aux.1.postproc^1');

    conn.aux(2).line(1).setPostProc(1);
    expect(message).toBe('SETD^l.0.aux.1.postproc^1');

    conn.aux(2).line(1).setPostProc(0);
    expect(message).toBe('SETD^l.0.aux.1.postproc^0');
  });

  it('AUX channels PLAYER', () => {
    conn.aux(2).player(2).setFaderLevel(0.897);
    expect(message).toBe('SETD^p.1.aux.1.value^0.897');

    conn.aux(2).player(2).setFaderLevel(2); // clamp upper
    expect(message).toBe('SETD^p.1.aux.1.value^1');

    conn.aux(2).player(2).setFaderLevel(-1); // clamp lower
    expect(message).toBe('SETD^p.1.aux.1.value^0');

    conn.aux(2).player(2).setFaderLevelDB(6);
    expect(message).toBe('SETD^p.1.aux.1.value^0.91653908203');

    conn.aux(2).player(2).setMute(1);
    expect(message).toBe('SETD^p.1.aux.1.mute^1');

    conn.aux(2).player(2).setMute(0);
    expect(message).toBe('SETD^p.1.aux.1.mute^0');

    conn.aux(2).player(2).mute();
    expect(message).toBe('SETD^p.1.aux.1.mute^1');

    conn.aux(2).player(2).unmute();
    expect(message).toBe('SETD^p.1.aux.1.mute^0');

    conn.aux(2).player(2).pan(0.12);
    expect(message).toBe('SETD^p.1.aux.1.pan^0.12');

    conn.aux(2).player(2).pan(3.5);
    expect(message).toBe('SETD^p.1.aux.1.pan^1'); // clamp

    conn.aux(2).player(2).pan(-4.5);
    expect(message).toBe('SETD^p.1.aux.1.pan^0'); // clamp

    conn.aux(2).player(2).pre();
    expect(message).toBe('SETD^p.1.aux.1.post^0');

    conn.aux(2).player(2).post();
    expect(message).toBe('SETD^p.1.aux.1.post^1');

    conn.aux(2).player(2).setPost(1);
    expect(message).toBe('SETD^p.1.aux.1.post^1');

    conn.aux(2).player(2).setPost(0);
    expect(message).toBe('SETD^p.1.aux.1.post^0');

    conn.aux(2).player(2).preProc();
    expect(message).toBe('SETD^p.1.aux.1.postproc^0');

    conn.aux(2).player(2).postProc();
    expect(message).toBe('SETD^p.1.aux.1.postproc^1');

    conn.aux(2).player(2).setPostProc(1);
    expect(message).toBe('SETD^p.1.aux.1.postproc^1');

    conn.aux(2).player(2).setPostProc(0);
    expect(message).toBe('SETD^p.1.aux.1.postproc^0');
  });

  it('AUX channels FX', () => {
    conn.aux(2).fx(1).setFaderLevel(0.897);
    expect(message).toBe('SETD^f.0.aux.1.value^0.897');

    conn.aux(2).fx(1).setFaderLevel(2); // clamp upper
    expect(message).toBe('SETD^f.0.aux.1.value^1');

    conn.aux(2).fx(1).setFaderLevel(-1); // clamp lower
    expect(message).toBe('SETD^f.0.aux.1.value^0');

    conn.aux(2).fx(1).setFaderLevelDB(6);
    expect(message).toBe('SETD^f.0.aux.1.value^0.91653908203');

    conn.aux(2).fx(1).setMute(1);
    expect(message).toBe('SETD^f.0.aux.1.mute^1');

    conn.aux(2).fx(1).setMute(0);
    expect(message).toBe('SETD^f.0.aux.1.mute^0');

    conn.aux(2).fx(1).mute();
    expect(message).toBe('SETD^f.0.aux.1.mute^1');

    conn.aux(2).fx(1).unmute();
    expect(message).toBe('SETD^f.0.aux.1.mute^0');

    conn.aux(2).fx(1).pan(0.12);
    expect(message).toBe('SETD^f.0.aux.1.pan^0.12');

    conn.aux(2).fx(1).pan(-0.12);
    expect(message).toBe('SETD^f.0.aux.1.pan^0');

    conn.aux(2).fx(1).pan(50);
    expect(message).toBe('SETD^f.0.aux.1.pan^1');

    conn.aux(2).fx(1).pre();
    expect(message).toBe('SETD^f.0.aux.1.post^0');

    conn.aux(2).fx(1).post();
    expect(message).toBe('SETD^f.0.aux.1.post^1');

    conn.aux(2).fx(1).setPost(1);
    expect(message).toBe('SETD^f.0.aux.1.post^1');

    conn.aux(2).fx(1).setPost(0);
    expect(message).toBe('SETD^f.0.aux.1.post^0');

    conn.aux(2).fx(1).preProc();
    expect(message).toBe('SETD^f.0.aux.1.postproc^0');

    conn.aux(2).fx(1).postProc();
    expect(message).toBe('SETD^f.0.aux.1.postproc^1');

    conn.aux(2).fx(1).setPostProc(1);
    expect(message).toBe('SETD^f.0.aux.1.postproc^1');

    conn.aux(2).fx(1).setPostProc(0);
    expect(message).toBe('SETD^f.0.aux.1.postproc^0');
  });

  it('FX channels INPUT', () => {
    conn.fx(3).input(6).setFaderLevel(0.47679);
    expect(message).toBe('SETD^i.5.fx.2.value^0.47679');

    conn.fx(3).input(6).setFaderLevel(5); // clamp upper
    expect(message).toBe('SETD^i.5.fx.2.value^1');

    conn.fx(3).input(6).setFaderLevel(-5); // clamp lower
    expect(message).toBe('SETD^i.5.fx.2.value^0');

    conn.fx(3).input(6).setFaderLevelDB(9.4);
    expect(message).toBe('SETD^i.5.fx.2.value^0.98845064599');

    conn.fx(3).input(6).setMute(1);
    expect(message).toBe('SETD^i.5.fx.2.mute^1');

    conn.fx(3).input(6).setMute(0);
    expect(message).toBe('SETD^i.5.fx.2.mute^0');

    conn.fx(3).input(6).mute();
    expect(message).toBe('SETD^i.5.fx.2.mute^1');

    conn.fx(3).input(6).unmute();
    expect(message).toBe('SETD^i.5.fx.2.mute^0');

    conn.fx(3).input(6).pre();
    expect(message).toBe('SETD^i.5.fx.2.post^0');

    conn.fx(3).input(6).post();
    expect(message).toBe('SETD^i.5.fx.2.post^1');

    conn.fx(3).input(6).setPost(1);
    expect(message).toBe('SETD^i.5.fx.2.post^1');

    conn.fx(3).input(6).setPost(0);
    expect(message).toBe('SETD^i.5.fx.2.post^0');
  });

  it('FX channels LINE', () => {
    conn.fx(3).line(2).setFaderLevel(0.47679);
    expect(message).toBe('SETD^l.1.fx.2.value^0.47679');

    conn.fx(3).line(2).setFaderLevel(5); // clamp upper
    expect(message).toBe('SETD^l.1.fx.2.value^1');

    conn.fx(3).line(2).setFaderLevel(-5); // clamp lower
    expect(message).toBe('SETD^l.1.fx.2.value^0');

    conn.fx(3).line(2).setFaderLevelDB(9.4);
    expect(message).toBe('SETD^l.1.fx.2.value^0.98845064599');

    conn.fx(3).line(2).setMute(1);
    expect(message).toBe('SETD^l.1.fx.2.mute^1');

    conn.fx(3).line(2).setMute(0);
    expect(message).toBe('SETD^l.1.fx.2.mute^0');

    conn.fx(3).line(2).mute();
    expect(message).toBe('SETD^l.1.fx.2.mute^1');

    conn.fx(3).line(2).unmute();
    expect(message).toBe('SETD^l.1.fx.2.mute^0');

    conn.fx(3).line(2).pre();
    expect(message).toBe('SETD^l.1.fx.2.post^0');

    conn.fx(3).line(2).post();
    expect(message).toBe('SETD^l.1.fx.2.post^1');

    conn.fx(3).line(2).setPost(1);
    expect(message).toBe('SETD^l.1.fx.2.post^1');

    conn.fx(3).line(2).setPost(0);
    expect(message).toBe('SETD^l.1.fx.2.post^0');
  });

  it('FX channels PLAYER', () => {
    conn.fx(3).player(1).setFaderLevel(0.47679);
    expect(message).toBe('SETD^p.0.fx.2.value^0.47679');

    conn.fx(3).player(1).setFaderLevel(5); // clamp upper
    expect(message).toBe('SETD^p.0.fx.2.value^1');

    conn.fx(3).player(1).setFaderLevel(-5); // clamp lower
    expect(message).toBe('SETD^p.0.fx.2.value^0');

    conn.fx(3).player(1).setFaderLevelDB(9.4);
    expect(message).toBe('SETD^p.0.fx.2.value^0.98845064599');

    conn.fx(3).player(1).setMute(1);
    expect(message).toBe('SETD^p.0.fx.2.mute^1');

    conn.fx(3).player(1).setMute(0);
    expect(message).toBe('SETD^p.0.fx.2.mute^0');

    conn.fx(3).player(1).mute();
    expect(message).toBe('SETD^p.0.fx.2.mute^1');

    conn.fx(3).player(1).unmute();
    expect(message).toBe('SETD^p.0.fx.2.mute^0');

    conn.fx(3).player(1).pre();
    expect(message).toBe('SETD^p.0.fx.2.post^0');

    conn.fx(3).player(1).post();
    expect(message).toBe('SETD^p.0.fx.2.post^1');

    conn.fx(3).player(1).setPost(1);
    expect(message).toBe('SETD^p.0.fx.2.post^1');

    conn.fx(3).player(1).setPost(0);
    expect(message).toBe('SETD^p.0.fx.2.post^0');
  });

  it('FX channels SUB', () => {
    conn.fx(3).sub(4).setFaderLevel(0.47679);
    expect(message).toBe('SETD^s.3.fx.2.value^0.47679');

    conn.fx(3).sub(4).setFaderLevel(5); // clamp upper
    expect(message).toBe('SETD^s.3.fx.2.value^1');

    conn.fx(3).sub(4).setFaderLevel(-5); // clamp lower
    expect(message).toBe('SETD^s.3.fx.2.value^0');

    conn.fx(3).sub(4).setFaderLevelDB(9.4);
    expect(message).toBe('SETD^s.3.fx.2.value^0.98845064599');

    conn.fx(3).sub(4).setMute(1);
    expect(message).toBe('SETD^s.3.fx.2.mute^1');

    conn.fx(3).sub(4).setMute(0);
    expect(message).toBe('SETD^s.3.fx.2.mute^0');

    conn.fx(3).sub(4).mute();
    expect(message).toBe('SETD^s.3.fx.2.mute^1');

    conn.fx(3).sub(4).unmute();
    expect(message).toBe('SETD^s.3.fx.2.mute^0');

    conn.fx(3).sub(4).pre();
    expect(message).toBe('SETD^s.3.fx.2.post^0');

    conn.fx(3).sub(4).post();
    expect(message).toBe('SETD^s.3.fx.2.post^1');

    conn.fx(3).sub(4).setPost(1);
    expect(message).toBe('SETD^s.3.fx.2.post^1');

    conn.fx(3).sub(4).setPost(0);
    expect(message).toBe('SETD^s.3.fx.2.post^0');
  });

  it('Media player', () => {
    conn.player.play();
    expect(message).toBe('MEDIA_PLAY');

    conn.player.pause();
    expect(message).toBe('MEDIA_PAUSE');

    conn.player.stop();
    expect(message).toBe('MEDIA_STOP');

    conn.player.next();
    expect(message).toBe('MEDIA_NEXT');

    conn.player.prev();
    expect(message).toBe('MEDIA_PREV');

    conn.player.loadPlaylist('~all~');
    expect(message).toBe('MEDIA_SWITCH_PLIST^~all~');

    conn.player.loadPlaylist('myplaylist');
    expect(message).toBe('MEDIA_SWITCH_PLIST^myplaylist');

    conn.player.loadTrack('~root~', 'mytrack.mp3');
    expect(message).toBe('MEDIA_SWITCH_TRACK^~root~^mytrack.mp3');

    conn.player.setShuffle(1);
    expect(message).toBe('SETD^settings.shuffle^1');

    conn.player.setShuffle(0);
    expect(message).toBe('SETD^settings.shuffle^0');

    conn.player.setPlayMode(0);
    expect(message).toBe('SETD^settings.playMode^0');

    conn.player.setPlayMode(2);
    expect(message).toBe('SETD^settings.playMode^2');

    conn.player.setManual();
    expect(message).toBe('SETD^settings.playMode^0');

    conn.player.setAuto();
    expect(message).toBe('SETD^settings.playMode^3');
  });

  it('2-track recorder', () => {
    conn.recorderDualTrack.recordToggle();
    expect(message).toBe('RECTOGGLE');
  });

  it('multi-track recorder', () => {
    const mtk = conn.recorderMultiTrack;

    mtk.play();
    expect(message).toBe('MTK_PLAY');

    mtk.pause();
    expect(message).toBe('MTK_PAUSE');

    mtk.stop();
    expect(message).toBe('MTK_STOP');

    mtk.recordToggle();
    expect(message).toBe('MTK_REC_TOGGLE');
  });

  it('Volume Buses', () => {
    conn.volume.solo.setFaderLevel(0.47679);
    expect(message).toBe('SETD^settings.solovol^0.47679');

    conn.volume.solo.setFaderLevel(5); // clamp upper
    expect(message).toBe('SETD^settings.solovol^1');

    conn.volume.solo.setFaderLevel(-5); // clamp lower
    expect(message).toBe('SETD^settings.solovol^0');

    conn.volume.solo.setFaderLevelDB(10);
    expect(message).toBe('SETD^settings.solovol^1');

    conn.volume.headphone(1).setFaderLevel(0.47679);
    expect(message).toBe('SETD^settings.hpvol.0^0.47679');

    conn.volume.headphone(1).setFaderLevelDB(10);
    expect(message).toBe('SETD^settings.hpvol.0^1');

    conn.volume.headphone(2).setFaderLevel(0.47679);
    expect(message).toBe('SETD^settings.hpvol.1^0.47679');

    conn.volume.headphone(3).setFaderLevelDB(10);
    expect(message).toBe('SETD^settings.hpvol.2^1');
  });

  it('show controller', () => {
    conn.shows.loadShow('testshow');
    expect(message).toBe('LOADSHOW^testshow');

    conn.shows.loadSnapshot('testshow', 'testsnapshot');
    expect(message).toBe('LOADSNAPSHOT^testshow^testsnapshot');

    conn.shows.loadCue('testshow', 'testcue');
    expect(message).toBe('LOADCUE^testshow^testcue');
  });

  describe('hw channels', () => {
    it('Ui24', () => {
      setMixerModel('ui24', conn);

      conn.hw(1).setPhantom(1);
      expect(message).toBe('SETD^hw.0.phantom^1');

      conn.hw(2).setPhantom(0);
      expect(message).toBe('SETD^hw.1.phantom^0');

      conn.hw(3).phantomOn();
      expect(message).toBe('SETD^hw.2.phantom^1');

      conn.hw(4).phantomOff();
      expect(message).toBe('SETD^hw.3.phantom^0');

      conn.hw(5).setGain(0.56789);
      expect(message).toBe('SETD^hw.4.gain^0.56789');

      conn.hw(5).setGain(-1);
      expect(message).toBe('SETD^hw.4.gain^0');

      conn.hw(6).setGainDB(57);
      expect(message).toBe('SETD^hw.5.gain^1');

      conn.hw(6).setGainDB(-6);
      expect(message).toBe('SETD^hw.5.gain^0');

      conn.hw(7).setGainDB(10);
      expect(message).toBe('SETD^hw.6.gain^0.25396825396825395');
    });

    it('Ui16', () => {
      setMixerModel('ui16', conn);

      conn.hw(1).setPhantom(1);
      expect(message).toBe('SETD^i.0.phantom^1');

      conn.hw(2).setPhantom(0);
      expect(message).toBe('SETD^i.1.phantom^0');

      conn.hw(3).phantomOn();
      expect(message).toBe('SETD^i.2.phantom^1');

      conn.hw(4).phantomOff();
      expect(message).toBe('SETD^i.3.phantom^0');

      conn.hw(5).setGain(0.56789);
      expect(message).toBe('SETD^i.4.gain^0.56789');

      conn.hw(5).setGain(-1);
      expect(message).toBe('SETD^i.4.gain^0');

      conn.hw(6).setGainDB(50);
      expect(message).toBe('SETD^i.5.gain^1');

      conn.hw(6).setGainDB(-40);
      expect(message).toBe('SETD^i.5.gain^0');

      conn.hw(7).setGainDB(10);
      expect(message).toBe('SETD^i.6.gain^0.5555555555555556');
    });

    it('Ui12', () => {
      setMixerModel('ui12', conn);

      conn.hw(1).setPhantom(1);
      expect(message).toBe('SETD^i.0.phantom^1');

      conn.hw(2).setPhantom(0);
      expect(message).toBe('SETD^i.1.phantom^0');

      conn.hw(3).phantomOn();
      expect(message).toBe('SETD^i.2.phantom^1');

      conn.hw(4).phantomOff();
      expect(message).toBe('SETD^i.3.phantom^0');

      conn.hw(5).setGain(0.56789);
      expect(message).toBe('SETD^i.4.gain^0.56789');

      conn.hw(5).setGain(-1);
      expect(message).toBe('SETD^i.4.gain^0');

      conn.hw(6).setGainDB(50);
      expect(message).toBe('SETD^i.5.gain^1');

      conn.hw(6).setGainDB(-40);
      expect(message).toBe('SETD^i.5.gain^0');

      conn.hw(7).setGainDB(10);
      expect(message).toBe('SETD^i.6.gain^0.5555555555555556');
    });
  });
});
