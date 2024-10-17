---
sidebar_position: 1
---

# Transitions

All channels can perform timed transitions to a given value.
`Channel` and `MasterBus` contain two methods `fadeTo` and `fadeToDB` with the following parameters:

| Parameter     | Description                                                                                                                                               |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `targetValue` | Value to fade to. The method `fadeTo` takes a linear value between `0` and `1`, the `fadeToDB` method takes the value in dB between `-Infinity` and `10`. |
| `fadeTime`    | Fade time in milliseconds (ms)                                                                                                                            |
| `easing`      | optional: easing characteristic. This needs to be an entry of the `Easings` enum, see below. Defaults to linear (= no easing).                            |
| `fps`         | optional: frames/ticks per second, defaults to `25`. Usually, you don't need to change this.                                                              |

Both methods return a `Promise` object that resolves when the transition time is finished.
You can use this signal to wait for the transition before starting another operation.
Please note that this signal is just implemented as a simple timer. If the transition stops for other reasons (interrupt by another transition or terminated connection), the timer will still run.

```ts
// Example:
// Fade input 1 on master bus to 0 dB within 2 seconds
// using the "ease out" characteristic
conn.master.input(1).fadeToDB(0, 2000, Easings.EaseOut);
```

A transition stops when a new transition is started on the same channel.
When the connection is closed, all running transitions will be stopped.

The library supports the following built-in easing characteristics:

```ts
import { Easings } from 'soundcraft-ui-connection';

Easings.Linear; // no easing
Easings.EaseIn; // acceleration from zero velocity (slow start)
Easings.EaseOut; // deceleration to zero velocity (slow end)
Easings.EaseInOut; // acceleration until halfway, then deceleration (slow start and end)
```
