---
sidebar_position: 1
---

# Shows, Snapshots and Cues

Shows and their snapshots/cues can be loaded by providing their names to the following method calls.
Please be aware that there will be no check whether a show with the given name actually exists.
Information about the currently loaded show, snapshot or cue is also available.

The `ShowController` object is available in `conn.shows` and supports these operations:

| Call                                   | Description                                                          |
| -------------------------------------- | -------------------------------------------------------------------- |
| `loadShow(showName)`                   | Load a show by its name                                              |
| `loadSnapshot(showName, snapshotName)` | Load a snapshot in a show by its name                                |
| `loadCue(showName, cueName)`           | Load a cue in a show by its name                                     |
| `saveSnapshot(showName, snapshotName)` | Save a snapshot in a show. This will overwrite an existing snapshot. |
| `saveCue(showName, cueName)`           | Save a cue in a show. This will overwrite an existing cue.           |
| `updateCurrentSnapshot()`              | Update/overwrite the currently loaded snapshot                       |
| `updateCurrentCue()`                   | Update/overwrite the currently loaded cue                            |
| `currentShow$`                         | Currently loaded show                                                |
| `currentSnapshot$`                     | Currently loaded snapshot                                            |
| `currentCue$`                          | Currently loaded cue                                                 |

Please be aware that no confirmation is required when snapshots are saved. Be careful not to overwrite existing snapshots by accident.
