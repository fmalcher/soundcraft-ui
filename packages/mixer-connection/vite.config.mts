/// <reference types='vitest' />
import { defineConfig } from 'vite';

import dts from 'vite-plugin-dts';
import { join } from 'path';
import copy from 'rollup-plugin-copy';

export default defineConfig({
  root: import.meta.dirname,
  cacheDir: '../../node_modules/.vite/mixer-connection',
  plugins: [
    dts({
      entryRoot: 'src',
      tsconfigPath: join(import.meta.dirname, 'tsconfig.lib.json'),
    }),
    copy({
      verbose: true,
      targets: [
        {
          src: ['README.md', 'package.json'],
          dest: '../../dist/packages/mixer-connection/',
        },
      ],
      hook: 'writeBundle',
    }),
  ],
  resolve: {
    tsconfigPaths: true,
  },
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
    rolldownOptions: {
      external: [],
    },
  },
});
