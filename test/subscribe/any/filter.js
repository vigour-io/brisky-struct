const test = require('tape')
const struct = require('../../../')

test('subscription - any - sort', t => {
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
    results.push(val.key)
  })
  t.same(results, [ 'c', 'b', 'a' ], 'initial subscription')
  results = []
  s.set({ collection: { x: true } })
  t.same(results, [ 'x', 'c', 'b', 'a' ], 'add to end update all')
  t.end()
})

test('subscription - any - filter', t => {
  var results = []
  const s = struct({
    collection: {
      a: { rating: 6 },
      b: { rating: 4 },
      c: { rating: 10 }
    }
  })

  s.subscribe({
    collection: {
      $any: {
        $keys: (keys, s) => keys.filter(val => s.get([ val, 'rating', 'compute' ]) > 5.5),
        val: true
      }
    }
  }, (val, type) => {
    results.push(type === 'remove' ? '-' + val.key : val.key)
  })
  t.same(results, [ 'a', 'c' ], 'initial subscription')
  results = []
  s.collection.set({ a: { rating: 1 } })
  t.same(results, [ 'c', '-c' ], 'remove a, shift c')
  t.end()
})

test('subscription - any - filter - root', t => {
  var results = []
  const s = struct({
    target: 'a',
    collection: {
      a: { rating: 6 },
      b: { rating: 4 },
      c: { rating: 10 }
    }
  })

  s.subscribe({
    collection: {
      $any: {
        $keys: (keys, s) => keys.filter(val => s.root().get([ 'target', 'compute' ]) === val ||
          s.root().get([ 'target', 'compute' ]) === '*'),
        val: true,
        root: { target: true }
      }
    }
  }, (val, type) => {
    results.push(type === 'remove' ? '-' + val.key : val.key)
  })
  t.same(results, [ 'a', 'target' ], 'initial subscription')
  results = []
  s.target.set('b')
  t.same(results, [ 'b', 'target' ], 'remove a, shift c')

  results = []
  s.target.set('*')
  t.same(results, [ 'a', 'target', 'b', 'target', 'c', 'target' ], 'add all')

  results = []
  s.target.set('b')
  t.same(results, [ 'b', 'target', '-b', '-target', '-c', '-target' ], 'use b') // this breaks everything now

  // results = []
  // s.target.set('nothing') // this crashes...
  // t.same(results, [ 'b', 'target', '-b', '-target', '-c', '-target' ], 'use b') // this breaks everything now

  t.end()
})
