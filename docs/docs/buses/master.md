---
sidebar_position: 0
---

# Master

The following operations can be used to interact with the global master fader.

| Call                                       | Description                                                                |
| ------------------------------------------ | -------------------------------------------------------------------------- |
| `conn.master.setFaderLevel(value)`         | Set the master fader level (between `0` and `1`)                           |
| `conn.master.setFaderLevelDB(dbValue)`     | Set the master fader level in dB (between `-Infinity` and `10`)            |
| `conn.master.changeFaderLevelDB(offsetDB)` | Change the master fader level relatively by adding a given value (in dB)   |
| `conn.master.fadeTo(value, fadeTime)`      | Fade master to value (between `0` and `1`)                                 |
| `conn.master.fadeToDB(value, fadeTime)`    | Fade master to dB value (between `-Infinity` and `10`)                     |
| `conn.master.pan(value)`                   | Set the master pan (between `0` and `1`)                                   |
| `conn.master.setDelayL(ms)`                | Set left delay (ms) of the master output (between `0` and `500`)           |
| `conn.master.setDelayR(ms)`                | Set right delay (ms) of the master output (between `0` and `500`)          |
| `conn.master.changeDelayL(offsetMs)`       | Relatively change left delay (ms) of the master output (maximum `500` ms)  |
| `conn.master.changeDelayR(offsetMs)`       | Relatively change right delay (ms) of the master output (maximum `500` ms) |
| `conn.master.dim()`                        | Dim master                                                                 |
| `conn.master.undim()`                      | Undim master                                                               |
| `conn.master.toggleDim()`                  | Toggle master dim                                                          |
| `conn.master.setDim(value)`                | Set master dim (`0` or `1`)                                                |
| `conn.master.faderLevel$`                  | Get master fader level (between `0` and `1`)                               |
| `conn.master.faderLevelDB$`                | Get master fader level in dB (between `-Infinity` and `10`)                |
| `conn.master.pan$`                         | Get master pan value (between `0` and `1`)                                 |
| `conn.master.dim$`                         | Get master dim status (`0` or `1`)                                         |
| `conn.master.delayL$`                      | Get left delay (ms) of the master output (between `0` and `500`)           |
| `conn.master.delayR$`                      | Get right delay (ms) of the master output (between `0` and `500`)          |
