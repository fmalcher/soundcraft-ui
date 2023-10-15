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

All three methods return a Promise that resolves when the operation has finished.
This is useful when you want to wait for the connection to be open before you start using the mixer.
Please note that these Promises will not reject on errors.
If you want to receive errors, use the `status$` Observable instead.

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

### Generic channel operations

All channels on all buses have similar behavior.
Therefore, these operations are available for any channel like `MasterChannel`, `FxChannel` or `AuxChannel`:

| Call                           | Description                                                   |
| ------------------------------ | ------------------------------------------------------------- |
| `setFaderLevel(value)`         | Set fader level (between `0` and `1`)                         |
| `setFaderLevelDB(dbValue)`     | Set fader level in dB (between `-Infinity` and `10`)          |
| `changeFaderLevelDB(offsetDB)` | Change fader level relatively by adding a given value (in dB) |
| `fadeTo(value, fadeTime)`      | Fade channel to value (between `0` and `1`)                   |
| `fadeToDB(value, fadeTime)`    | Fade channel to dB value (between `-Infinity` and `10`)       |
| `setMute(value)`               | Set mute for channel (`0` or `1`)                             |
| `mute()`                       | Mute channel                                                  |
| `unmute()`                     | Unmute channel                                                |
| `toggleMute()`                 | Toggle mute status                                            |
| `name$`                        | Get readable name of the channel                              |
| `faderLevel$`                  | Get fader level (between `0` and `1`)                         |
| `faderLevelDB$`                | Get fader level in dB (between `-Infinity` and `10`)          |
| `mute$`                        | Get mute status (`0` or `1`)                                  |

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

| Call on `MasterChannel`          | Description                               |
| -------------------------------- | ----------------------------------------- |
| _all generic channel operations_ |                                           |
| `pan(value)`                     | Set pan for channel (between `0` and `1`) |
| `setSolo(value)`                 | Set solo for channel (`0` or `1`)         |
| `solo()`                         | Enable solo                               |
| `unsolo()`                       | Disable solo                              |
| `toggleSolo()`                   | Toggle solo status                        |
| `solo$`                          | Get solo status (`0` or `1`)              |
| `pan$`                           | Get pan value (between `0` and `1`)       |

For `input`, `line` and `aux` master channels, the bus returns a `DelayableMasterChannel` object which is a subtype of `MasterChannel`.
It contains the following members:

| Call on channel           | Description                                                                                                                  |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| _all from master channel_ |                                                                                                                              |
| `setDelay(ms)`            | Set delay of the channel in milliseconds (between `0` and `250` (for `input` or `line` inputs) or `500` (for `aux` outputs)) |
| `changeDelay(offsetMs)`   | Change channel delay relatively by adding a given value in milliseconds                                                      |
| `delay$`                  | Get channel delay in milliseconds                                                                                            |

Input channels on the master bus also support automix settings, see separate section about the automix feature.

### AUX buses

Get access to a `AuxBus` object with `conn.aux(busNumber)`.
Then pick one of the available `AuxChannel` objects:

| Call                    | Description                   |
| ----------------------- | ----------------------------- |
| `conn.aux(3).input(2)`  | Input 2 on AUX bus 3          |
| `conn.aux(3).line(1)`   | Line Input 1 on AUX bus 3     |
| `conn.aux(3).player(1)` | Player channel 1 on AUX bus 3 |
| `conn.aux(3).fx(3)`     | FX channel 3 on AUX bus 3     |

An `AuxChannel` supports the following operations:

| Call on `AuxChannel`             | Description                                                           |
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

| Call on `FxChannel`              | Description                                 |
| -------------------------------- | ------------------------------------------- |
| _all generic channel operations_ |                                             |
| `pre()`                          | Set channel to PRE                          |
| `post()`                         | Set channel to POST                         |
| `setPost(value)`                 | Set POST (`1`) or PRE (`0`)                 |
| `post$`                          | Get POST status (`0` for PRE, `1` for POST) |

### Automix

#### Global Automix Settings

The global settings are available through the automix controller in `conn.automix`:

