---
sidebar_position: 1
---

# FX Settings

The mixer has up to four FX processors. Their settings can be access through the `FxBus` class, e.g. `conn.fx(1)`.
At the moment, this interface only supports BPM setting and information about the FX type.

## FX Type

The selected type of FX is represented as a number internally. The `fxType$` property exposes an Observable stream of type `FxType` (enum).
The exported utility function `fxTypeToString()` converts a numeric `FxType` to a readable type name, e.g. `1` is converted to `Delay`.
The FX type can not be changed through this library.

| Numeric value | FX Type                                        |
| ------------- | ---------------------------------------------- |
| `-1`          | None (temporary value when switching FX types) |
| `0`           | Reverb                                         |
| `1`           | Delay                                          |
| `2`           | Chorus                                         |
| `3`           | Room                                           |

<!-- prettier-ignore -->
```ts
// numeric values of type `FxType`
conn.fx(1).fxType$.subscribe(v => { /* ... */ });

// string values (Reverb, Delay, ...)
conn.fx(1).fxType$.pipe(
  map(v => fxTypeToString(e))
).subscribe(v => { /* ... */ });
```

## BPM

Each FX has an individual BPM setting. This value is always present but might not be actually used if the selected FX does not have a BPM setting.
It can be accessed through the `bpm$` stream. The method `setBpm()` allows to set the BPM value for an FX.

| Call on `FxBus` | Description                                       |
| --------------- | ------------------------------------------------- |
| `bpm$`          | BPM value of this FX                              |
| `setBpm(value)` | Set BPM value of this FX (between `20` and `400`) |

:::info[Global Tap]

The Soundcraft Web App features a global "TAP TEMPO" button. It is also possible to exclude each FX from the global tap.
Please note that this behavior is not implemented in this library. If you want to set the BPM for multiple/all FX, you have to use the `setBpm()` method on multiple `FxBus` objects.

:::

## FX Parameters

The parameters of the FX processors can be controlled through the `FxBus` class.
Since the FX type can change at runtime (different FX types can be selected in the web app), this library only offers generic FX parameters in a linear range of `0..1`.
Dependent of the selected FX type, the parameters have different meanings.
Each FX has a maximum of 6 parameters, but some FX types do not use all of them.

`FxBus` offers the following methods for parameter processing.
`getParam()` returns an `Observable<number>` which can be subscribed to.
The `param` argument has to be an integer number between `1` and `6`.

| Call on `FxBus`          | Description                                                   |
| ------------------------ | ------------------------------------------------------------- |
| `getParam(param)`        | Get linear values of one FX parameter as an Observable stream |
| `setParam(param, value)` | Set linear value for one FX parameter                         |

```ts
// Get FX Param 2 on FX 1
conn.fx(1).getParam(2).subscribe(v => /* ... */);

// Set FX Param 3 on FX 4 with value 0.75
conn.fx(4).setParam(3, 0.75);
```

All values are linear values between `0` and `1`.
The library does not offer conversion from/to physical units for FX parameters.
