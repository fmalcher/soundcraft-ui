/**
 * generated from JSON with https://app.quicktype.io/?l=ts
 */

export interface MixerState {
  i?: { [key: string]: I };
  var?: Var;
  flavour?: number;
  schema?: number;
  type?: string;
  m?: M;
  settings?: Settings;
  l?: { [key: string]: LValue };
  a?: { [key: string]: AValue };
  usbdaw?: { [key: string]: Hwoutaux };
  hwouthp?: { [key: string]: Hwoutaux };
  hwouthpdsp?: { [key: string]: Hwoutaux };
  hwoutm?: { [key: string]: Hwoutaux };
  hwoutaux?: { [key: string]: Hwoutaux };
  mtk?: MixerStateMtk;
  firmware?: string;
  model?: string;
  vg?: { [key: string]: string };
  mgmask?: number;
  p?: { [key: string]: P };
  s?: { [key: string]: Empty };
  f?: { [key: string]: F };
  hw?: { [key: string]: Hw };
  automix?: Automix;
  v?: { [key: string]: V };
  afs?: MixerStateAfs;
}

export interface AValue {
  afs?: AAfs;
  eq?: AEq;
  mtx?: { [key: string]: Mtx };
  link2master?: number;
  delay?: number;
  stereoIndex?: number;
  safe?: number;
  matrix?: number;
  invert?: number;
  vca?: number;
  pan?: number;
  mix?: number;
  solo?: number;
  mgmask?: number;
  forceunmute?: number;
  mute?: number;
  gate?: Gate;
  dyn?: LClass;
  name?: string;
}

export interface AAfs {
  eq?: { [key: string]: EqValue };
  cmode?: number;
  fmode?: number;
  enabled?: number;
  clearall?: number;
  logic?: number;
  numfixed?: number;
  numtotal?: number;
  sensitivity?: number;
  livelift?: number;
  clearfixed?: number;
  clearlive?: number;
}

export enum EqValue {
  The100000000000001160000000000000000000000 = '1000.0000000000,116.0000000000,0.0000000000,0',
}

export interface LClass {
  ratio?: number;
  gain?: number;
  threshold?: number;
  bypass?: number;
  outgain?: number;
  release?: number;
  attack?: number;
  softknee?: number;
  prmod?: number;
  prname?: string;
  hold?: number;
  autogain?: number;
}

export interface AEq {
  peak?: { [key: string]: number };
  prmod?: number;
  bypass?: number;
  linked?: number;
  lpf?: number;
  hpf?: number;
}

export interface Gate {
  depth?: number;
  bypass?: number;
  prmod?: number;
  enabled?: number;
  hold?: number;
  release?: number;
  attack?: number;
  thresh?: number;
}

export interface Mtx {
  value?: number;
  pan?: number;
  postproc?: number;
  mute?: number;
  post?: number;
}

export interface MixerStateAfs {
  enabled?: number;
}

export interface Automix {
  a?: BClass;
  b?: BClass;
  time?: number;
}

export interface BClass {
  on?: number;
}

export interface F {
  mute?: number;
  pan?: number;
  mix?: number;
  safe?: number;
  solo?: number;
  mgmask?: number;
  forceunmute?: number;
  smix?: number;
  span?: number;
  subgroup?: number;
  aux?: { [key: string]: Mtx };
  dyn?: LClass;
  gate?: Gate;
  eq?: FEq;
  bpm?: number;
  par6?: number;
  vca?: number;
  bypass?: number;
  prmod?: number;
  par1?: number;
  fxtype?: number;
  par3?: number;
  par2?: number;
  par5?: number;
  par4?: number;
}

export interface FEq {
  b4?: B1;
  b3?: B1;
  b5?: B1;
  bypass?: number;
  hpf?: PurpleHpf;
  easy?: number;
  prmod?: number;
  b2?: B1;
  b1?: B1;
  lpf?: PurpleHpf;
}

export interface B1 {
  gain?: number;
  q?: number;
  freq?: number;
}

export interface PurpleHpf {
  slope?: number;
  freq?: number;
}

export interface Hw {
  gain?: number;
  hiz?: number;
  phantom?: number;
  disablegain?: number;
}

export interface Hwoutaux {
  src?: string;
}

export interface I {
  src?: string;
  scsrc?: string;
  name?: string;
  fx?: { [key: string]: Fx };
  aux?: { [key: string]: Mtx };
  gate?: Gate;
  dyn?: LClass;
  eq?: FEq;
  digitech?: Digitech;
  deesser?: Deesser;
  exclude?: number;
  mtkrec?: number;
  amixgroup?: number;
  amix?: number;
  hiz?: number;
  stereoIndex?: number;
  subgroup?: number;
  color?: number;
  delay?: number;
  vca?: number;
  solo?: number;
  mgmask?: number;
  forceunmute?: number;
  safe?: number;
  disablegain?: number;
  gain?: number;
  invert?: number;
  phantom?: number;
  mute?: number;
  pan?: number;
  mix?: number;
}

export interface Deesser {
  freq?: number;
  enabled?: number;
  ratio?: number;
  threshold?: number;
}

