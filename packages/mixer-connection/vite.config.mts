/// <reference types='vitest' />
import { defineConfig } from 'vite';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';

import dts from 'vite-plugin-dts';
import { join } from 'path';
import copy from 'rollup-plugin-copy';

export default defineConfig({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/mixer-connection',
  plugins: [
    dts({
      entryRoot: 'src',
      tsconfigPath: join(__dirname, 'tsconfig.lib.json'),
    }),
    nxViteTsPaths(),
  ],
  // Uncomment this if you are using workers.
  // worker: {
  //   plugins: () => [ nxViteTsPaths() ],
  // },
  build: {
    outDir: '../../dist/packages/mixer-connection',
    reportCompressedSize: true,
    commonjsOptions: { transformMixedEsModules: true },
    lib: {
      entry: 'src/index.ts',
      name: 'mixer-connection',
      fileName: 'index',
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: [],
      plugins: [
        copy({
          targets: [
            {
              src: 'packages/mixer-connection/README.md',
              dest: 'dist/packages/mixer-connection/',
            },
          ],
          hook: 'writeBundle',
        }),
      ],
    },
  },
});