| Call on `AutomixController` | Description                                                           |
| --------------------------- | --------------------------------------------------------------------- |
| `responseTime$`             | Global response time (linear, between `0` and `1`)                    |
| `responseTimeMs$`           | Global response time in milliseconds (between `20` and `4000` ms)     |
| `setResponseTime(value)`    | Set global response time (linear, between `0` and `1`)                |
| `setResponseTimeMs(timeMs)` | Set global response time in milliseconds (between `20` and `4000` ms) |
| `groups`                    | Access to automix groups `a` and `b`                                  |

The state of the two automix groups `a` and `b` can be controlled through the `AutomixGroup` object.
First, get access to a group:

```ts
const groupA = conn.automix.groups.a;
const groupB = conn.automix.groups.b;
```

Each group exposes the following methods and properties:

| Call on `AutomixGroup` | Description                                     |
| ---------------------- | ----------------------------------------------- |
| `enable()`             | Globally enable this automix group              |
| `disable()`            | Globally disable this automix group             |
| `toggle()`             | Toggle the state of this automix group          |
| `state$`               | Active state of this automix group (`0` or `1`) |

#### Automix Channel Assignment

Assignment of channels to the automix groups can be done through the `MasterChannel` object.
Important: Only input channels on the master bus can be used in automix groups.
A channel can only be assigned to exactly one or no group.

After getting access to a `MasterChannel` input (e.g. `conn.master.input(1)`), the following operations are available:

| Call on `MasterChannel`           | Description                                                                                            |
| --------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `automixAssignGroup(group)`       | Assign this channel to an automix group (`a`, `b`, `none`). This also includes stereo-linked channels. |
| `automixRemove()`                 | Remove this channel from the automix group. This does the same as `automixAssignGroup('none')`.        |
| `automixSetWeight(value)`         | Set automix weight for the channel (linear between `0` and `1`)                                        |
| `automixSetWeightDB(dbValue)`     | Set automix weight for the channel (dB between `-12` and `12`)                                         |
| `automixChangeWeightDB(offsetDB)` | Change the automix weight relatively by adding a given value                                           |
| `automixWeight$`                  | Automix weight (linear) for this channel (between `0` and `1`)                                         |
| `automixWeightDB$`                | Automix weight (dB) for this channel (between `-12` and `12` dB)                                       |
| `automixGroup$`                   | Automix group (`a`, `b`, `none`) that this channel is assigned to                                      |

### Hardware Channels (Phantom Power)

A `HwChannel` represents a hardware input on the mixer.

> On the Ui24R, hardware inputs can be patched to different channels. This is why a hardware channel is not always the same as an input.
> This distinction is also visible in the original protocol of the mixer as well as in the UI (Phantom Power/Gain are on another page than the input faders).
> For Ui16 and Ui12, those hardware settings are part of the input channels internally.
> To keep the library surface clean, this library considers the mixer model in the background and offers all options through the `HwChannel` class.

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

### SOLO and Headphone Buses

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
| `setFaderLevel(value)`         | Set fader level (between `0` and `1`)                         |
| `setFaderLevelDB(dbValue)`     | Set fader level in dB (between `-Infinity` and `10`)          |
| `changeFaderLevelDB(offsetDB)` | Change fader level relatively by adding a given value (in dB) |
| `fadeTo(value, fadeTime)`      | Fade channel to value (between `0` and `1`)                   |
| `fadeToDB(value, fadeTime)`    | Fade channel to dB value (between `-Infinity` and `10`)       |
| `faderLevel$`                  | Get fader level (between `0` and `1`)                         |
| `faderLevelDB$`                | Get fader level in dB (between `-Infinity` and `10`)          |

### MUTE Groups

The mixer supports up to 6 MUTE groups.
Functions "MUTE ALL" and "MUTE FX" are also expressed as logical MUTE groups, internally.

First, get access to a `MuteGroup` object:

| Call                    | Description          |
| ----------------------- | -------------------- |
| `conn.muteGroup(1)`     | Mute Group 1         |
| `conn.muteGroup(2)`     | Mute Group 2         |
| `conn.muteGroup('fx')`  | Group for "MUTE FX"  |
| `conn.muteGroup('all')` | Group for "MUTE ALL" |

