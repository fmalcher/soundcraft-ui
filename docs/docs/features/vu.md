---
sidebar_position: 0
title: VU Meter
---

# VU Meter for channel volume levels

Volume levels can be consumed through the `VuProcessor` class, fully separated from the `MasterChannel` class.
The VU information is published through streams, separated by channel.
Please be aware that only channels on the master bus are available.

```ts
conn.vuProcessor.input(1);
conn.vuProcessor.aux(2);
```

| Call on `VuProcessor` | Description      |
| --------------------- | ---------------- |
| `master()`            | Master           |
| `input(2)`            | Input 2          |
| `line(1)`             | Line Input 1     |
| `player(1)`           | Player channel 1 |
| `aux(2)`              | AUX channel 2    |
| `fx(3)`               | FX channel 3     |
| `sub(3)`              | Sub group 3      |

Each of the method calls directly returns an Observable that can be subscribed to.
The streams emit objects with different VU values.
They are always published as linear values between `0` and `1`.

```ts
// for input channels
{
  vuPre: 0.5; // input level before processing (EQ, Gate, Comp)
  vuPost: 0.5; // level after processing, represented by the blue bars in the Web UI
  vuPostFader: 0.5; // actual channel output level, represented by the colored bars in the Web UI
}
```

The `vuPre` field is only available on input channels (input, player and line).
Master, FX and Sub groups publish stereo information, so the object is structured as follows:

```ts
// for FX, sub group and master
{
  vuPostL: 0.3,
  vuPostR: 0.3,
  vuPostFaderL: 0.4,
  vuPostFaderR: 0.4,
}
```

Processing of the VU information happens lazily: VU messages from the mixer are ignored until the first VU stream is subscribed to. The messages are only processed if VU information is actually consumed.

## All channels

The `vuData$` field on `VuProcessor` publishes a raw object with all channel VU information available.
This can be used to process all information at once, e.g. for a VU meter dashboard across all channels.

```ts
conn.vuProcessor.vuData$;
```

## VU values in dB

All VU values are linear values between `0` and `1`. To express the level in dB you need to project the value to the dB range of the meter (`-80..0 dB`).
The exported utility function `vuValueToDB()` helps with that task and can be used as follows:

```ts
conn.vuProcessor
  .master()
  .pipe(map(data => vuValueToDB(data.vuPostFaderL)))
  .subscribe(/* ... */);
```
