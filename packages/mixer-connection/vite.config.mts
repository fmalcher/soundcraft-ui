/// <reference types='vitest' />
import { defineConfig } from 'vite';

import dts from 'vite-plugin-dts';
import { join } from 'path';
import copy from 'rollup-plugin-copy';

// These options were migrated by @nx/vite:convert-to-inferred from the project.json file.
const configValues = { default: {} };

// Determine the correct configValue to use based on the configuration
const nxConfiguration = process.env.NX_TASK_TARGET_CONFIGURATION ?? 'default';

const options = {
  ...configValues.default,
  ...(configValues[nxConfiguration] ?? {}),
};

export default defineConfig({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/mixer-connection',
  plugins: [
    dts({
      entryRoot: 'src',
      tsconfigPath: join(__dirname, 'tsconfig.lib.json'),
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
