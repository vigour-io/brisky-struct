const test = require('tape')
const struct = require('../../../')

test('subscription - any - filter', t => {
  var results = []
  const s = struct({
    collection: {
      a: true,
      b: true,
      c: true
    }
  })

  s.subscribe({
    collection: {
      $any: {
        $keys: (keys, s) => keys.concat().sort((a, b) => a.key < b.key ? -1 : 1), // needs to be immtuable else issues
        val: true
      }
    }
  }, (val, type) => {
    console.log(val.key, type)
    results.push(val.key)
  })
  t.same(results, [ 'c', 'b', 'a' ], 'initial subscription')

  results = []
  s.set({ collection: { x: true } })
  t.same(results, [ 'x', 'c', 'b', 'a' ], 'add to end update all')
  // console.log(results)
  t.end()
})

// do one with switch and root etc
