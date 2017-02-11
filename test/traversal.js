const test = require('tape')
const { create: struct } = require('../')

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

test('path - context', t => {
  const a = struct({
    a: {
      x: 'hello',
      b: { c: true }
    },
    x: [ '@', 'root', 'a', 'b', 'c' ]
  })
  const a1 = a.create()
  t.same(a1.get([ 'x', 'val' ]).path(), [ 'a', 'b', 'c' ])
  t.end()
})
