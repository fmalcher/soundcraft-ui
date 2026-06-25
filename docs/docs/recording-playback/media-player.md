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
| `shuffle$`                   | Shuffle state                                                                                                |
| `playlists$`                 | Names of all available playlists                                                                             |
| `playlistsWithTracks$`       | All playlists with their tracks as a map of playlist name to track names                                     |
| `play()`                     | Play                                                                                                         |
| `pause()`                    | Pause                                                                                                        |
| `stop()`                     | Stop                                                                                                         |
| `next()`                     | Next track                                                                                                   |
| `prev()`                     | Previous track                                                                                               |
| `loadPlaylist(playlist)`     | Load a playlist by name. `playlist` is the name of the playlist/folder                                       |
| `loadTrack(track, playlist)` | Load a track from a given playlist. `track` and `playlist` are the file/folder names as seen in the Web UI.  |
| `setShuffle(value)`          | Set player shuffle state                                                                                     |
| `toggleShuffle()`            | Toggle player shuffle state                                                                                  |
| `setPlayMode(value)`         | Set player mode like `manual` or `auto`. Values are rather internal, please use convenience functions below. |
| `setManual()`                | Enable manual mode                                                                                           |
| `setAuto()`                  | Enable automatic                                                                                             |
| `refreshPlaylists()`         | Request the current playlists and their tracks from the mixer                                                |

## Playlists

Unlike fader levels or mute states, the available playlists and their tracks are **not** part of
the global mixer state. The mixer sends this information per-client and only on request. The
library requests it automatically whenever the connection is (re-)established, so `playlists$` and
`playlistsWithTracks$` emit as soon as the data arrives. Call `refreshPlaylists()` to refresh it
manually, e.g. after playlists have been added or removed on the device.
