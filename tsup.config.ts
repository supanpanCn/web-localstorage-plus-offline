import type { Options } from 'tsup'

export const tsup: Options = {
  splitting: false,
  sourcemap: true,
  clean: true,
  format: ['cjs', 'esm','iife'],
  dts: true,
  entryPoints: [
    'src/index.ts',
    'src/transform.ts'
  ],
  define: {
    __DEV__: 'false',
  },
}
