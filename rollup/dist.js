import nodeResolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import sourcemaps from 'rollup-plugin-sourcemaps'

export default {
  entry: 'lib/index.js',
  plugins: [
    nodeResolve({
      jsnext: true
    }),
    commonjs(),
    sourcemaps()
  ],
  sourceMap: true,
  external: [ 'brisky-stamp' ],
  targets: [
    { dest: 'dist/index.js', format: 'cjs' },
    { dest: 'dist/index.es.js', format: 'es' }
  ]
}

// import sourcemaps from 'rollup-plugin-sourcemaps';
