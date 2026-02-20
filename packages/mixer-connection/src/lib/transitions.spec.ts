import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Subject, of, firstValueFrom, toArray } from 'rxjs';

import { generateTransition, sourcesToTransition, TransitionSource } from './transitions';
import { Easings } from './utils/transitions/easings';
import { MixerConnection } from './mixer-connection';
import { ConnectionStatus } from './types';

describe('generateTransition', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('should emit values from source to target for a linear transition', async () => {
    const resultPromise = firstValueFrom(
      generateTransition(0, 1, 1000, Easings.Linear, 10).pipe(toArray()),
    );

    await vi.advanceTimersByTimeAsync(1000);
    const values = await resultPromise;

    expect(values[0]).toBe(0.1);
    expect(values[values.length - 1]).toBe(1);
  });

  it('should emit the correct number of steps', async () => {
    const fps = 10;
    const fadeTime = 1000;
    const stepTime = Math.round(1000 / fps); // 100
    const expectedSteps = Math.round(fadeTime / stepTime); // 10

    const resultPromise = firstValueFrom(
      generateTransition(0, 1, fadeTime, Easings.Linear, fps).pipe(toArray()),
    );

    await vi.advanceTimersByTimeAsync(1000);
    const values = await resultPromise;

    expect(values.length).toBe(expectedSteps);
  });

  it('should clamp fadeTime to minimum of fps value', async () => {
    const fps = 10;
    const fadeTime = 1; // very small, should be clamped to fps (10)

    const resultPromise = firstValueFrom(
      generateTransition(0, 1, fadeTime, Easings.Linear, fps).pipe(toArray()),
    );

    await vi.advanceTimersByTimeAsync(5000);
    const values = await resultPromise;

    // clamped fadeTime = max(1, 10) = 10, stepTime = round(1000/10) = 100
    // steps = round(10 / 100) = 0: completes immediately with no emissions
    expect(values).toEqual([]);
  });

  it('should fall back to Linear easing for falsy easing value', async () => {
    const resultPromise = firstValueFrom(
      generateTransition(0, 1, 1000, 0 as Easings, 10).pipe(toArray()),
    );

    await vi.advanceTimersByTimeAsync(1000);
    const values = await resultPromise;

    // Easings.Linear is 0, which is falsy. The code does: easing = easing || Easings.Linear
    // Since 0 is falsy, it stays Linear.
    expect(values[0]).toBeCloseTo(0.1);
    expect(values[values.length - 1]).toBe(1);
  });

  it('should fall back to Linear easing for invalid easing value', async () => {
    const resultPromise = firstValueFrom(
      generateTransition(0, 1, 1000, 999 as Easings, 10).pipe(toArray()),
    );

    await vi.advanceTimersByTimeAsync(1000);
    const values = await resultPromise;

    // Invalid easing => fallback to Linear via easingFunctions[Easings.Linear]
    expect(values[0]).toBeCloseTo(0.1);
    expect(values[values.length - 1]).toBe(1);
  });

  it('should filter duplicate values', async () => {
    // When source === target, all computed values are the same
    const resultPromise = firstValueFrom(
      generateTransition(0.5, 0.5, 1000, Easings.Linear, 10).pipe(toArray()),
    );

    await vi.advanceTimersByTimeAsync(1000);
    const values = await resultPromise;

    // All values would be 0.5, only the first is kept
    expect(values).toEqual([0.5]);
  });

  it('should handle transition from high to low value', async () => {
    const resultPromise = firstValueFrom(
      generateTransition(1, 0, 1000, Easings.Linear, 10).pipe(toArray()),
    );

    await vi.advanceTimersByTimeAsync(1000);
    const values = await resultPromise;

    expect(values[0]).toBeCloseTo(0.9);
    expect(values[values.length - 1]).toBe(0);
  });
});

describe('sourcesToTransition', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('should get the current fader level as source value', async () => {
    const statusSubject$ = new Subject<{ type: ConnectionStatus }>();
    const conn = { status$: statusSubject$.asObservable() } as MixerConnection;

    const transitionSources$ = new Subject<TransitionSource>();
    const faderLevel$ = of(0.2); // current fader level

    const values: number[] = [];
    sourcesToTransition(transitionSources$, faderLevel$, conn).subscribe(v => values.push(v));

    transitionSources$.next({
      targetValue: 0.8,
      fadeTime: 500,
      easing: Easings.Linear,
      fps: 10,
    });

    await vi.advanceTimersByTimeAsync(500);

    // First value should start from 0.2 towards 0.8
    expect(values.length).toBeGreaterThan(0);
    expect(values[0]).toBeGreaterThan(0.2);
    expect(values[values.length - 1]).toBeCloseTo(0.8);
  });

  it('should stop on connection close', async () => {
    const statusSubject$ = new Subject<{ type: ConnectionStatus }>();
    const conn = { status$: statusSubject$.asObservable() } as MixerConnection;

    const transitionSources$ = new Subject<TransitionSource>();
    const faderLevel$ = of(0);

    const values: number[] = [];
    sourcesToTransition(transitionSources$, faderLevel$, conn).subscribe(v => values.push(v));

    transitionSources$.next({
      targetValue: 1,
      fadeTime: 10000,
      easing: Easings.Linear,
      fps: 10,
    });

    // Advance a bit, then close
    await vi.advanceTimersByTimeAsync(300);
    const countBefore = values.length;

    statusSubject$.next({ type: ConnectionStatus.Close });
    await vi.advanceTimersByTimeAsync(10000);

    // No more values should have been emitted after close
    expect(values.length).toBe(countBefore);
  });
});
