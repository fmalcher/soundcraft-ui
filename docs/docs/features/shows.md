---
sidebar_position: 1
---

# Shows, Snapshots and Cues

Shows and their snapshots/cues can be loaded by providing their names to the following method calls.
There will be no check whether a show with the given name actually exists.
Information about the currently loaded show, snapshot or cue is also available.

The `ShowController` object is available in `conn.shows` and supports these operations:

| Call                                   | Description                                                          |
| -------------------------------------- | -------------------------------------------------------------------- |
| `currentShow$`                         | Currently loaded show                                                |
| `currentSnapshot$`                     | Currently loaded snapshot                                            |
| `currentCue$`                          | Currently loaded cue                                                 |
| `loadShow(showName)`                   | Load a show by its name                                              |
| `loadSnapshot(showName, snapshotName)` | Load a snapshot in a show by its name                                |
| `loadCue(showName, cueName)`           | Load a cue in a show by its name                                     |
| `saveSnapshot(showName, snapshotName)` | Save a snapshot in a show. This will overwrite an existing snapshot. |
| `saveCue(showName, cueName)`           | Save a cue in a show. This will overwrite an existing cue.           |
| `updateCurrentSnapshot()`              | Update/overwrite the currently loaded snapshot                       |
| `updateCurrentCue()`                   | Update/overwrite the currently loaded cue                            |

Please be aware that no confirmation is required when snapshots or cues are saved. Be careful not to overwrite existing parts by accident.

:::info

The Mixer Web App shows a hierarchical order of Show > Snapshot > Cue. However, in the protocol, cues are contained in shows, which is why `loadCue()` accepts a show and a cue as parameters, but no snapshot.

:::
