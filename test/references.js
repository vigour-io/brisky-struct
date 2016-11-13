const test = require('tape')
const struct = require('../')

test('references - listeners', t => {
  const a = struct({ $transform: val => val * 5 })
  const b = struct({ val: a, $transform: val => val * 5 })
  const results = []
  const c = struct({
    val: b,
    on: {
      data: {
        result: (t, val) => {
          results.push(val)
        }
      }
    }
  })
  const a2 = a.create() //eslint-disable-line
  a.set(1, 'stamp')
  t.same(results, [ 1 ], 'fires only for c (does not fire for a instance)')
  t.equal(c.compute(), 25, 'compute processes transforms in the reference chain')
  t.end()
})
