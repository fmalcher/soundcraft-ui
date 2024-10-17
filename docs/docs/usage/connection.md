---
sidebar_position: 0
---

# Initialization and connection

To get started, you need an instance of the `SoundcraftUI` class.
It must be initialized with the IP adress of the mixer.
After this, the object offers three methods to control the connection.

```ts
import { SoundcraftUI } from 'soundcraft-ui-connection';

const conn = new SoundcraftUI(mixerIP);
conn.connect();

conn.disconnect(); // close connection
conn.reconnect(); // close connection and reconnect after timeout
```

All three methods return a Promise that resolves when the operation has finished.
This is useful when you want to wait for the connection to be open before you start using the mixer.
Please note that these Promises will not reject on errors.
If you want to receive errors, use the `status$` Observable instead.
