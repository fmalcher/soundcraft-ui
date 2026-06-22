import { Observable } from 'rxjs';
import { Easings } from '../utils/transitions/easings';

export interface FadeableChannel {
  /** Name of the channel */
  name$: Observable<string>;

  faderLevel$: Observable<number>;
  faderLevelDB$: Observable<number>;

  fadeTo(targetValue: number, fadeTime: number, easing: Easings, fps?: number): Promise<void>;

  fadeToDB(targetValueDB: number, fadeTime: number, easing: Easings, fps?: number): Promise<void>;

  setFaderLevel(value: number): void;
  setFaderLevelDB(dbValue: number): void;

  changeFaderLevel(offset: number): void;
  changeFaderLevelDB(offsetDB: number): void;
}

export interface PannableChannel {
  pan$: Observable<number>;

  setPan(value: number): void;
  changePan(offset: number): void;
}

export interface PostProcessableChannel {
  /** PRE/POST PROC value of the channel (`1` (POST PROC) or `0` (PRE PROC)) */
  postProc$: Observable<number>;

  setPostProc(value: number): void;
  postProc(): void;
  preProc(): void;
}
