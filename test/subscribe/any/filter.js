import test from 'tape'
import { create as struct } from '../../../'

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
      a: true,
      b: true,
      c: true
    }
  })

  s.subscribe({
    collection: {
      $any: {
        $keys: {
          val: (keys, s) =>
            keys.filter(val => s.root().get([ 'target', 'compute' ]) === val ||
            s.root().get([ 'target', 'compute' ]) === '*'),
          root: { target: true }
        },
        val: true,
        root: {
          hello: true
        }
      }
    }
  }, (v, t) => results
    .push(t === 'remove' ? '-' + v.key : t === 'new' ? '+' + v.key : v.key)
  )

  t.same(results, [ '+a' ], 'initial subscription')
  results = []
  s.target.set('b')
  t.same(results, [ 'b' ], 'replace a')

  results = []
  s.target.set('*')
  t.same(results, [ 'a', '+b', '+c' ], 'add all')

  results = []
  s.target.set('b')
  t.same(results, [ 'b', '-b', '-c' ], 'use b') // this breaks everything now

  results = []
  s.target.set('nothing') // this crashes...
  t.same(results, [ '-b' ], 'use nothing') // this breaks everything now

  results = []
  s.target.set('*')
  t.same(results, [ '+a', '+b', '+c' ], 'add all')

  results = []
  s.set({ hello: 'yes' })
  t.same(results, [ '+hello', 'a', '+hello', 'b', '+hello', 'c' ], 'update hello')

  t.end()
})
