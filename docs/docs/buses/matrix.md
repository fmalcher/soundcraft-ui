---
sidebar_position: 4
---

# Matrix (MTX) Bus

On the **Ui24R** an AUX bus can be switched to a _matrix bus_.
Unlike a regular AUX bus, a matrix does not route input-side channels but other buses:
the **AUX buses**, **subgroups** and the **master mix** are routed to a matrix output.

:::note
Matrix buses are only available on the Ui24R.
A matrix occupies the same slot as the AUX bus it replaced
(e.g. MTX 7 lives in the slot of AUX bus 7).
:::

## Detecting a matrix bus

A slot can either be a regular AUX bus or a matrix bus.
Both `AuxBus` and `MtxBus` expose an `isMatrix$` observable to tell the two apart:

| Call                    | Description                                       |
| ----------------------- | ------------------------------------------------- |
| `conn.aux(7).isMatrix$` | Emits `true` when AUX bus 7 is currently a matrix |
| `conn.mtx(7).isMatrix$` | Emits `true` when MTX bus 7 is currently a matrix |

When a slot is a matrix, controlling it as an AUX bus (`conn.aux(7)`) has no effect.

## Switching between AUX and matrix

A bus can be switched between a regular AUX bus and a matrix bus:

| Call                           | Description                                                         |
| ------------------------------ | ------------------------------------------------------------------- |
| `conn.aux(7).switchToMatrix()` | Switch AUX bus 7 to a matrix bus, returns the `MtxBus`              |
| `conn.mtx(7).switchToAux()`    | Switch matrix bus 7 back to a regular AUX bus, returns the `AuxBus` |

Each method returns the bus for the new role, so you can keep operating on it right away:

```ts
// switch to matrix and immediately mute the master source
const mtx = conn.aux(7).switchToMatrix();
mtx.master().mute();
```

:::note
When the bus is stereo-linked, switching also switches the linked neighbour slot, so a
linked pair always stays consistent (both AUX or both matrix).
:::

## Routing sources into a matrix

Get access to a `MtxBus` object with `conn.mtx(busNumber)`.
Then pick one of the available source channels:

| Call                   | Description                    | Type               |
| ---------------------- | ------------------------------ | ------------------ |
| `conn.mtx(7).aux(1)`   | AUX bus 1 routed to MTX bus 7  | `MtxBusChannel`    |
| `conn.mtx(7).sub(1)`   | Subgroup 1 routed to MTX bus 7 | `MtxBusChannel`    |
| `conn.mtx(7).master()` | Master mix routed to MTX bus 7 | `MtxMasterChannel` |

Both types extend the common base class `MtxChannel`, so every matrix source is an instance of it.
A channel supports the following operations:

| Call on matrix source            | Description                                                           |
| -------------------------------- | --------------------------------------------------------------------- |
| _all generic channel operations_ |                                                                       |
| `setPan(value)`                  | Set pan for channel (between `0` and `1`). Not possible for mono MTX! |
| `changePan(offset)`              | Relatively change pan for channel. Not possible for mono MTX!         |
| `preProc()`                      | Set channel to PRE PROC                                               |
| `postProc()`                     | Set channel to POST PROC                                              |
| `setPostProc(value)`             | Set POST PROC (`true`) or PRE PROC (`false`)                          |
| `pan$`                           | Get pan value (between `0` and `1`)                                   |
| `postProc$`                      | Get POST PROC status (`false` for PRE PROC, `true` for POST PROC)     |

:::note
The master source (`MtxMasterChannel`) has a static name: `name$` always emits `MASTER` and there is no `setName()`.
Unlike AUX sends, matrix sources have no PRE/POST (`post`) toggle, only PRE/POST PROC.
:::

## Controlling the matrix output

The matrix output (fader level, name, mute, solo, delay) lives in the same slot as the AUX it replaced.
It is therefore controlled exactly like an AUX output on the master bus.
For better readability, `conn.master.mtx(n)` is available as an alias for `conn.master.aux(n)`:

| Call                 | Description                       |
| -------------------- | --------------------------------- |
| `conn.master.mtx(7)` | Matrix output 7 on the master bus |

The returned `DelayableMasterChannel` supports all generic channel operations as well as
`solo`, `pan` and `delay`. See the [Master Bus](./master-bus) section for details.
