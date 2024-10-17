---
sidebar_position: 3
---

# Automix

## Global Automix Settings

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

## Automix Channel Assignment

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
