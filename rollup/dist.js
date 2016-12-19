import nodeResolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'

export default {
  entry: 'lib/index.js',
  plugins: [
    nodeResolve({
      jsnext: true
    }),
    commonjs()
  ],
  sourceMap: true,
  external: [
    'brisky-stamp',
    'monotonic-timestamp'
  ],
  targets: [
    { dest: 'dist/index.js', format: 'cjs' },
    { dest: 'dist/index.es.js', format: 'es' }
  ]
}
