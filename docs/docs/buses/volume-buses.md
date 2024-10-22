---
sidebar_position: 6
---

# SOLO and Headphone Buses

SOLO and Headphone Outputs live on separate internal buses that have individual volume faders in the settings section of the web app.
Get access to a `VolumeBus` object through `conn.volume`:

| Call                       | Description        |
| -------------------------- | ------------------ |
| `conn.volume.solo`         | SOLO bus           |
| `conn.volume.headphone(1)` | Headphone 1 Volume |
| `conn.volume.headphone(2)` | Headphone 2 Volume |

A `VolumeBus` supports the following operations (which are quite similar to all other fadeable channels):

| Call on `VolumeBus`            | Description                                                   |
| ------------------------------ | ------------------------------------------------------------- |
| `faderLevel$`                  | Get fader level (between `0` and `1`)                         |
| `faderLevelDB$`                | Get fader level in dB (between `-Infinity` and `10`)          |
| `setFaderLevel(value)`         | Set fader level (between `0` and `1`)                         |
| `setFaderLevelDB(dbValue)`     | Set fader level in dB (between `-Infinity` and `10`)          |
| `changeFaderLevelDB(offsetDB)` | Change fader level relatively by adding a given value (in dB) |
| `fadeTo(value, fadeTime)`      | Fade channel to value (between `0` and `1`)                   |
| `fadeToDB(value, fadeTime)`    | Fade channel to dB value (between `-Infinity` and `10`)       |
