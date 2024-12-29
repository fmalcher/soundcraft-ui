---
sidebar_position: 2
---

# Connection Status

The current connection state is synchronously readable from the `status` field of type `ConnectionStatus`:

```ts
const currentStatus = conn.status;

// Example:
if (conn.status === ConnectionStatus.Open) {
  // ...
}
```

Status changes are exposed as an observable stream.
All messages have a `type` property of type `ConnectionStatus`.
Use this if you want to react to any changes:

```ts
conn.status$.subscribe(status => {
  // ...
});
```

The `ConnectionStatus` enum has the following fields and values:

| Value          | Enum field name | Description                                                                                               |
| -------------- | --------------- | --------------------------------------------------------------------------------------------------------- |
| `OPENING`      | `Opening`       | Connecting to the mixer                                                                                   |
| `OPEN`         | `Open`          | Successfully connected to the mixer                                                                       |
| `CLOSING`      | `Closing`       | Disconnecting from the mixer                                                                              |
| `CLOSE`        | `Close`         | Disconnected from the mixer                                                                               |
| `ERROR`        | `Error`         | Connection error occured. The error object can be accessed through the `payload` property of the message. |
| `RECONNECTING` | `Reconnecting`  | After an error, trying reconnection                                                                       |
