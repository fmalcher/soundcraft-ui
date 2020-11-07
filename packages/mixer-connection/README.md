# soundcraft-ui-connection

[![npm](https://img.shields.io/npm/v/soundcraft-ui-connection.svg)](https://www.npmjs.com/package/soundcraft-ui-connection)

This library provides a generic connection interface for the Soundcraft Ui series audio mixers (Ui12, Ui16 and Ui24R).

## Installation

```sh
npm i soundcraft-ui-connection
```

## Usage

### Initialization and connection

```ts
import { SoundcraftUI } from 'soundcraft-ui-connection';

const conn = new SoundcraftUI(mixerIP);
conn.connect();

conn.disconnect(); // close connection
conn.reconnect(); // close connection and reconnect after timeout
```

### Receive status

Status messages of the connection are exposed as an observable stream:

```ts
conn.status$.subscribe(status => {
  // ...
});
```

All messages have a `type` property with one of the following values:

| Message        | Description                                                                                               |
| -------------- | --------------------------------------------------------------------------------------------------------- |
| `OPENING`      | Connecting to the mixer                                                                                   |
| `OPEN`         | Successfully connected to the mixer                                                                       |
| `CLOSING`      | Disconnecting from the mixer                                                                              |
| `CLOSE`        | Disconnected from the mixer                                                                               |
| `ERROR`        | Connection error occured. The error object can be accessed through the `payload` property of the message. |
| `RECONNECTING` | After an error, trying reconnection                                                                       |

### Use commands and feedback

The `SoundcraftUI` object exposes commands and feedback in a human-readable and object-oriented structure.
Feedback is published as streams that you can subscribe to. This uses the Observable object from [RxJS](https://rxjs.dev/).
See a list of all available commands and feedback streams below.

```ts
conn.master.setFaderLavel(0.5);
conn.master.input(5).solo();
conn.aux(3).input(2).mute();

conn.master.faderLevel$.subscribe(value => {
  // ...
});
```

## Commands and Feedback

### Master

| Call                                      | Description                                                              |
| ----------------------------------------- | ------------------------------------------------------------------------ |
| `conn.master.setFaderLevel(value)`        | Set the master fader level (between `0` and `1`)                         |
| `conn.master.setFaderLevelDB(dbValue)`    | Set the master fader level in dB (between `-Infinity` and `10`)          |
| `conn.master.changeFaderLevelDB(dbValue)` | Change the master fader level relatively by adding a given value (in dB) |
| `conn.master.fadeTo(value, fadeTime)`     | Fade master to value (between `0` and `1`)                               |
| `conn.master.fadeToDB(value, fadeTime)`   | Fade master to dB value (between `-Infinity` and `10`)                   |
| `conn.master.pan(value)`                  | Set the master pan (between `0` and `1`)                                 |
| `conn.master.dim()`                       | Dim master                                                               |
| `conn.master.undim()`                     | Undim master                                                             |
| `conn.master.toggleDim()`                 | Toggle master dim                                                        |
| `conn.master.setDim(value)`               | Set master dim (`0` or `1`)                                              |
| `conn.master.faderLevel$`                 | Get master fader level (between `0` and `1`)                             |
| `conn.master.faderLevelDB$`               | Get master fader level in dB (between `-Infinity` and `10`)              |
| `conn.master.pan$`                        | Get master pan value (between `0` and `1`)                               |
| `conn.master.dim$`                        | Get master dim status (`0` or `1`)                                       |

### Generic channel operations

These operations apply for any sort of channel like `MasterChannel`, `FxChannel` or `AuxChannel`.

| Call                          | Description                                                   |
| ----------------------------- | ------------------------------------------------------------- |
| `setFaderLevel(value)`        | Set fader level (between `0` and `1`)                         |
| `setFaderLevelDB(dbValue)`    | Set fader level in dB (between `-Infinity` and `10`)          |
| `changeFaderLevelDB(dbValue)` | Change fader level relatively by adding a given value (in dB) |
| `fadeTo(value, fadeTime)`     | Fade channel to value (between `0` and `1`)                   |
| `fadeToDB(value, fadeTime)`   | Fade channel to dB value (between `-Infinity` and `10`)       |
| `setMute(value)`              | Set mute for channel (`0` or `1`)                             |
| `mute()`                      | Mute channel                                                  |
| `unmute()`                    | Unmute channel                                                |
| `toggleMute()`                | Toggle mute status                                            |
| `faderLevel$`                 | Get fader level (between `0` and `1`)                         |
| `faderLevelDB$`               | Get fader level in dB (between `-Infinity` and `10`)          |
| `mute$`                       | Get mute status (`0` or `1`)                                  |

### Master bus

Get access to a `MasterChannel` object first:

| Call                    | Description                    |
| ----------------------- | ------------------------------ |
| `conn.master.input(2)`  | Input 2 on master bus          |
| `conn.master.line(1)`   | Line Input 1 on master bus     |
| `conn.master.player(1)` | Player channel 1 on master bus |
| `conn.master.aux(2)`    | AUX channel 2 on master bus    |
| `conn.master.fx(3)`     | FX channel 3 on master bus     |
| `conn.master.sub(3)`    | Sub group 3 on master bus      |
| `conn.master.vca(4)`    | VCA 4 on master bus            |

The `MasterChannel` exposes the following operations:

| Call on master channel           | Description                               |
| -------------------------------- | ----------------------------------------- |
| _all generic channel operations_ |                                           |
| `pan(value)`                     | Set pan for channel (between `0` and `1`) |
| `setSolo(value)`                 | Set solo for channel (`0` or `1`)         |
| `solo()`                         | Enable solo                               |
| `unsolo()`                       | Disable solo                              |
| `toggleSolo()`                   | Toggle solo status                        |
| `solo$`                          | Get solo status (`0` or `1`)              |
| `pan$`                           | Get pan value (between `0` and `1`)       |

### AUX buses

Get access to a `AuxBus` object with `conn.aux(busNumber)`.
Then pick one of the available `AuxChannel`s:

| Call                    | Description                   |
| ----------------------- | ----------------------------- |
| `conn.aux(3).input(2)`  | Input 2 on AUX bus 3          |
| `conn.aux(3).line(1)`   | Line Input 1 on AUX bus 3     |
| `conn.aux(3).player(1)` | Player channel 1 on AUX bus 3 |
| `conn.aux(3).fx(3)`     | FX channel 3 on AUX bus 3     |

An `AuxChannel` supports the following operations:

| Call on AUX channel              | Description                                                           |
| -------------------------------- | --------------------------------------------------------------------- |
| _all generic channel operations_ |                                                                       |
| `pan(value)`                     | Set pan for channel (between `0` and `1`). Not possible for mono AUX! |
| `pre()`                          | Set channel to PRE                                                    |
| `post()`                         | Set channel to POST                                                   |
| `togglePost()`                   | Toggle PRE/POST status                                                |
| `setPost(value)`                 | Set POST (`1`) or PRE (`0`)                                           |
| `preProc()`                      | Set channel to PRE PROC                                               |
| `postProc()`                     | Set channel to POST PROC                                              |
| `setPostProc(value)`             | Set POST PROC (`1`) or PRE PROC (`0`)                                 |
| `post$`                          | Get POST status (`0` for PRE, `1` for POST)                           |
| `pan$`                           | Get pan value (between `0` and `1`)                                   |

### FX buses

Get access to a `FxBus` object with `conn.fx(busNumber)`.
Then pick one of the available `FxChannel`s:

| Call                   | Description                  |
| ---------------------- | ---------------------------- |
| `conn.fx(2).input(2)`  | Input 2 on FX bus 2          |
| `conn.fx(2).line(1)`   | Line Input 1 on FX bus 2     |
| `conn.fx(2).player(1)` | Player channel 1 on FX bus 2 |
| `conn.fx(2).sub(3)`    | Sub group 3 on FX bus 2      |

An `FxChannel` supports the following operations:

| Call on FX channel               | Description                                 |
| -------------------------------- | ------------------------------------------- |
| _all generic channel operations_ |                                             |
| `pre()`                          | Set channel to PRE                          |
| `post()`                         | Set channel to POST                         |
| `setPost(value)`                 | Set POST (`1`) or PRE (`0`)                 |
| `post$`                          | Get POST status (`0` for PRE, `1` for POST) |

### Media Player

| Call                         | Description                                                                                                  |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `play()`                     | Play                                                                                                         |
| `pause()`                    | Pause                                                                                                        |
| `stop()`                     | Stop                                                                                                         |
| `next()`                     | Next track                                                                                                   |
| `prev()`                     | Previous track                                                                                               |
| `loadPlaylist(playlist)`     | Load a playlist by name                                                                                      |
| `loadTrack(track, playlist)` | Load a track from a given playlist                                                                           |
| `setShuffle(value)`          | Set player shuffle setting (`0` or `1`)                                                                      |
| `setPlayMode(value)`         | Set player mode like `manual` or `auto`. Values are rather internal, please use convenience functions below. |
| `setManual()`                | Enable manual mode                                                                                           |
| `setAuto()`                  | Enable automatic mode                                                                                        |

## Transitions

All channels can perform timed transitions to a given value.
`Channel` and `MasterBus` contain two methods `fadeTo` and `fadeToDB` with the following parameters:

| Parameter     | Description                                                                                                                                               |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `targetValue` | Value to fade to. The method `fadeTo` takes a linear value between `0` and `1`, the `fadeToDB` method takes the value in dB between `-Infinity` and `10`. |
| `fadeTime`    | Fade time in milliseconds (ms)                                                                                                                            |
| `easing`      | optional: easing characteristic. This needs to be an entry of the `Easings` enum, see below. Defaults to linear (= no easing).                            |
| `fps`         | optional: frames/ticks per second, defaults to `25`. Usually, you don't need to change this.                                                              |

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
Easings.EaseOut; // deceleration from zero velocity (slow end)
Easing.EaseInOut; // acceleration until halfway, the deceleration (slow start and end)
```

## License

MIT
