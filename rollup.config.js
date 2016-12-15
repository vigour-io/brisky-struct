import nodeResolve from 'rollup-plugin-node-resolve'

export default {
  entry: 'lib/index.js',
  plugins: [
    nodeResolve({
      jsnext: true
    }),
    {
      ongenerate: (options, rendered) => {
        console.log('yo', rendered.code)
      }
    }
  ],
  external: [
    'brisky-stamp',
    'monotonic-timestamp'
  ],
  // sourceMap: true,
  targets: [
    { dest: 'dist/brisky-struct.js', format: 'cjs' },
    { dest: 'dist/brisky-struct.es.js', format: 'es' }
  ]
}
