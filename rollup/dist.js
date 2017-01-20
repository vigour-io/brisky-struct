import nodeResolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
// import sourcemaps from 'rollup-plugin-sourcemaps'

export default {
  entry: 'src/index.js',
  plugins: [
    nodeResolve({
      jsnext: true
    }),
    commonjs()
    // sourcemaps()
  ],
  sourceMap: true,
  external: [ 'brisky-stamp' ],
  targets: [
    {
      // banner: `;require('source-map-support').install();`,
      dest: 'dist/index.js',
      format: 'cjs'
    },
    { dest: 'dist/index.es.js', format: 'es' }
  ]
}

// only for dev! -- prob need to get some coverage tools (pretty essential)
// import sourcemaps from 'rollup-plugin-sourcemaps';
