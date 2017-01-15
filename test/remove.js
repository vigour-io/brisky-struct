const test = require('tape')
const { create: struct } = require('../')

test('remove - basic', t => {
  const s = struct({
    key: 's',
    a: 'a',
    b: 'b',
    c: 'c'
  })
  s.set(null, false)
  t.same(s.keys(), [], 'correct keys')
  t.end()
})

test('remove - instances - simple', t => {
  const results = []
  const s = struct({
    types: {
      a: {
        b: {
          on: (val, stamp, t) => {
            results.push(t.path())
          },
          c: {
            on: (val, stamp, t) => {
              results.push(t.path())
            }
          }
        }
      },
      a1: { type: 'a' }
    },
    x: {
      props: { default: { type: 'a1' } },
      aX: {}
    }
  })
  const obj = struct({ //eslint-disable-line
    key: 'obj',
    props: { default: s },
    hello: {}
  })
  s.set(null)
  t.same(results, [
    [ 'x', 'aX', 'b' ],
    [ 'x', 'aX', 'b', 'c' ],
    [ 'obj', 'hello', 'x', 'aX', 'b' ],
    [ 'obj', 'hello', 'x', 'aX', 'b', 'c' ]
  ])
  const results2 = []
  const a = struct({
    types: {
      a: {
        b: {
          on: (val, stamp, t) => {
            results2.push(t.path())
          }
        }
      },
      blurf: {
        type: 'a'
      }
    },
    aa: {
      type: 'blurf'
    },
    bb: {
      type: 'blurf'
    }
  })
  a.types.blurf.set(null)
  t.same(results2, [ [ 'types', 'blurf', 'b' ], [ 'bb', 'b' ], [ 'aa', 'b' ] ])
  t.end()
})

test('remove - instances', t => {
  const results = []
  const s = struct({
    key: 's',
    types: {
      a: {
        b: {
          c: { on: (val, stamp, t) => results.push(t.path()) }
        }
      },
      x: {
        z: { on: (val, stamp, t) => results.push(t.path()) }
      }
    },
    bla: {
      on: (val, stamp, t) => results.push(t.path()),
      a: { type: 'a' }
    },
    nice: {},
    x: {
      type: 'x',
      field: true
    },
    on: (val, stamp, t) => results.push(t.path())
  })
  const s2 = s.create({ key: 's2' }) //eslint-disable-line
  const obj = struct({ //eslint-disable-line
    key: 'obj',
    props: {
      nested: { type: 'struct' },
      default: s,
      weird: s.x
    },
    hello: {},
    weird: {},
    blurf: {
      x: {
        z: 'haha'
      }
    },
    nested: {
      on: (val, stamp, t) => results.push(t.path()),
      props: { default: s.nice },
      haha: {}
    }
  })

  s.set(null, 'stamp')
  t.same(obj.keys(), [ 'nested' ], 'cleared keys on Obj')
  t.same(results, [
    [ 's' ],
    [ 'obj', 'blurf', 'bla' ],
    [ 'obj', 'hello', 'bla' ],
    [ 's2', 'bla' ],
    [ 's', 'bla' ],
    [ 's', 'bla', 'a', 'b', 'c' ],
    [ 'obj', 'blurf', 'bla', 'a', 'b', 'c' ],
    [ 'obj', 'hello', 'bla', 'a', 'b', 'c' ],
    [ 's2', 'bla', 'a', 'b', 'c' ],
    [ 'obj', 'blurf' ],
    [ 'obj', 'hello' ],
    [ 's2' ],
    [ 'obj', 'nested' ],
    [ 's', 'x', 'z' ],
    [ 'obj', 'hello', 'x', 'z' ],
    [ 's2', 'x', 'z' ],
    [ 'obj', 'weird', 'z' ]
  ], 'fires all listeners on remove')
  t.end()
})

test('remove - mixed', t => {
  const results = []
  const s = struct({
    key: 's',
    a: 'a',
    b: 'b',
    c: 'c',
    on: (val, stamp, t) => results.push(t.path())
  })
  const s2 = s.create({
    key: 's2',
    a: { type: 'struct' }
  })
  console.log('fuck?', results)
  const s3 = s.create({
    key: 's3',
    a: 'hello'
  })
  const s4 = s3.create({
    key: 's4'
  })

  s.set({ d: true, a: null, haha: true }, [ 'stamp' ])
  t.same(s.keys(), [ 'b', 'c', 'd', 'haha' ], 'correct keys')
  t.same(s2.keys(), [ 'b', 'c', 'd', 'haha', 'a' ], 'correct keys on "s2"')
  t.same(s3.keys(), [ 'b', 'c', 'd', 'haha' ], 'correct keys on "s3"')
  t.same(s4.keys(), [ 'b', 'c', 'd', 'haha' ], 'correct keys on "s4"')
  t.same(
    results, [ [ 's3' ], [ 's4' ], [ 's' ], [ 's2' ] ],
    'fires correct listeners'
  )
  const a = struct({ a: true, b: true })
  const b = a.create({ a: { type: 'struct' } })
  a.set({ d: true, a: null }, false)
  t.same(b.keys(), [ 'b', 'd', 'a' ], 'correct keys on "a"')
  t.end()
})

test('remove - keys', t => {
  const results = []
  const s = struct({
    a: 'a',
    b: 'b',
    c: 'c',
    on: (val, stamp, t) => results.push(t.keys().concat())
  })
  s.set({ a: null })
  s.set({ b: null })
  s.set({ c: null })
  t.same(results, [ [ 'b', 'c' ], [ 'c' ], [] ], 'correct keys results')
  t.end()
})

test('remove - instances - own keys', t => {
  const results = []
  const a = struct({
    key: 'A',
    a: 'a',
    b: 'b',
    c: 'c',
    on: (val, stamp, t) => results.push(t.keys().concat())
  })

  const b = a.create({ key: 'B', ba: true, b: true }, false)
  const c = b.create({ key: 'C', bc: true, c: true }, false) // eslint-disable-line

  a.set(null)

  t.same(results, [
    [ 'a', 'b', 'c' ],
    [ 'b', 'c', 'ba' ],
    [ 'b', 'c', 'ba', 'bc' ]
  ], 'correct keys')

  t.end()
})
