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
| `setBpm(value)` | Set BPM value of this FX (between `1` and `1000`) |

:::info[Global Tap]

The Soundcraft Web App features a global "TAP TEMPO" button. It is also possible to exclude each FX from the global tap.
Please note that this behavior is not implemented in this library. If you want to set the BPM for multiple/all FX, you have to use the `setBpm()` method on multiple `FxBus` objects.

:::
