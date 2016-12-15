const test = require('tape')
const struct = require('../').create

test('parent', t => {
  const a = struct({
    a: {
      x: 'hello',
      b: { c: true }
    }
  })

  t.equal(a.get([ 'a', 'b', 'c' ]).parent(2), a.get([ 'a' ]), 'level')

  t.equal(
    a.get([ 'a', 'b', 'c' ]).parent(p => p.get('x') && p), a.get([ 'a' ]),
    'function'
  )

  t.end()
})
