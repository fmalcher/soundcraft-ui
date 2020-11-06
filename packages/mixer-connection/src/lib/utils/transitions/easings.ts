export enum Easings {
  Linear,
  EaseIn,
  EaseOut,
  EaseInOut,
}

export const easingFunctions: { [key in Easings]: (t: number) => number } = {
  [Easings.Linear]: (t: number) => t,
  [Easings.EaseIn]: (t: number) => t * t,
  [Easings.EaseOut]: (t: number) => t * (2 - t),
  [Easings.EaseInOut]: (t: number) => t * (2 - t),
};