`MuteGroup` supports the following operations:

| Call on `MuteGroup` | Description                  |
| ------------------- | ---------------------------- |
| `state$`            | Get MUTE status (`0` or `1`) |
| `mute()`            | Mute the group               |
| `unmute()`          | Unmute the group             |
| `toggle()`          | Toggle mute group            |

Call `conn.clearMuteGroups()` to disable all MUTE groups.
This behaves differently from the "CLEAR MUTE" button in the Soundcraft Web App which also clears channel mutes.

### Shows, Snapshots and Cues

Shows and their snapshots/cues can be loaded by providing their names to the following method calls.
Please be aware that there will be no check whether a show with the given name actually exists.
Information about the currently loaded show, snapshot or cue is also available.

The `ShowController` object is available in `conn.shows` and supports these operations:

| Call                                   | Description                           |
| -------------------------------------- | ------------------------------------- |
| `loadShow(showName)`                   | Load a show by its name               |
| `loadSnapshot(showName, snapshotName)` | Load a snapshot in a show by its name |
| `loadCue(showName, cueName)`           | Load a cue in a show by its name      |
| `currentShow$`                         | Currently loaded show                 |
| `currentSnapshot$`                     | Currently loaded snapshot             |
| `currentCue$`                          | Currently loaded cue                  |

### Recording and playback

#### Media Player

The Media Player can be accessed through `conn.player`. This object exposes the following properties and methods:

| Call on `Player`             | Description                                                                                                  |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `state$`                     | Current state (playing, stopped, paused) as a value of the `PlayerState` enum                                |
| `playlist$`                  | Current playlist name                                                                                        |
| `track$`                     | Current track name                                                                                           |
| `length$`                    | Current track length in seconds                                                                              |
| `elapsedTime$`               | Elapsed time of current track in seconds                                                                     |
| `remainingTime$`             | Remaining time of current track in seconds                                                                   |
| `shuffle$`                   | Shuffle setting (`0` or `1`)                                                                                 |
| `play()`                     | Play                                                                                                         |
| `pause()`                    | Pause                                                                                                        |
| `stop()`                     | Stop                                                                                                         |
| `next()`                     | Next track                                                                                                   |
| `prev()`                     | Previous track                                                                                               |
| `loadPlaylist(playlist)`     | Load a playlist by name. `playlist` is the name of the playlist/folder                                       |
| `loadTrack(track, playlist)` | Load a track from a given playlist. `track` and `playlist` are the file/folder names as seen in the Web UI.  |
| `setShuffle(value)`          | Set player shuffle setting (`0` or `1`)                                                                      |
| `toggleShuffle()`            | Toggle player shuffle setting                                                                                |
| `setPlayMode(value)`         | Set player mode like `manual` or `auto`. Values are rather internal, please use convenience functions below. |
| `setManual()`                | Enable manual mode                                                                                           |
| `setAuto()`                  | Enable automatic                                                                                             |

#### 2-Track USB Recorder

The following commands control the dual-track USB recorder in the media player section of the Soundcraft Web App:

| Call                                    | Description                       |
| --------------------------------------- | --------------------------------- |
| `conn.recorderDualTrack.recording$`     | Recording state (`0` or `1`)      |
| `conn.recorderDualTrack.busy$`          | Recording busy state (`0` or `1`) |
| `conn.recorderDualTrack.recordToggle()` | Toggle recording                  |

#### Multitrack Recording (Ui24R only)

The Ui24R features multi-track recording. The `MultiTackRecorder` object can be retrieved via `conn.recorderMultiTrack`.
It supports the following operations:

