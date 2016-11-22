const test = require('tape')
const struct = require('../')

test('on - method ', t => {
  const results = []
  const a = struct()
  t.equal(a.on(val => { results.push(val) }), a, 'returns struct')
  a.set('hello')
  t.same(results, [ 'hello' ], 'add listener using method')
  t.end()
})

test('on - emit ', t => {
  const results = []
  const a = struct()
  a.on((val, stamp) => { results.push(val, stamp) })
  a.emit('data', 'hello', 'custom-stamp')
  t.same(results, [ 'hello', 'custom-stamp' ], 'emit method')
  t.end()
})

test('on - defaults ', t => {
  var results = []
  const a = struct({ on: val => results.push(val) })
  a.set({ on: { data: val => results.push(val) } })
  a.set('hello')
  t.same(
    results, [ 'hello' ],
    'add listener on data _val when set directly on on'
  )
  results = []
  a.set({ on: { data: val => results.push(val) } })
  a.set('bye')
  t.same(
    results, [ 'bye' ],
    'add listener on data _val when set directly on emitter'
  )
  results = []
  a.set({ on: { data: { val: val => results.push(val) } } })
  a.set('now')
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
        a: (val, stamp, t) => results.push('a-' + t.key),
        b: (val, stamp, t) => results.push('b-' + t.key),
        c: (val, stamp, t) => results.push('c-' + t.key)
      }
    }
  })
  const b = a.create({
    key: 'b',
    on: {
      data: {
        b: (val, stamp, t) => instanceResults.push('b-' + t.key)
      }
    }
  })
  a.set('hello!')
  t.same(results, [ 'a-a', 'b-a', 'c-a', 'a-b', 'c-b' ], 'excludes "b-b"')
  t.same(instanceResults, [ 'b-b' ], 'correct instance result')
  results = []
  instanceResults = []
  const c = b.create({ key: 'c' })
  a.set({ on: (val, stamp, t) => results.push('VAL-' + t.key) })
  a.set('bye!', 'stamp-2')
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
  c.set({ on: (val, stamp, t) => instanceResults.push('VAL-C-' + t.key) })
  const a2 = a.create({ key: 'a2', on: { data: {} } })
  const a3 = a2.create({ key: 'a3', on: { data: {} } }) // eslint-disable-line
  a.set({
    on: {
      data: {
        val: (val, stamp, t) => results.push('NEW-VAL-' + t.key),
        extra: (val, stamp, t) => results.push('extra-' + t.key),
        a: null
      }
    }
  })
  a.set('no way!')
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
  ref.set('hello')
  t.same(results, [ 'a', 'b' ], 'fires for multiple references')
  t.end()
})

test('on - context ', t => {
  var results = []
  var log = []
  var special = []
  const a = struct({
    key: 'a',
    on: {
      data: {
        results: (val, stamp, t) => results.push(t.path()),
        log: (val, stamp, t) => log.push(t.path())
      }
    }
  })
  const b = a.create({
    key: 'b',
    on: {
      data: {
        special: (val, stamp, t) => special.push(t.path())
      }
    }
  })
  a.set('hello')
  t.same(results, [ ['a'], ['b'] ], 'results')
  t.same(log, [ ['a'], ['b'] ], 'log')
  t.same(special, [ ['b'] ], 'special')

  results = []
  log = []
  special = []
  const c = b.create({
    key: 'c',
    on: {
      data: {
        log: null,
        special: null,
        hello: (val, stamp, t) => log.push(t.path())
      }
    }
  })
  c.set({ on: { data: { hello: (val, stamp, t) => special.push(t.path()) } } })
  a.set('bye')
  t.same(results, [ ['a'], ['b'], ['c'] ], 'results (including "c")')
  t.same(log, [ ['a'], ['b'] ], 'log (including "c")')
  t.same(special, [ ['b'], ['c'] ], 'special (including "c")')

  special = []
  c.set({ on: { data: { special: (val, stamp, t) => special.push(t.path()) } } })
  c.set('wow')
  t.same(special, [ ['c'], ['c'] ], 'special set on c')
  t.end()
})
