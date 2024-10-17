---
sidebar_position: 0
---

# Media Player

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
