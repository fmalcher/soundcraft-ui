---
sidebar_position: 3
---

# AUX Sends

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
| `setPan(value)`                  | Set pan for channel (between `0` and `1`). Not possible for mono AUX! |
| `pre()`                          | Set channel to PRE                                                    |
| `post()`                         | Set channel to POST                                                   |
| `togglePost()`                   | Toggle PRE/POST status                                                |
| `setPost(value)`                 | Set POST (`1`) or PRE (`0`)                                           |
| `preProc()`                      | Set channel to PRE PROC                                               |
| `postProc()`                     | Set channel to POST PROC                                              |
| `setPostProc(value)`             | Set POST PROC (`1`) or PRE PROC (`0`)                                 |
| `post$`                          | Get POST status (`0` for PRE, `1` for POST)                           |
| `pan$`                           | Get pan value (between `0` and `1`)                                   |
