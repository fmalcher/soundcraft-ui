---
sidebar_position: 4
---

# FX Sends

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
| `post$`                          | Get POST status (`0` for PRE, `1` for POST) |
| `pre()`                          | Set channel to PRE                          |
| `post()`                         | Set channel to POST                         |
| `setPost(value)`                 | Set POST (`1`) or PRE (`0`)                 |

Settings for the FX processors can also be accessed through the `FxBus` class.
See the separate [**FX Settings** docs page](../features/fx-settings) for this.
