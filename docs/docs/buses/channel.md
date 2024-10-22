---
sidebar_position: 1
---

# Generic Channel Operations

All channels on all buses have similar behavior.
Therefore, these operations are available for any channel like `MasterChannel`, `FxChannel` or `AuxChannel`:

## Fader Level

| Call                           | Description                                                   |
| ------------------------------ | ------------------------------------------------------------- |
| `faderLevel$`                  | Get fader level (between `0` and `1`)                         |
| `faderLevelDB$`                | Get fader level in dB (between `-Infinity` and `10`)          |
| `setFaderLevel(value)`         | Set fader level (between `0` and `1`)                         |
| `setFaderLevelDB(dbValue)`     | Set fader level in dB (between `-Infinity` and `10`)          |
| `changeFaderLevelDB(offsetDB)` | Change fader level relatively by adding a given value (in dB) |
| `fadeTo(value, fadeTime)`      | Fade channel to value (between `0` and `1`)                   |
| `fadeToDB(value, fadeTime)`    | Fade channel to dB value (between `-Infinity` and `10`)       |

## Mute

| Call             | Description                       |
| ---------------- | --------------------------------- |
| `setMute(value)` | Set mute for channel (`0` or `1`) |
| `mute()`         | Mute channel                      |
| `unmute()`       | Unmute channel                    |
| `toggleMute()`   | Toggle mute status                |
| `mute$`          | Get mute status (`0` or `1`)      |

## Other operations

| Call    | Description                      |
| ------- | -------------------------------- |
| `name$` | Get readable name of the channel |
