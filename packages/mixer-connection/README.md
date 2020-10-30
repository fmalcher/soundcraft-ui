# soundcraft-ui-connection

This library provides a generic connection interface for the Soundcraft Ui series audio mixers.

## Installation

```sh
npm i soundcraft-ui-connection
```

## Usage

### Initialization and connection

```ts
import { SoundcraftUI } from 'soundcraft-ui-connection';

const conn = new SoundcraftUI(mixerIP);
conn.connect();

// disconnect
conn.disconnect();
```

### Receive status

Status messages are being exposed as an observable stream.
They have a `type` property and an optional `payload` that is currently only used for errors.

```ts
conn.status$.subscribe(status => {
  // ...
});
```

### Actions

| Command                          | Description                        |
| -------------------------------- | ---------------------------------- |
| `conn.master.setFaderLevel(0.5)` | Set the master fader level         |
| `conn.master.dim()`              | Dim master                         |
| `conn.master.undim()`            | Undim master                       |
| `conn.master.setDim(value)`      | Set master dim to value `0` or `1` |
| _to be continued..._             |                                    |

## License

MIT