| Call on `MultiTackRecorder` | Description                                                                                                                                   |
| --------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `state$`                    | Current state (playing, stopped, paused) as a value of the `MtkState` enum. Please be aware that the values are different from `PlayerState`. |
| `session$`                  | Current session name (e.g. `0001` or individual name)                                                                                         |
| `length$`                   | Current session length in seconds                                                                                                             |
| `elapsedTime$`              | Elapsed time of current session in seconds                                                                                                    |
| `remainingTime$`            | Remaining time of current session in seconds                                                                                                  |
| `recording$`                | Recording state (`0` or `1`)                                                                                                                  |
| `busy$`                     | Recording busy state (`0` or `1`)                                                                                                             |
| `recordingTime$`            | Recording time in seconds                                                                                                                     |
| `soundcheck$`               | Soundcheck activation state                                                                                                                   |
| `play()`                    | Play                                                                                                                                          |
| `pause()`                   | Pause                                                                                                                                         |
| `stop()`                    | Stop                                                                                                                                          |
| `recordToggle()`            | Toggle recording                                                                                                                              |
| `activateSoundcheck()`      | Activate soundcheck                                                                                                                           |
| `deactivateSoundcheck()`    | Deactivate soundcheck                                                                                                                         |
| `toggleSoundcheck()`        | Toggle soundcheck                                                                                                                             |
| `setSoundcheck(value)`      | Set soundcheck (activate or deactivate) (`0` or `1`)                                                                                          |

## Transitions

All channels can perform timed transitions to a given value.
`Channel` and `MasterBus` contain two methods `fadeTo` and `fadeToDB` with the following parameters:

| Parameter     | Description                                                                                                                                               |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `targetValue` | Value to fade to. The method `fadeTo` takes a linear value between `0` and `1`, the `fadeToDB` method takes the value in dB between `-Infinity` and `10`. |
| `fadeTime`    | Fade time in milliseconds (ms)                                                                                                                            |
| `easing`      | optional: easing characteristic. This needs to be an entry of the `Easings` enum, see below. Defaults to linear (= no easing).                            |
| `fps`         | optional: frames/ticks per second, defaults to `25`. Usually, you don't need to change this.                                                              |

Both methods return a `Promise` object that resolves when the transition time is finished.
You can use this signal to wait for the transition before starting another operation.
Please note that this signal is just implemented as a simple timer. If the transition stops for other reasons (interrupt by another transition or terminated connection), the timer will still run.

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
Easings.EaseInOut; // acceleration until halfway, then deceleration (slow start and end)
```

## Stereo Link

All commands respect the stereo link settings: If a channel is linked, all actions like fader level, mute, solo, etc. will be mirrored to the linked channel.
This also applies to stereo-linked AUX buses so that the corresponding channel on a linked AUX bus mirrors the actions.

**Examples:**

| Links              | Action                           | Result                             |
| ------------------ | -------------------------------- | ---------------------------------- |
| CH 3/4             | MUTE CH 3                        | MUTE CH 3/4                        |
| AUX 1/2            | Fader level change CH 5 on AUX 1 | Fader level change CH 5 on AUX 1/2 |
| CH 3/4 and AUX 1/2 | MUTE CH 3 on AUX 1               | MUTE CH 3/4 on AUX 1/2             |

This behavior matches the way the original web app handles stereo-linking.

## Device Info

The mixer exposes the following information about the device:

| Call                        | Description                                                  |
| --------------------------- | ------------------------------------------------------------ |
| `conn.deviceInfo.model$`    | Hardware model (`ui12`, `ui16`, `ui24`) as observable stream |
| `conn.deviceInfo.model`     | Hardware model (`ui12`, `ui16`, `ui24`) as synchronous value |
| `conn.deviceInfo.firmware$` | Firmware version                                             |

## Working with raw messages and state

The `MixerStore` object exposes raw streams with messages and state data. You can use them for debugging purposes or for integration in other services:

- `conn.store.messages$`: Stream of all raw `SETD` and `SETS` messages (inbound and outbound)
- `conn.store.state$`: Stream of state objects, derived from the messages

In much the same way you can send raw messages to the mixer:

```ts
conn.conn.sendMessage('SETD^m.mix^0.4');
conn.conn.sendMessage('SETD^i.2.mute^0');
```

> **Please prefer the human-readable interface over using the raw format!** If you're missing any features, please file an issue or PR.

## Additional useful information

- All channel objects are cached and treated as singletons. If you call `conn.master.input(3)` multiple times, each call returns the exact same object.
- Input values for fader levels and pan are restricted to the range of `0..1`. All other values are not checked or sanitized in any way! Be sure to call the functions with valid values only.

## License

MIT
