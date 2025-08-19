import typescript from '@rollup/plugin-typescript'
import terser from '@rollup/plugin-terser'
import commonjs from '@rollup/plugin-commonjs'
import replace from '@rollup/plugin-replace'
import resolve from '@rollup/plugin-node-resolve'
import peerDepsExternal from 'rollup-plugin-peer-deps-external'
import { visualizer } from 'rollup-plugin-visualizer'

const isProduction = process.env.NODE_ENV === 'production'

const createConfig = (format, outputFile) => ({
  input: './src/index.ts',
  output: {
    file: outputFile,
    format,
    name: format === 'umd' ? 'ReactQrCode' : undefined,
    exports: 'named',
    sourcemap: true,
    globals:
      format === 'umd'
        ? {
            react: 'React',
            'react-dom': 'ReactDOM',
          }
        : undefined,
  },
  external: format === 'umd' ? ['react', 'react-dom'] : undefined,
  plugins: [
    peerDepsExternal(),
    resolve({
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
      preferBuiltins: false,
      browser: true,
    }),
    commonjs(),
    typescript({
      tsconfig: './tsconfig.json',
      declaration: format === 'esm',
      declarationMap: format === 'esm',
      declarationDir: format === 'esm' ? './dist' : undefined,
      outputToFilesystem: true,
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify(
        process.env.NODE_ENV || 'development'
      ),
      preventAssignment: true,
    }),
    isProduction &&
      terser({
        compress: {
          drop_console: true,
          drop_debugger: true,
          pure_funcs: ['console.log', 'console.info', 'console.debug'],
        },
        format: {
          comments: false,
        },
      }),
    isProduction &&
      format === 'esm' &&
      visualizer({
        filename: 'dist/stats.html',
        gzipSize: true,
        brotliSize: true,
      }),
  ].filter(Boolean),
})

export default [
  // ESM build (primary)
  createConfig('esm', 'dist/index.esm.js'),
  // CommonJS build
  createConfig('cjs', 'dist/index.cjs.js'),
  // UMD build (for CDN usage)
  createConfig('umd', 'dist/index.umd.js'),
]
