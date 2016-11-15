const test = require('tape')
const struct = require('../')

test('iterators - keys', t => {
  const a = struct({ a: 'a', b: 'b', c: 'c' })
  t.same(a.keys(), [ 'a', 'b', 'c' ], 'correct initial keys')
  const b = a.create({ d: true, a: true })
  a.set({ a: null, b: null })
  t.same(a.keys(), [ 'c' ], 'correct keys on "a" after remove')
  t.same(b.keys(), [ 'a', 'c', 'd' ], 'correct keys on "b" after remove')
  b.get('c').set(null)
  t.same(b.keys(), [ 'a', 'd' ], 'correct keys on "b" after context remove')
  t.same(a.keys(), [ 'c' ], 'did not influence "a"')
  const c = b.create()
  c.get('d').set(null)
  t.same(c.keys(), [ 'a' ], 'correct keys on "c" after context remove')
  t.end()
})

