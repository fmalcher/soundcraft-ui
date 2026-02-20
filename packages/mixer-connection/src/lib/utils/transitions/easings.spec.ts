import { describe, it, expect } from 'vitest';
import { Easings, easingFunctions } from './easings';

describe('Easings', () => {
  const steps = Array.from({ length: 11 }, (_, i) => i / 10); // 0, 0.1, ..., 1

  it('Linear', () => {
    const result = steps.map(easingFunctions[Easings.Linear]);
    expect(result).toMatchInlineSnapshot(`
      [
        0,
        0.1,
        0.2,
        0.3,
        0.4,
        0.5,
        0.6,
        0.7,
        0.8,
        0.9,
        1,
      ]
    `);
  });

  it('EaseIn', () => {
    const result = steps.map(easingFunctions[Easings.EaseIn]);
    expect(result).toMatchInlineSnapshot(`
      [
        0,
        0.010000000000000002,
        0.04000000000000001,
        0.09,
        0.16000000000000003,
        0.25,
        0.36,
        0.48999999999999994,
        0.6400000000000001,
        0.81,
        1,
      ]
    `);
  });

  it('EaseOut', () => {
    const result = steps.map(easingFunctions[Easings.EaseOut]);
    expect(result).toMatchInlineSnapshot(`
      [
        0,
        0.19,
        0.36000000000000004,
        0.51,
        0.6400000000000001,
        0.75,
        0.84,
        0.9099999999999999,
        0.96,
        0.9900000000000001,
        1,
      ]
    `);
  });

  it('EaseInOut', () => {
    const result = steps.map(easingFunctions[Easings.EaseInOut]);
    expect(result).toMatchInlineSnapshot(`
      [
        0,
        0.028000000000000004,
        0.10400000000000002,
        0.216,
        0.3520000000000001,
        0.5,
        0.648,
        0.7839999999999999,
        0.8960000000000001,
        0.972,
        1,
      ]
    `);
  });
});
