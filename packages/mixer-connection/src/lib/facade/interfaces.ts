import { Observable } from 'rxjs';
import { Easings } from '../utils/transitions/easings';

export interface FadeableChannel {
  /** Name of the channel */
  readonly name$: Observable<string>;

  readonly faderLevel$: Observable<number>;
  readonly faderLevelDB$: Observable<number>;

  fadeTo(targetValue: number, fadeTime: number, easing: Easings, fps?: number): Promise<void>;

  fadeToDB(targetValueDB: number, fadeTime: number, easing: Easings, fps?: number): Promise<void>;

  setFaderLevel(value: number): void;
  setFaderLevelDB(dbValue: number): void;

  changeFaderLevel(offset: number): void;
  changeFaderLevelDB(offsetDB: number): void;
}

export interface PannableChannel {
  readonly pan$: Observable<number>;

  setPan(value: number): void;
  changePan(offset: number): void;
}

export interface PostProcessableChannel {
  /** PRE/POST PROC state of the channel (`false` for PRE PROC, `true` for POST PROC) */
  readonly postProc$: Observable<boolean>;

  setPostProc(value: boolean): void;
  postProc(): void;
  preProc(): void;
}
