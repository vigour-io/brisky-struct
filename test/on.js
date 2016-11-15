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

test('on - instances ', t => {
  var results = []
  var instanceResults = []
  const a = struct({
    key: 'a',
    on: {
      data: {
        a: (t) => results.push('a-' + t.key),
        b: (t) => results.push('b-' + t.key),
        c: (t) => results.push('c-' + t.key)
      }
    }
  })
  const b = a.create({ //eslint-disable-line
    key: 'b',
    on: {
      data: {
        b: (t) => instanceResults.push('b-' + t.key)
      }
    }
  })
  a.set('hello!', 'stamp')
  t.same(results, [ 'a-a', 'b-a', 'c-a', 'a-b', 'c-b' ], 'excludes "b-b"')
  t.same(instanceResults, [ 'b-b' ], '"b-b" instance result')
  t.end()
})
