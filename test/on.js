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
  var results = []
  const a = struct({ on: (t, val) => results.push(val) })
  a.set({ on: { data: (t, val) => results.push(val) } })

  a.set('hello', 'stamp')
  t.same(
    results, [ 'hello' ],
    'add listener on data _val when set directly on on'
  )

  results = []
  a.set({ on: { data: (t, val) => results.push(val) } })
  a.set('bye', 'stamp')
  t.same(
    results, [ 'bye' ],
    'add listener on data _val when set directly on emitter'
  )

  results = []
  a.set({ on: { data: { val: (t, val) => results.push(val) } } })
  a.set('now', 'stamp')
  t.same(results, [ 'now' ], 'rewrites val to _val internaly')
  t.end()
})
