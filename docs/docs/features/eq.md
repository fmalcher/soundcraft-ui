---
sidebar_position: 5
---

# Channel EQ

Input, line, player, FX and sub group channels on the master bus have a parametric EQ with four bands and a high-pass filter.
Input channels on the Ui24R also have a low-pass filter.
The EQ is available through the `eq` property of the `MasterChannel`:

```ts
const eq = conn.master.input(3).eq;
```

AUX channels (graphic EQ) and VCA channels have no parametric EQ, so accessing `eq` on them throws an error.
When channels are stereo-linked, all EQ settings are applied to both channels.

## EQ on/off

| Call on `ChannelEq` | Description                                                             |
| ------------------- | ----------------------------------------------------------------------- |
| `enabled$`          | Whether the EQ is switched on (the inverted bypass switch of the mixer) |
| `setEnabled(value)` | Switch the EQ on (`true`) or off (`false`)                              |
| `enable()`          | Switch the EQ on                                                        |
| `disable()`         | Switch the EQ off (bypass)                                              |
| `toggle()`          | Toggle the EQ on/off                                                    |
| `band(n)`           | Get EQ band `n` (between `1` and `4`), see below                        |
| `hpf`               | High-pass filter, see below                                             |
| `lpf`               | Low-pass filter (input channels only, Ui24R only), see below            |

## EQ bands

Each of the four bands is a bell filter with frequency, bandwidth (Q) and gain.

```ts
const band = conn.master.input(3).eq.band(2);
band.setFrequency(2500);
band.setQ(1.4);
band.setGainDB(-3);
```

| Call on `EqBand`         | Description                                                                |
| ------------------------ | -------------------------------------------------------------------------- |
| `frequency$`             | Center frequency in Hz (between `20` and `22050`)                          |
| `setFrequency(hz)`       | Set the center frequency in Hz (between `20` and `22050`)                  |
| `q$`                     | Bandwidth as Q value (between `0.05` and `15`, higher values are narrower) |
| `setQ(q)`                | Set the bandwidth as Q value (between `0.05` and `15`)                     |
| `gain$`                  | Linear gain (between `0` and `1`, `0.5` is 0 dB)                           |
| `gainDB$`                | Gain in dB (between `-20` and `20`)                                        |
| `setGain(value)`         | Set the linear gain (between `0` and `1`)                                  |
| `setGainDB(dbValue)`     | Set the gain in dB (between `-20` and `20`)                                |
| `changeGainDB(offsetDB)` | Change the gain relatively by adding a given value (dB)                    |

## High-pass and low-pass filter

The high-pass filter (`eq.hpf`) and the low-pass filter (`eq.lpf`) are objects of type `EqFilter`.
The low-pass filter only exists on input channels of the Ui24R.
A filter is switched off with its lowest (high-pass) or highest (low-pass) frequency.

| Call on `EqFilter` | Description                                                                                              |
| ------------------ | -------------------------------------------------------------------------------------------------------- |
| `enabled$`         | Whether the filter is switched on                                                                        |
| `frequency$`       | Frequency in Hz (`20` for a switched off high-pass, `22050` for a switched off low-pass filter)          |
| `setFrequency(hz)` | Set the frequency and switch the filter on. High-pass: `20` to `1000` Hz, low-pass: `1000` to `22050` Hz |
| `disable()`        | Switch the filter off                                                                                    |
| `slope$`           | Slope in dB/oct (`12`, `24` or `36`, Ui24R only)                                                         |
| `setSlope(slope)`  | Set the slope to `12`, `24` or `36` dB/oct (Ui24R only)                                                  |

## Value conversion

Internally, the mixer stores all EQ values as linear values between `0` and `1`.
Frequency and Q use a logarithmic scale, the gain a linear scale.
The library exports the conversion functions, e.g. for your own controls:

| Function                        | Description                                    |
| ------------------------------- | ---------------------------------------------- |
| `frequencyToFaderValue(hz)`     | Frequency (`20` to `22050` Hz) to linear value |
| `faderValueToFrequency(value)`  | Linear value to frequency in Hz                |
| `qToFaderValue(q)`              | Q (`0.05` to `15`) to linear value             |
| `faderValueToQ(value)`          | Linear value to Q                              |
| `eqGainDBToFaderValue(dbValue)` | Band gain (`-20` to `20` dB) to linear value   |
| `faderValueToEqGainDB(value)`   | Linear value to band gain in dB                |

The curves are the ones used by the mixer's web app ([#228](https://github.com/fmalcher/soundcraft-ui/issues/228)).
They reproduce the default values of a Ui24R exactly, e.g. the default bands at 200 Hz, 1 kHz, 4 kHz and 10 kHz with Q 1.
