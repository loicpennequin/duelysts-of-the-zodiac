import { defineConfig } from 'tsup';

export default defineConfig({
  entryPoints: ['src/index.ts', 'src/client/index.ts'],
  splitting: false,
  sourcemap: true,
  clean: true,
  dts: true,
  format: ['cjs', 'esm']
});
