# SoundcraftUi

This project aims to provide a generic connection library for the Soundcraft Ui series audio mixers (Ui12 / Ui16 Ui24).
The device can be controlled via web interface through a Websocket connection, thus it's absolutely suitable to get controlled by other software.

This project is under heavy development! Feel free to contribute! 🙂

**Find README and docs for the connection library here: [https://github.com/fmalcher/soundcraft-ui/tree/main/packages/mixer-connection](https://github.com/fmalcher/soundcraft-ui/tree/main/packages/mixer-connection)**

## Development

The project is based on [Nx](https://nx.dev).
You must have Node.js installed as well as the Nx CLI:

```bash
npm install -g nx
```

You can then start the testbed project that provides simple usage of the connection library.
You must also build the library so that the application can use it:

```bash
nx build mixer-connection --watch
nx serve ui-testbed
```

## License

MIT
