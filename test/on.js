const test = require('tape')
const struct = require('../')

test('on - method ', t => {
  const results = []
  const a = struct()
  t.equal(a.on((t, val) => { results.push(val) }), a, 'returns struct')
  a.set('hello', 'stamp')
  t.same(results, [ 'hello' ], 'add listener using method')
  t.end()
})

test('on - defaults ', t => {
  const results = []
  const a = struct({ on: (t, val) => results.push(val) })
  a.set('hello', 'stamp')
  t.same(results, [ 'hello' ], 'add listener using method')
  t.end()
})
