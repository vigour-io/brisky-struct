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
  a.set(1, 'stamp')
  t.same(results, [ 1 ])
  t.equal(c.compute(), 25)
  t.end()
})