export interface Digitech {
  bass?: number;
  level?: number;
  gain?: number;
  treble?: number;
  mid?: number;
  enabled?: number;
  amp?: number;
  cab?: number;
}

export interface Fx {
  mute?: number;
  value?: number;
  post?: number;
}

export interface LValue {
  scsrc?: string;
  src?: string;
  pan?: number;
  mix?: number;
  fx?: { [key: string]: Fx };
  aux?: { [key: string]: Mtx };
  gate?: Gate;
  dyn?: LClass;
  eq?: FEq;
  vca?: number;
  mtkrec?: number;
  solo?: number;
  mgmask?: number;
  forceunmute?: number;
  mute?: number;
  gain?: number;
  safe?: number;
  stereoIndex?: number;
  subgroup?: number;
  invert?: number;
  phantom?: number;
  delay?: number;
}

export interface M {
  name?: string;
  afs?: AAfs;
  mtx?: { [key: string]: Mtx };
  delayR?: number;
  delayL?: number;
  r?: RClass;
  l?: RClass;
  pan?: number;
  mix?: number;
  dim?: number;
  safe?: number;
  dyn?: MDyn;
  eq?: MEq;
  gate?: Gate;
}

export interface MDyn {
  bypass?: number;
  prmod?: number;
  l?: LClass;
  linked?: number;
  r?: LClass;
}

export interface MEq {
  peak?: Peak;
  hpf?: FluffyHpf;
  lpf?: FluffyHpf;
  prmod?: number;
  linked?: number;
  bypass?: number;
}

export interface FluffyHpf {
  l?: number;
  r?: number;
}

export interface Peak {
  r?: { [key: string]: number };
  l?: { [key: string]: number };
}

export interface RClass {
  invert?: number;
}

export interface MixerStateMtk {
  scout?: { [key: string]: string };
  out?: { [key: string]: string };
}

export interface P {
  aux?: { [key: string]: Mtx };
  fx?: { [key: string]: Fx };
  dyn?: LClass;
  gate?: Gate;
  eq?: FEq;
  vca?: number;
  subgroup?: number;
  stereoIndex?: number;
  mute?: number;
  pan?: number;
  mix?: number;
  safe?: number;
  solo?: number;
  mgmask?: number;
  forceunmute?: number;
}

export interface Empty {
  mtx?: { [key: string]: Mtx };
  gate?: Gate;
  dyn?: LClass;
  eq?: FEq;
  forceunmute?: number;
  mute?: number;
  pan?: number;
  mix?: number;
  safe?: number;
  solo?: number;
  mgmask?: number;
  fx?: { [key: string]: Fx };
  exclude?: number;
  ducker?: number;
}

export interface Settings {
  udpcoms?: string;
  cue?: number;
  playMode?: number;
  footswitchfunc?: number;
  solotype?: number;
  recordMode?: number;
  fsmgidx?: number;
  iosys?: number;
  mtk?: SettingsMtk;
  player?: Player;
  soloMode?: number;
  multiplesolo?: number;
  cascade?: SettingsCascade;
  maxconn?: number;
  clock?: number;
  block?: { [key: string]: number };
  demo?: number;
  solovol?: number;
  mtxsendpoint?: number;
  hpvol?: { [key: string]: number };
  hpswap?: number;
  auxmutelink?: number;
  underscan?: number;
  auxsendpoint?: number;
  nophantomonboot?: number;
  afsonboot?: number;
  shuffle?: number;
}

export interface SettingsCascade {
  vcasync?: number;
  mgsync?: number;
  master?: number;
  enabled?: number;
  snapsync?: number;
}

export interface SettingsMtk {
  format?: number;
}

export interface Player {
  dualmono?: number;
}

export interface V {
  mgmask?: number;
  forceunmute?: number;
  solo?: number;
  mute?: number;
  mix?: number;
}

export interface Var {
  afsdata?: string;
  rta?: string;
  currentPlaylist?: string;
  currentTrack?: string;
  currentShow?: string;
  currentSnapshot?: string;
  nophantom?: number;
  asosec?: number;
  pongtime?: number;
  footswitch?: number;
  hpaux?: number;
  rswgpio?: number;
  fswgpio?: number;
  mtk?: VarMtk;
  cascade?: VarCascade;
  unsaved?: Unsaved;
  currentState?: number;
  currentLength?: number;
  isRecording?: number;
  playBusy?: number;
  shuffle?: number;
  recBusy?: number;
  present?: number;
  spior?: number;
  spiec?: number;
  spimb?: number;
  spioa?: number;
  spids?: number;
  currentTrackPos?: number;
  sdram?: number;
  usbfill?: number;
  spien?: number;
}

export interface VarCascade {
  connected?: number;
}

export interface VarMtk {
  rec?: Rec;
  present?: number;
  soundcheck?: number;
  currentLength?: number;
  currentTrackPos?: number;
  currentState?: number;
  freespace?: number;
  busy?: number;
  dropouts?: number;
  bufferfill?: number;
}

export interface Rec {
  currentState?: number;
  time?: number;
  busy?: number;
}

export interface Unsaved {
  mutegroups?: number;
  chsafes?: number;
}
