---
sidebar_position: 0
---

# Quick Start

**This Quick Start Guide will help you get started with this library by creating a simple Node.js script to toggle MUTE on a master channel.**

First, ensure that the [Node.js runtime](https://nodejs.org/en) is installed on your machine.
Create a new folder and initialize a new NPM project:

```bash
mkdir soundcraft-quickstart
cd soundcraft-quickstart
npm init -y
```

Install the library:

```bash
npm install soundcraft-ui-connection
```

Create an `index.mjs` file for your script. Import the `SoundcraftUI` class from the package and create an instance with the IP address of the mixer. Use the `conn.connect()` method to connect to the mixer, which returns a Promise that resolves when the connection is established.

Finally, set an interval to toggle MUTE every 1000 ms:

```javascript
import { SoundcraftUI } from 'soundcraft-ui-connection';

const conn = new SoundcraftUI('192.168.1.111');
await conn.connect();

setInterval(() => {
  conn.master.input(2).toggleMute();
}, 1000);
```

You can run the script from the command line:

```bash
node index.mjs
```

Open the Soundcraft Web App to see Channel 2 mute and unmute every second.

🎉 **Congratulations! You have successfully set up a new project with our library.**

## Use in the browser (CDN)

To try the library, no separate build process is necessary. The package ships a self-contained ES module (`index.mjs`) with its RxJS dependency bundled in, so you can load it directly in the browser from any npm CDN, for example [jsDelivr](https://www.jsdelivr.com/) or [unpkg](https://unpkg.com/):

```javascript
import { SoundcraftUI } from 'https://cdn.jsdelivr.net/npm/soundcraft-ui-connection/index.mjs';
```

The following HTML page connects to a mixer and provides two buttons to mute and unmute an input channel:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <title>Mute channel</title>
  </head>
  <body>
    <button onclick="mute(1)">Mute 1</button>
    <button onclick="unmute(1)">Unmute 1</button>

    <script type="module">
      import { SoundcraftUI } from 'https://cdn.jsdelivr.net/npm/soundcraft-ui-connection/index.mjs';

      const conn = new SoundcraftUI('192.168.1.111');
      await conn.connect();

      window.mute = function (ch) {
        conn.master.input(ch).mute();
      };

      window.unmute = function (ch) {
        conn.master.input(ch).unmute();
      };
    </script>
  </body>
</html>
```

Save this as an `.html` file and open it in your browser. Clicking the buttons mutes and unmutes Channel 1 on the mixer.
