export interface StereoVuData {
  vuPostL: number;
  vuPostR: number;
  vuPostFaderL: number;
  vuPostFaderR: number;
}

export interface InputChannelVuData {
  vuPre: number;
  vuPost: number;
  vuPostFader: number;
}

export interface AuxChannelVuData {
  vuPost: number;
  vuPostFader: number;
}

export interface MasterVuData {
  vuPost: number;
  vuPostFader: number;
}

export type FxVuData = StereoVuData;
export type SubGroupVuData = StereoVuData;
export type StereoMasterVuData = SubGroupVuData;

export interface VuData {
  input: InputChannelVuData[];
  player: InputChannelVuData[];
  sub: SubGroupVuData[];
  fx: FxVuData[];
  aux: AuxChannelVuData[];
  master: MasterVuData[];
  line: InputChannelVuData[];
}
