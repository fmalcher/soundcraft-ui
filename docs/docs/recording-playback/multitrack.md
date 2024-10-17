---
sidebar_position: 2
---

# Multitrack Recording

The Ui24R features multi-track recording. The `MultiTackRecorder` object can be retrieved via `conn.recorderMultiTrack`.
It supports the following operations:

| Call on `MultiTrackRecorder` | Description                                                                                                                                   |
| ---------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `state$`                     | Current state (playing, stopped, paused) as a value of the `MtkState` enum. Please be aware that the values are different from `PlayerState`. |
| `session$`                   | Current session name (e.g. `0001` or individual name)                                                                                         |
| `length$`                    | Current session length in seconds                                                                                                             |
| `elapsedTime$`               | Elapsed time of current session in seconds                                                                                                    |
| `remainingTime$`             | Remaining time of current session in seconds                                                                                                  |
| `recording$`                 | Recording state (`0` or `1`)                                                                                                                  |
| `busy$`                      | Recording busy state (`0` or `1`)                                                                                                             |
| `recordingTime$`             | Recording time in seconds                                                                                                                     |
| `soundcheck$`                | Soundcheck activation state                                                                                                                   |
| `play()`                     | Play                                                                                                                                          |
| `pause()`                    | Pause                                                                                                                                         |
| `stop()`                     | Stop                                                                                                                                          |
| `recordToggle()`             | Toggle recording                                                                                                                              |
| `recordStart()`              | Start recording                                                                                                                               |
| `recordStop()`               | Stop recording                                                                                                                                |
| `activateSoundcheck()`       | Activate soundcheck                                                                                                                           |
| `deactivateSoundcheck()`     | Deactivate soundcheck                                                                                                                         |
| `toggleSoundcheck()`         | Toggle soundcheck                                                                                                                             |
| `setSoundcheck(value)`       | Set soundcheck (activate or deactivate) (`0` or `1`)                                                                                          |

To select channels for multi-track recording, the `MasterChannel` itself offers the corresponding interface.
After getting access to a `MasterChannel` input or line channel (e.g. `conn.master.input(1)`), the following operations are available:

| Call on `MasterChannel` | Description                                             |
| ----------------------- | ------------------------------------------------------- |
| `multiTrackSelected$`   | Multitrack selection state for the channel (`0` or `1`) |
| `multiTrackSelect()`    | Select this channel for multitrack recording            |
| `multiTrackUnselect()`  | Remove this channel from multitrack recording           |
| `multiTrackSelect()`    | Toggle multitrack recording for this channel            |

Please note that multitrack selections will only apply to single channels. Stereo-linked channels will not be selected automatically.
