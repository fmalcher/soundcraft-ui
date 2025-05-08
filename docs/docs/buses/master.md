---
sidebar_position: 0
---

# Master

The following operations can be used to interact with the global master fader.
`conn.master` returns an object of type `MasterBus`.

## Fader Level

| Call on `MasterBus`            | Description                                                              |
| ------------------------------ | ------------------------------------------------------------------------ |
| `faderLevel$`                  | Get master fader level (between `0` and `1`)                             |
| `faderLevelDB$`                | Get master fader level in dB (between `-Infinity` and `10`)              |
| `setFaderLevel(value)`         | Set the master fader level (between `0` and `1`)                         |
| `setFaderLevelDB(dbValue)`     | Set the master fader level in dB (between `-Infinity` and `10`)          |
| `changeFaderLevelDB(offsetDB)` | Change the master fader level relatively by adding a given value (in dB) |
| `fadeTo(value, fadeTime)`      | Fade master to value (between `0` and `1`)                               |
| `fadeToDB(value, fadeTime)`    | Fade master to dB value (between `-Infinity` and `10`)                   |

## Pan

| Call on `MasterBus` | Description                                |
| ------------------- | ------------------------------------------ |
| `pan$`              | Get master pan value (between `0` and `1`) |
| `setPan(value)`     | Set the master pan (between `0` and `1`)   |

## Delay

| Call on `MasterBus`      | Description                                                                |
| ------------------------ | -------------------------------------------------------------------------- |
| `delayL$`                | Get left delay (ms) of the master output (between `0` and `500`)           |
| `delayR$`                | Get right delay (ms) of the master output (between `0` and `500`)          |
| `setDelayL(ms)`          | Set left delay (ms) of the master output (between `0` and `500`)           |
| `setDelayR(ms)`          | Set right delay (ms) of the master output (between `0` and `500`)          |
| `changeDelayL(offsetMs)` | Relatively change left delay (ms) of the master output (maximum `500` ms)  |
| `changeDelayR(offsetMs)` | Relatively change right delay (ms) of the master output (maximum `500` ms) |

## DIM (Ui24R only)

| Call on `MasterBus` | Description                        |
| ------------------- | ---------------------------------- |
| `dim$`              | Get master dim status (`0` or `1`) |
| `dim()`             | Dim master                         |
| `undim()`           | Undim master                       |
| `toggleDim()`       | Toggle master dim                  |
| `setDim(value)`     | Set master dim (`0` or `1`)        |

## Other operations

| Call    | Description                      |
| ------- | -------------------------------- |
| `name$` | Get readable name of the channel |
