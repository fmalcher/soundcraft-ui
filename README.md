# SoundcraftUi

[![npm](https://img.shields.io/npm/v/soundcraft-ui-connection.svg)](https://www.npmjs.com/package/soundcraft-ui-connection)

This project provides a generic connection library for the Soundcraft Ui series audio mixers (Ui12 / Ui16 / Ui24R).
Go to the documentation README for all information about this library.

## [Documentation and README](https://github.com/fmalcher/soundcraft-ui/tree/main/packages/mixer-connection)

**👉 [https://github.com/fmalcher/soundcraft-ui/tree/main/packages/mixer-connection](https://github.com/fmalcher/soundcraft-ui/tree/main/packages/mixer-connection)**

## Development

The project is based on [Nx](https://nx.dev).
You must have Node.js installed as well as the Nx CLI:

```bash
npm install -g nx
```

You can then start the testbed project that provides simple usage of the connection library.
You must also build the library so that the application can use it:

```bash
nx build mixer-connection

nx serve testbed
# OR
npm run testbed
```

If you are missing any features, please get in touch or open a PR or feature request.

## License

MIT
