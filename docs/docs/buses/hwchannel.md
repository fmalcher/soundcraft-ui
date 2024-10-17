---
sidebar_position: 5
---

# Hardware Channels (Phantom Power)

A `HwChannel` represents a hardware input on the mixer. It can be used to control input gain and phantom power.

:::info

On the Ui24R, hardware inputs can be patched to different channels. This is why a hardware channel is not always the same as an input.
This distinction is also visible in the original protocol of the mixer as well as in the UI (Phantom Power/Gain are on another page than the input faders).
For Ui16 and Ui12, those hardware settings are part of the input channels internally.
To keep the library surface clean, this library considers the mixer model in the background and offers all options through the `HwChannel` class.

:::

First, get a `HwChannel` by calling `conn.hw(inputNumber)`, e.g. `conn.hw(1)` for the first input.

| Call on `HwChannel`      | Description                                            |
| ------------------------ | ------------------------------------------------------ |
| `phantomOn()`            | Switch ON phantom power                                |
| `phantomOff()`           | Switch OFF phantom power                               |
| `togglePhantom()`        | Toggle phantom power status                            |
| `setPhantom(value)`      | Set phantom power status (`0` or `1`)                  |
| `setGain(value)`         | Set gain (between `0` and `1`)                         |
| `setGainDB(dbValue)`     | Set gain in dB (between `-6` and `57`)                 |
| `changeGainDB(offsetDB)` | Change gain relatively by adding a given value (in dB) |
| `phantom$`               | Get phantom power status (`0` or `1`)                  |
| `gain$`                  | Linear gain level of the channel (between `0` and `1`) |
| `gainDB$`                | dB gain level of the channel (between `-6` and `57`)   |

Please note that the value conversion for gain dB values in the original Web UI is not exact.
Values emitted by `gain$` may differ from the values visible in the UI.
