import nodeResolve from 'rollup-plugin-node-resolve'

export default {
  entry: 'lib/index.js',
  plugins: [
    nodeResolve({
      jsnext: true
    })
  ],
  external: [
    'brisky-stamp',
    'monotonic-timestamp'
  ],
  // sourceMap: true,
  targets: [
    { dest: 'dist/index.js', format: 'cjs' },
    { dest: 'dist/index.es.js', format: 'es' }
  ]
}
