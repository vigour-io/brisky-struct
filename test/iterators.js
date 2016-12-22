const test = require('tape')
const { create: struct } = require('../')

test('iterators - functional', t => {
  const a = struct({ key: 1, a: 'a', b: 'b', c: 'c' })
  t.same(a.keys(), [ 'a', 'b', 'c' ], 'correct initial keys')
  const b = a.create({ key: 2, d: true, a: true, e: true })
  t.same(a.keys(), [ 'a', 'b', 'c' ], 'correct keys after creating an instance')
  a.set({ a: null, b: null })
  t.same(a.keys(), [ 'c' ], 'correct keys on "a" after remove')
  t.same(b.keys(), [ 'c', 'd', 'e' ], 'correct keys on "b" after remove')
  b.get('c').set(null)
  t.same(b.keys(), [ 'd', 'e' ], 'correct keys on "b" after context remove')
  t.same(a.keys(), [ 'c' ], 'did not influence "a"')
  const c = b.create()
  c.get('d').set(null)
  t.same(c.keys(), [ 'e' ], 'correct keys on "c" after context remove')
  c.push('hello')
  t.same(c.keys().length, 2, 'push extra key')
  const d = struct({ a: 'a', b: 'b', c: 'c' })
  t.same(d.map(val => val), [ d.a, d.b, d.c ], 'map')
  t.same(d.filter(val => val.key === 'a'), [ d.a ], 'filter')
  t.equal(d.reduce((a, b) => a + b.compute(), ''), 'abc', 'reduce')
  const result = []
  d.forEach(val => result.push(val))
  t.same(d.map(val => val), [ d.a, d.b, d.c ], 'forEach')

  const empty = struct({})
  t.same(empty.filter(val => true), [], 'filter returns empty array')
  t.end()
})

test('iterators - for of', t => {
  const a = struct([ 1, 2, 3, 4, 5, 6, 7 ])
  const results = []
  for (let val of a) {
    results.push(val.compute())
  }
  t.same(results, [ 1, 2, 3, 4, 5, 6, 7 ], 'expected iteration')
  t.end()
})

test('iterators - keys', t => {
  const a = struct()
  const results = a.keys()
  t.same(results, [], 'keys returns an empty array')
  t.end()
})
