const test = require('tape')
const struct = require('../')

test('remove - only remove', t => {
  const results = []
  const s = struct({
    key: 's',
    types: {
      a: {
        b: {
          c: { on: t => results.push(t.path()) }
        }
      },
      x: {
        z: { on: t => results.push(t.path()) }
      }
    },
    bla: {
      on: t => results.push(t.path()),
      a: { type: 'a' }
    },
    nice: {},
    x: {
      type: 'x',
      field: true
    },
    on: t => results.push(t.path())
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
      on: t => results.push(t.path()),
      props: { default: s.nice },
      haha: {}
    }
  })
  s.set(null, 'stamp')
  t.same(obj.keys(), [ 'nested' ], 'cleared keys on Obj')
  t.same(results, [
    [ 'obj', 'blurf' ],
    [ 'obj', 'blurf', 'bla' ],
    [ 'obj', 'blurf', 'bla', 'a', 'b', 'c' ],
    [ 'obj', 'blurf', 'x', 'z' ],
    [ 'obj', 'hello' ],
    [ 'obj', 'hello', 'bla' ],
    [ 'obj', 'hello', 'bla', 'a', 'b', 'c' ],
    [ 'obj', 'hello', 'x', 'z' ],
    [ 's2' ],
    [ 's2', 'bla' ],
    [ 's2', 'bla', 'a', 'b', 'c' ],
    [ 's2', 'x', 'z' ],
    [ 's' ],
    [ 's', 'bla' ],
    [ 's', 'bla', 'a', 'b', 'c' ],
    [ 'obj', 'nested' ],
    [ 'obj', 'blurf', 'x', 'z' ],
    [ 'obj', 'weird', 'z' ],
    [ 's', 'x', 'z' ]
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
    on: t => results.push(t.path())
  })
  s.set({
    d: true,
    a: null
  }, 'stamp')
  t.same(results, [ [ 's' ] ], 'fires once')
  t.end()
})
