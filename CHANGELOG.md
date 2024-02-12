# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [2.2.0](https://github.com/fmalcher/soundcraft-ui/compare/v2.1.0...v2.2.0) (2024-02-12)

### Features

- expose connection status as value ([1ad0c60](https://github.com/fmalcher/soundcraft-ui/commit/1ad0c6014c3c4354664ac9dc4321271f36b67d8c))
- **testbed:** add custom title strategy ([ce74836](https://github.com/fmalcher/soundcraft-ui/commit/ce74836963c151faba68f422cbbbea2e49d2d75b))

### Other

- nx migrate to 17 and Angular 17 ([caf4695](https://github.com/fmalcher/soundcraft-ui/commit/caf4695773bbcadb1fe533591573f3b20dac4b1e))
- nx update 18 ([364cd68](https://github.com/fmalcher/soundcraft-ui/commit/364cd68d21dec088445fe9ab8587ce99ea0bd231))
- reconnect to nx cloud ([dc8442f](https://github.com/fmalcher/soundcraft-ui/commit/dc8442f81cfbe7f19bb60a9c1020b49cff2551f0))
- remove unnecessary type declaration ([c8550ab](https://github.com/fmalcher/soundcraft-ui/commit/c8550ab958f83332a3e4b19c418385add6a146f0))
- setup nx-cloud connection again ([af00913](https://github.com/fmalcher/soundcraft-ui/commit/af009132f4f005931db229d7b4a150237201b682))
- **testbed:** add route titles ([0ec666e](https://github.com/fmalcher/soundcraft-ui/commit/0ec666e5d84bbdc5f43d1ca301405bce815f8f9a))
- **testbed:** align structure with current Angular project structure ([a134163](https://github.com/fmalcher/soundcraft-ui/commit/a134163dde0bb76820b6b3b3c3b6d165ba41ad96))
- **testbed:** use Angular control flow ([db7356f](https://github.com/fmalcher/soundcraft-ui/commit/db7356f16f3b37ac9129960e4e95ecb8dcd7186e))
- **testbed:** use method for connection ([2dc017e](https://github.com/fmalcher/soundcraft-ui/commit/2dc017e04a481158a7451c9bdf1a13b925dbf772))
- update nx cloud workflow ([fd6e615](https://github.com/fmalcher/soundcraft-ui/commit/fd6e615282e7224f6e0d95ea94f1582d86f5b1a6))

## [2.1.0](https://github.com/fmalcher/soundcraft-ui/compare/v2.0.1...v2.1.0) (2023-10-15)

### Features

- add support for automix ([c2fa5e7](https://github.com/fmalcher/soundcraft-ui/commit/c2fa5e7ef1093d5a8672c46181e4a01bf7f75286))

### Bug Fixes

- fix ESLint execution with Nx package ([94aeb19](https://github.com/fmalcher/soundcraft-ui/commit/94aeb19a9bb8a2eefd5fb6aaa8d0ab365eb82c7c))

### Other

- nx migrate to 16.8 ([aeda5d9](https://github.com/fmalcher/soundcraft-ui/commit/aeda5d9a778bac152c477eabc90879bf5cf37082))
- nx update to 16.10 ([fc27778](https://github.com/fmalcher/soundcraft-ui/commit/fc2777826f866d78a0d8c0bce226af9b996bfcfc))
- player track selection ([63bec3a](https://github.com/fmalcher/soundcraft-ui/commit/63bec3ad3186d46b973db9ddf2aca8df09765d77))
- rename function to linearMappingValueToRange ([738b436](https://github.com/fmalcher/soundcraft-ui/commit/738b436ae9326761989223ce6fc9dd12a41873f8))

### [2.0.1](https://github.com/fmalcher/soundcraft-ui/compare/v2.0.0...v2.0.1) (2023-05-23)

### Bug Fixes

- do not bundle WebSocket implementation ([3380078](https://github.com/fmalcher/soundcraft-ui/commit/3380078f7555ee9b2117b85b3711d93aee87fe48))

### Other

- add NPM OTP to publish script ([b399ba6](https://github.com/fmalcher/soundcraft-ui/commit/b399ba6ff3a86f3ee85457118d132738da0eb30c))

## [2.0.0](https://github.com/fmalcher/soundcraft-ui/compare/v1.5.0...v2.0.0) (2023-05-23)

This release adds no new functionality and no API surface changes. However, since we changed the build and bundling process, it could break existing integrations.

- enable strict TS settings and fix code ([f08fc1b](https://github.com/fmalcher/soundcraft-ui/commit/f08fc1be579241470985b614c069430dc304afbe))
- nx migrate to 16.1 and Angular 16 ([d685d33](https://github.com/fmalcher/soundcraft-ui/commit/d685d33e2512781d1daa62794839172e6c85a567))
- **testbed:** rename comp selectors, use self-closing tags ([95cbd94](https://github.com/fmalcher/soundcraft-ui/commit/95cbd94b761b94b36d196d8069fe365ddb5bbb3e))
- use Vite for bundling ([0e3b119](https://github.com/fmalcher/soundcraft-ui/commit/0e3b1193f124103fb470b3d6ba62a66045cdb3cd))

## [1.5.0](https://github.com/fmalcher/soundcraft-ui/compare/v1.4.0...v1.5.0) (2023-03-23)

### Features

- add support for MTK soundcheck ([8aefb5a](https://github.com/fmalcher/soundcraft-ui/commit/8aefb5a8c9778ecdf992441ab536caed6be109e4))

### Other

- nx migrate to 15.6 ([df36847](https://github.com/fmalcher/soundcraft-ui/commit/df368470ccb8ac5540ef2f8a5d5f39c2cf3d409c))
- nx migrate to 15.7 ([257978f](https://github.com/fmalcher/soundcraft-ui/commit/257978fc271e13921f7d4e89287befaf1dde6a21))
- update nrwl/ci refs in workflow ([05a37a8](https://github.com/fmalcher/soundcraft-ui/commit/05a37a8c1633d239808c484c66f8d7f67a9f9fb3))

## [1.4.0](https://github.com/fmalcher/soundcraft-ui/compare/v1.3.0...v1.4.0) (2023-02-08)

### Features

- allow changing fader levels from -Infinity dB ([6afc45b](https://github.com/fmalcher/soundcraft-ui/commit/6afc45b1be883f16186b7a5d3f107de60ce38427))
- restrict pan values to range of 0..1 ([65b7e88](https://github.com/fmalcher/soundcraft-ui/commit/65b7e88045600b32639cc01f78d847e4f60ff59f))

### Other

- add explanation for deviceinfo.model ([276471f](https://github.com/fmalcher/soundcraft-ui/commit/276471f7ecc71254ccee6a3a0ee2906d23f288f5))
- change list symbol in CHANGELOG file ([70ada4d](https://github.com/fmalcher/soundcraft-ui/commit/70ada4de2f1d8dff7cf28024bae14e76a34261c7))
- exclude commit and tag from release process ([2d002e7](https://github.com/fmalcher/soundcraft-ui/commit/2d002e75c433aa5b470e43050cabca25444e1a6c))

## [1.3.0](https://github.com/fmalcher/soundcraft-ui/compare/v1.2.0...v1.3.0) (2023-01-22)

### Features

- add device info with mixer model ([08315c5](https://github.com/fmalcher/soundcraft-ui/commit/08315c582b4deea4a49f342b9be5f588340d876c))
- differentiate between mixer models for HW channels ([7d95c1f](https://github.com/fmalcher/soundcraft-ui/commit/7d95c1fcef872fc8b15e14d1a436f8e9bd8096a4))
- export all facade types in barrel ([f07afc4](https://github.com/fmalcher/soundcraft-ui/commit/f07afc42cec297e5355713c15cf5719b65308848))
- **testbed:** add opening page for connection ([7e7eec9](https://github.com/fmalcher/soundcraft-ui/commit/7e7eec947145275cf838f8f179010570f4700519))

### Other

- nx migrate to 15.5 ([05cc00d](https://github.com/fmalcher/soundcraft-ui/commit/05cc00d2c3552d4eaf4032db4c25902f0644bf0e))
- remove unused imports and non-necessary types ([ca151f2](https://github.com/fmalcher/soundcraft-ui/commit/ca151f230179a1a615d2f4dcdfa6b24297788fbb))
- setup CI with Nx Cloud ([6ac0ef4](https://github.com/fmalcher/soundcraft-ui/commit/6ac0ef46d7f625c9628a969d14cd8a7b0afbfab0))
- **testbed:** correctly setup ESLint ([1261807](https://github.com/fmalcher/soundcraft-ui/commit/126180714296b5887a49f31d48a961388bad33ae))

## [1.2.0](https://github.com/fmalcher/soundcraft-ui/compare/v1.1.1...v1.2.0) (2022-12-28)

### Features

- add multitrack busy state ([3e0fb3c](https://github.com/fmalcher/soundcraft-ui/commit/3e0fb3cf38d3cf62ee029b1857f8542c8cd3e5ac))
- add support for gain control on HW channels ([c064ab3](https://github.com/fmalcher/soundcraft-ui/commit/c064ab36e7ef412a20d44a9ccffd1a7c64e09865))

### Other

- create FUNDING.yml ([aa59c96](https://github.com/fmalcher/soundcraft-ui/commit/aa59c966c25cde1475eca65ec69d6fca21d7a3ee))
- move dB calculation and benckmark to separate files ([2a8dd5d](https://github.com/fmalcher/soundcraft-ui/commit/2a8dd5dd8936813c5c6c284d21298ee3ecd0f04c))

### [1.1.1](https://github.com/fmalcher/soundcraft-ui/compare/v1.1.0...v1.1.1) (2022-12-22)

### Bug Fixes

- add isomorphic-ws as dependency in lib pjson ([9b91341](https://github.com/fmalcher/soundcraft-ui/commit/9b9134162848df6ec9624d85eccb840f4e69e678))

## [1.1.0](https://github.com/fmalcher/soundcraft-ui/compare/v1.0.0...v1.1.0) (2022-12-22)

### Features

- add support for multitrack recording on Ui24R ([889ad2b](https://github.com/fmalcher/soundcraft-ui/commit/889ad2becb9211045e8392dd36f96a98748a0720))

### Other

- add NPM badge to main README ([6f6e468](https://github.com/fmalcher/soundcraft-ui/commit/6f6e468dd86488a95bf7c4dcd5ae9fa4226b3b60))
- emit all commit types to changelog ([a82c6a6](https://github.com/fmalcher/soundcraft-ui/commit/a82c6a6d6083cb73807ec9d0a1657ede280580d4))
- explicitly set useDefineForClassfields to false ([a7f66a7](https://github.com/fmalcher/soundcraft-ui/commit/a7f66a77fda0ee31dfe31133a75ce35727864dd9))
- **testbed:** migrate Angular app to full standalone app ([ce7d58e](https://github.com/fmalcher/soundcraft-ui/commit/ce7d58ed026bc452ad59a6de778cdbf64e774880))

## [1.0.0](https://github.com/fmalcher/soundcraft-ui/compare/v0.11.0...v1.0.0) (2022-12-15)

This is the greatest release ever – and also the first published major version! 🎉
This library is considered as _stable_ after a long period of testing in production.
A few things have been refactored, compared to the last version 0.11.0.
Please be aware of possible breaking changes. **Enjoy the lib and keep on producing!** 🎚️🎶

### Breaking Changes

- The `state$` property on `MixerStore` now contains a flat object, see [203cda0](https://github.com/fmalcher/soundcraft-ui/commit/203cda0fef38b70befcf0445df701acc900b492c).
- Connection and `fadeTo` methods now return a promise. You can simply ignore this but it's a change in the public API. See [83e84bb](https://github.com/fmalcher/soundcraft-ui/commit/83e84bb664f17b15d0d1f1a9c7861a82f4bfa7c1) and [d48902a](https://github.com/fmalcher/soundcraft-ui/commit/d48902ade088ac4f66fccded262872d8d33fb309).

### Features

- add mutegroups to channel store ([9c58b66](https://github.com/fmalcher/soundcraft-ui/commit/9c58b66d3164ba0f7de885be225cc33098d82928))
- add support for channel delay ([465cbfb](https://github.com/fmalcher/soundcraft-ui/commit/465cbfbf391d1790f3cd65eb4fd25c9cc82e8d01))
- add support for channel name ([51062a3](https://github.com/fmalcher/soundcraft-ui/commit/51062a344cf7a25d1b3b429968374a78fdefb0f6))
- add support for relative delay changes ([db99c01](https://github.com/fmalcher/soundcraft-ui/commit/db99c01a97ae04e3e39268a0223ef9fda68ee0ee))
- publish current show/snapshot/cue ([0561108](https://github.com/fmalcher/soundcraft-ui/commit/056110869a6e9895245bb1c3ad90e990d61412f3))
- restrict fader level values to allowed range ([cda38ce](https://github.com/fmalcher/soundcraft-ui/commit/cda38ceb669305112161502c0b43b66552b5b6f4))
- return Promise for connection methods ([83e84bb](https://github.com/fmalcher/soundcraft-ui/commit/83e84bb664f17b15d0d1f1a9c7861a82f4bfa7c1))
- return promise for fadeTo and fadeToDB ([d48902a](https://github.com/fmalcher/soundcraft-ui/commit/d48902ade088ac4f66fccded262872d8d33fb309))
- **testbed:** use input event instead of change ([32b184a](https://github.com/fmalcher/soundcraft-ui/commit/32b184aa7beb37e7a9f20e791827c31e665a3501))

### Refactoring

- refactor: store state as flat object instead of nested structure ([203cda0](https://github.com/fmalcher/soundcraft-ui/commit/203cda0fef38b70befcf0445df701acc900b492c))
- refactor: channel store can hold any kind of object ([445776d](https://github.com/fmalcher/soundcraft-ui/commit/445776dc66a45e13acd3e1340a192ae45c246806))
- refactor: remove simple raw value selectors ([f585575](https://github.com/fmalcher/soundcraft-ui/commit/f585575c76c581d07933d946b532a0be345b01c4))
- refactor: remove redundant helper and MixerState refs ([883bb8d](https://github.com/fmalcher/soundcraft-ui/commit/883bb8d95c1ffb2f3ca98ed0acc1f9891966ed3f))
- refactor: rename offset arguments ([f34e310](https://github.com/fmalcher/soundcraft-ui/commit/f34e310cd78a62ba8fc23b64824f55d9e5093fa5))

### Bug Fixes

- **docs:** fix missing word in README ([4a2565d](https://github.com/fmalcher/soundcraft-ui/commit/4a2565d753c3b9f6b7f5b89d91aac390939b04eb))
- **testbed:** style fixes ([58d67e6](https://github.com/fmalcher/soundcraft-ui/commit/58d67e676bc5dd3e71794cbe8248099c0411f8e9))

---

## [0.11.0](https://github.com/fmalcher/soundcraft-ui/compare/v0.10.1...v0.11.0) (2021-08-13)

### Features

- add support for phantom power ([08c8fd5](https://github.com/fmalcher/soundcraft-ui/commit/08c8fd564bf1f0508af07fac177448f3d908219a))

### [0.10.1](https://github.com/fmalcher/soundcraft-ui/compare/v0.9.0...v0.10.1) (2021-08-05)

### Features

- add support for loading shows, snapshots and cues ([f2791fc](https://github.com/fmalcher/soundcraft-ui/commit/f2791fce0e03480bc461c575371abdfc80543c76))

## [0.10.0](https://github.com/fmalcher/soundcraft-ui/compare/v0.9.0...v0.10.0) (2021-08-05)

### Features

- add support for loading shows, snapshots and cues ([f2791fc](https://github.com/fmalcher/soundcraft-ui/commit/f2791fce0e03480bc461c575371abdfc80543c76))

## [0.9.0](https://github.com/fmalcher/soundcraft-ui/compare/v0.8.0...v0.9.0) (2021-05-27)

### Features

- expose stream with raw SETD/SETS messages ([824b1d7](https://github.com/fmalcher/soundcraft-ui/commit/824b1d758b20168c02cba564f34264189826b594))

## [0.8.0](https://github.com/fmalcher/soundcraft-ui/compare/v0.7.1...v0.8.0) (2021-03-26)

### Features

- add volume control for SOLO and headphone bus ([b22de2b](https://github.com/fmalcher/soundcraft-ui/commit/b22de2bb980f2fc48246bf123096f10873e35a4a)), closes [#51](https://github.com/fmalcher/soundcraft-ui/issues/51)

### [0.7.1](https://github.com/fmalcher/soundcraft-ui/compare/v0.7.0...v0.7.1) (2020-12-23)

### Bug Fixes

- add "ws" as dependency in mixer-connection package.json ([ea2a860](https://github.com/fmalcher/soundcraft-ui/commit/ea2a86060cd1bece11895284b524eb1f6aee5e73)), closes [#48](https://github.com/fmalcher/soundcraft-ui/issues/48)
- **docs:** fix typo in README ([2a30c9b](https://github.com/fmalcher/soundcraft-ui/commit/2a30c9b55b9b2432196c4e744b61257383f1b3e7))

## [0.7.0](https://github.com/fmalcher/soundcraft-ui/compare/v0.6.0...v0.7.0) (2020-12-01)

### Features

- add bitmask util functions ([f4e44c2](https://github.com/fmalcher/soundcraft-ui/commit/f4e44c22be3929f37efc29cde6fb5bf46b513309))
- add player shuffle state and toggle ([c817a13](https://github.com/fmalcher/soundcraft-ui/commit/c817a1374d367aace6c0429c273deab41b83b756)), closes [#43](https://github.com/fmalcher/soundcraft-ui/issues/43)
- add support for 2-track USB recording ([e834f76](https://github.com/fmalcher/soundcraft-ui/commit/e834f76fef69c75b164f89c141b692d2bdacdd86))
- add support for MUTE groups ([61b74f5](https://github.com/fmalcher/soundcraft-ui/commit/61b74f5abd18e468a9c432a0c822c0d9b9461260)), closes [#42](https://github.com/fmalcher/soundcraft-ui/issues/42)

### Bug Fixes

- misused expect in outbound messages test ([4f76913](https://github.com/fmalcher/soundcraft-ui/commit/4f76913c0553ccb46a890a1393fbee7f545a59c0))
- **docs:** spelling mistake: Easing => Easings ([67bdae1](https://github.com/fmalcher/soundcraft-ui/commit/67bdae1cb59209321f87e7fd2e96376bec5d8c46))

## [0.6.0](https://github.com/fmalcher/soundcraft-ui/compare/v0.5.1...v0.6.0) (2020-11-15)

### Features

- add ChannelStore for object caching ([2cab536](https://github.com/fmalcher/soundcraft-ui/commit/2cab5360364abb82882ec3208678eaa658b40709)), closes [#33](https://github.com/fmalcher/soundcraft-ui/issues/33)
- add standard-version for changelog management ([ea28a1d](https://github.com/fmalcher/soundcraft-ui/commit/ea28a1d0f0f7b4fd84dbe2152d407c234b850f36))
- Stereo Link and rework of transitions ([85c2277](https://github.com/fmalcher/soundcraft-ui/commit/85c2277bd274024b0fffc3fe9c958f10e6b6a30e)), closes [#31](https://github.com/fmalcher/soundcraft-ui/issues/31) [#32](https://github.com/fmalcher/soundcraft-ui/issues/32)

### Bug Fixes

- move rounding out of LUT lookup ([a91097c](https://github.com/fmalcher/soundcraft-ui/commit/a91097cea8384456ed56e26fc8a109fc85605321)), closes [#39](https://github.com/fmalcher/soundcraft-ui/issues/39)
- use correct capping value for relative changes ([d57a030](https://github.com/fmalcher/soundcraft-ui/commit/d57a030bafc104b2dde062694f60f227d788053d))

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
