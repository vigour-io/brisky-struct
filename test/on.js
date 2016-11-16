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
  const b = a.create({
    key: 'b',
    on: {
      data: {
        b: (t) => instanceResults.push('b-' + t.key)
      }
    }
  })
  a.set('hello!', 'stamp')
  t.same(results, [ 'a-a', 'b-a', 'c-a', 'a-b', 'c-b' ], 'excludes "b-b"')
  t.same(instanceResults, [ 'b-b' ], 'correct instance result')
  results = []
  instanceResults = []
  const c = b.create({ key: 'c' })
  a.set({ on: t => results.push('VAL-' + t.key) })
  a.set('bye!', 'stamp')
  t.same(
    results,
    [
      'a-a',
      'b-a',
      'c-a',
      'VAL-a',
      'a-b',
      'c-b',
      'VAL-b',
      'a-c',
      'c-c',
      'VAL-c'
    ],
    'fires update for each instance on "val"'
  )
  t.same(instanceResults, [ 'b-b', 'b-c' ], 'correct instance result')
  results = []
  c.set({ on: t => instanceResults.push('VAL-C-' + t.key) })
  const a2 = a.create({ key: 'a2', on: { data: {} } })
  const a3 = a2.create({ key: 'a3', on: { data: {} } }) // eslint-disable-line
  a.set({
    on: {
      data: {
        val: t => results.push('NEW-VAL-' + t.key),
        extra: t => results.push('extra-' + t.key),
        a: null
      }
    }
  })
  a.set('no way!', 'stamp')
  t.same(
    results,
    [
      'b-a',
      'c-a',
      'NEW-VAL-a',
      'extra-a',
      'b-a2',
      'c-a2',
      'NEW-VAL-a2',
      'extra-a2',
      'b-a3',
      'c-a3',
      'NEW-VAL-a3',
      'extra-a3',
      'c-b',
      'VAL-b',
      'NEW-VAL-b',
      'extra-b',
      'c-c',
      'extra-c'
    ],
    'fires updates for all instances'
  )

  t.end()
})

test('on - struct ', t => {
  const results = []
  const ref = struct()
  struct({ val: ref, on: () => results.push('a') })
  struct({ val: ref, on: () => results.push('b') })
  ref.set('hello', 'stamp')
  t.same(results, [ 'a', 'b' ], 'fires for multiple references')
  t.end()
})
