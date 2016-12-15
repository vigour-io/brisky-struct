import nodeResolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'

export default {
  entry: 'test/index.js',
  plugins: [
    nodeResolve({
      jsnext: true
    }),
    commonjs()
  ],
  sourceMap: true,
  targets: [
    { dest: 'dist/test/index.js', format: 'cjs' },
    { dest: 'dist/test/index.es.js', format: 'es' }
  ]
}
