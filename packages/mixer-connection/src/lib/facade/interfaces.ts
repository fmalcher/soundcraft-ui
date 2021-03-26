import { Observable } from 'rxjs';
import { Easings } from '../utils/transitions/easings';

export interface FadeableChannel {
  faderLevel$: Observable<number>;
  faderLevelDB$: Observable<number>;

  fadeTo(targetValue: number, fadeTime: number, easing: Easings, fps?: number): void;

  fadeToDB(targetValueDB: number, fadeTime: number, easing: Easings, fps?: number): void;

  setFaderLevel(value: number): void;
  setFaderLevelDB(dbValue: number): void;

  changeFaderLevelDB(dbValueToAdd: number): void;
}

export interface PannableChannel {
  pan$: Observable<number>;

  pan(value: number): void;
}
