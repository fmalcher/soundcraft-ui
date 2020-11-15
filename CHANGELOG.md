# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [0.6.0](https://github.com/fmalcher/soundcraft-ui/compare/v0.5.1...v0.6.0) (2020-11-15)


### Features

* add ChannelStore for object caching ([2cab536](https://github.com/fmalcher/soundcraft-ui/commit/2cab5360364abb82882ec3208678eaa658b40709)), closes [#33](https://github.com/fmalcher/soundcraft-ui/issues/33)
* add standard-version for changelog management ([ea28a1d](https://github.com/fmalcher/soundcraft-ui/commit/ea28a1d0f0f7b4fd84dbe2152d407c234b850f36))
* Stereo Link and rework of transitions ([85c2277](https://github.com/fmalcher/soundcraft-ui/commit/85c2277bd274024b0fffc3fe9c958f10e6b6a30e)), closes [#31](https://github.com/fmalcher/soundcraft-ui/issues/31) [#32](https://github.com/fmalcher/soundcraft-ui/issues/32)


### Bug Fixes

* move rounding out of LUT lookup ([a91097c](https://github.com/fmalcher/soundcraft-ui/commit/a91097cea8384456ed56e26fc8a109fc85605321)), closes [#39](https://github.com/fmalcher/soundcraft-ui/issues/39)
* use correct capping value for relative changes ([d57a030](https://github.com/fmalcher/soundcraft-ui/commit/d57a030bafc104b2dde062694f60f227d788053d))

### [0.5.1](https://github.com/fmalcher/soundcraft-ui/compare/v0.5.0...v0.5.1) (2020-11-07)

### Bug Fixes

- use correct import path for rxjs/webSocket ([ec44c68](https://github.com/fmalcher/soundcraft-ui/commit/ec44c6845280b3fab78b2ed7ea505a0b4990cea6))

## [0.5.0](https://github.com/fmalcher/soundcraft-ui/compare/v0.4.0...v0.5.0) (2020-11-07)

### Features

- add relative fader level changes ([3e053ed](https://github.com/fmalcher/soundcraft-ui/commit/3e053ed97a079bdb44a876b9d6caaffab696cb43)), closes [#9](https://github.com/fmalcher/soundcraft-ui/issues/9)
- add subscribable player infos ([bb3bc0b](https://github.com/fmalcher/soundcraft-ui/commit/bb3bc0b20054a0bb3d751e37b476eca975283c24)), closes [#7](https://github.com/fmalcher/soundcraft-ui/issues/7)
- add timed transitions for all channels ([e4e5522](https://github.com/fmalcher/soundcraft-ui/commit/e4e5522704ec103e71db757ce2a2ea860405e13d)), closes [#10](https://github.com/fmalcher/soundcraft-ui/issues/10)

### Bug Fixes

- **testbed:** wrong method names ([aaf0f21](https://github.com/fmalcher/soundcraft-ui/commit/aaf0f21b415a77cf5fd6659f08a39f15a6369aa2))

## [0.4.0](https://github.com/fmalcher/soundcraft-ui/compare/v0.3.0...v0.4.0) (2020-11-03)

### Features

- add PRE/POST toggle for send channels ([1455b38](https://github.com/fmalcher/soundcraft-ui/commit/1455b382ed3d99820fce422704031887528240e3))

### Bug Fixes

- correct FX channel address ([d27a6e7](https://github.com/fmalcher/soundcraft-ui/commit/d27a6e76c6fb7760607d617e604124eb1ab1e5d9))

## [0.3.0](https://github.com/fmalcher/soundcraft-ui/compare/v0.2.1...v0.3.0) (2020-11-01)

### Features

- get and set fader values in dB ([c069ac4](https://github.com/fmalcher/soundcraft-ui/commit/c069ac44809622b105c14e569718c8cd21687cd6))

### [0.2.1](https://github.com/fmalcher/soundcraft-ui/compare/v0.2.0...v0.2.1) (2020-11-01)

### Bug Fixes

- use isomorphic-ws for WebSocket abstraction across platforms ([7dd3a1e](https://github.com/fmalcher/soundcraft-ui/commit/7dd3a1e42736ccf9f87d1f635820d4dcf95c602b))

## [0.2.0](https://github.com/fmalcher/soundcraft-ui/compare/v0.1.0...v0.2.0) (2020-11-01)

### Features

- **testbed:** add page for master level, pan and dim ([5a909d2](https://github.com/fmalcher/soundcraft-ui/commit/5a909d2e785a5767b46611921bc58a16e086e1ba))
- **testbed:** add player page ([1d95dcc](https://github.com/fmalcher/soundcraft-ui/commit/1d95dcc7e3efdffdfe640a2e8ae306ed6c1e0b51))
- add first version of fully-featured browser testbed ([647ad86](https://github.com/fmalcher/soundcraft-ui/commit/647ad86331f45720c485123713aca02d22d25f04)), closes [#20](https://github.com/fmalcher/soundcraft-ui/issues/20)
- PAN: only on Master and AUX channels, add setPan functionality ([dd55aa6](https://github.com/fmalcher/soundcraft-ui/commit/dd55aa6b356796b613f0321d30a9e3832dc9db89))
- provide own implementation for object path utilities ([f141719](https://github.com/fmalcher/soundcraft-ui/commit/f141719e912f1d7f52846a1fa5223cd40d06324a)), closes [#16](https://github.com/fmalcher/soundcraft-ui/issues/16)

### Bug Fixes

- resolve toggle bug ([3e37ada](https://github.com/fmalcher/soundcraft-ui/commit/3e37adad10498cfa52ac8075549812b9cd97f2a7)), closes [#6](https://github.com/fmalcher/soundcraft-ui/issues/6)
- update regex to be compatible with older environments ([ce04c8f](https://github.com/fmalcher/soundcraft-ui/commit/ce04c8ff3732fa8ac959e3b6b7cac8841d7ba423))
- wrong index for post/postproc on AUX bus ([ec8bce2](https://github.com/fmalcher/soundcraft-ui/commit/ec8bce22a9afb30a9b3c3fd6be9af00e28716eb1))

## 0.1.0 (2020-10-30)

### Features

- add proper connection handling ([8dc7e44](https://github.com/fmalcher/soundcraft-ui/commit/8dc7e449bc86211bdccde2e1ed99dfe402f299d0)), closes [#13](https://github.com/fmalcher/soundcraft-ui/issues/13) [#6](https://github.com/fmalcher/soundcraft-ui/issues/6)
- **ui-testbed:** make mixer IP configurable ([97a473a](https://github.com/fmalcher/soundcraft-ui/commit/97a473af51e297232866f2d5984a49106c88bb19)), closes [#15](https://github.com/fmalcher/soundcraft-ui/issues/15)
- add examples to testbed app ([bb17bd4](https://github.com/fmalcher/soundcraft-ui/commit/bb17bd45b28d0e5309ff5de50eaf17261c42cba5))
- add first buttons to testbed application ([fd16994](https://github.com/fmalcher/soundcraft-ui/commit/fd169945437d46a04fbfe68d8123b66448d3cc41))
- add prototype for fluent command interface ([a3f186a](https://github.com/fmalcher/soundcraft-ui/commit/a3f186a351ec6590aeec902c3f35bce5ba3e4b1d))
- create mixer-connection lib ([4090cb8](https://github.com/fmalcher/soundcraft-ui/commit/4090cb801f1530524b465ddbc3996def7a6a7fd3))
- create testbed application with Express ([e8378dd](https://github.com/fmalcher/soundcraft-ui/commit/e8378ddbe6db0bbff3a3f9b8fe3f045f5b36124a))
- implement a bunch of commands as fluent interface ([58762c4](https://github.com/fmalcher/soundcraft-ui/commit/58762c44e4b1d0797a179cbeb0abe3bf3daa45d1))
- reactive approach for accumulating and reading the mixer state ([46a03da](https://github.com/fmalcher/soundcraft-ui/commit/46a03dab57e138ba46e57c1ca60d71a1b5eb3d50))
- set up connection architecture ([bad13d4](https://github.com/fmalcher/soundcraft-ui/commit/bad13d40ca6bd9f6d2967fb1d0cfc51df06c6b5a))
- set up Nx workspace ([1ff8d55](https://github.com/fmalcher/soundcraft-ui/commit/1ff8d55936057da439d6e0c7bbbcff811533ebf7))
