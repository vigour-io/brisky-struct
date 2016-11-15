const test = require('tape')
const struct = require('../')

test('emit ', t => {
  const results = []
  const a = struct({
  })
  a.on((t, val) => {
    results.push(val)
  })
  a.set('hello', 'stamp')
  t.same(results, [ 'hello' ], 'add listener using method')
  t.end()
})
