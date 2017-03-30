const test = require('tape')
const { create: struct } = require('../')
const bs = require('stamp')

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

  empty.push('hello', bs.create())
  t.same(empty.keys().length, 1, 'push extra key')
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

test('iterators - find', t => {
  const s = struct([ 1, 2, 3, 4, 5 ])
  t.same(s.find(val => val.compute() === 1), s[0])
  t.end()
})

test('iterators - findIndex', t => {
  const s = struct([ 1, 2, 3, 4, 5 ])
  t.same(s.findIndex(val => val.compute() === 1), 0)
  t.end()
})

test('iterators - every', t => {
  const s = struct([ 1, 2, 3, 4, 5 ])
  t.same(s.every(val => !isNaN(val.compute())), true)
  t.end()
})

test('iterators - some', t => {
  const s = struct([ 1, 2, 3, 4, 5 ])
  t.same(s.some(val => val.compute() > 3), true)
  t.end()
})

test('iterators - indexOf', t => {
  const s = struct([ 1, 2, 3, 4, 5 ])
  t.same(s.indexOf(1), 0)
  t.end()
})

test('iterators - lastIndexOf', t => {
  const s = struct([ 1, 1, 1, 1 ])
  t.same(s.lastIndexOf(1), 3)
  t.end()
})

test('iterators - includes', t => {
  const s = struct([ 1, 2, 3, 4, 5 ])
  t.ok(s.includes(1))
  t.ok(!s.includes(21))
  t.ok(!s.includes(1, 1))
  t.ok(!s.includes(1, -4))
  t.ok(s.includes(1, -100))
  t.end()
})

test('iterators - slice', t => {
  const s = struct([ 1, 2, 3, 4, 5 ])
  t.same(s.slice(1, 3), [ s[1], s[2] ])
  t.end()
})

test('iterators - sort', t => {
  const s = struct([ 1, 2, 3, 4, 5 ])
  t.same(s.sort((a, b) => a.compute() - b.compute() ? 1 : -1), [
    s[4], s[3], s[2], s[1], s[0]
  ])
  t.end()
})

test('iterators - reverse', t => {
  const s = struct([ 1, 2, 3, 4, 5 ])
  t.same(s.reverse(), [ s[4], s[3], s[2], s[1], s[0] ])
  t.end()
})

test('toString', t => {
  const s = struct({
    a: 'hello',
    b: 100,
    c: { x: true },
    d: void 0,
    z: { val: 'z', $transform: val => val + '!' }
  })

  t.equal(s.a + '!', 'hello!')
  t.equal(s.b + '!', '100!')
  t.equal(s.c + '!', '!')
  t.equal(s.d + '!', '!')
  t.equal(s.z.toString(), 'z!')
  t.end()
})
