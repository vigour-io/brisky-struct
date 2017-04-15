const test = require('tape')
const { create: struct } = require('../../../')

// test('subscription - any - sort', t => {
//   var results = []
//   const s = struct({
//     collection: {
//       a: true,
//       b: true,
//       c: true
//     }
//   })

//   s.subscribe({
//     collection: {
//       $any: {
//         $keys: (keys, s) => keys.concat().sort((a, b) => a.key < b.key ? -1 : 1), // needs to be immtuable else issues
//         val: true
//       }
//     }
//   }, (val, type) => {
//     results.push(val.key)
//   })
//   t.same(results, [ 'c', 'b', 'a' ], 'initial subscription')
//   results = []
//   s.set({ collection: { x: true } })
//   t.same(results, [ 'x', 'c', 'b', 'a' ], 'add to end update all')
//   t.end()
// })

// test('subscription - any - filter', t => {
//   var results = []
//   const s = struct({
//     collection: {
//       a: { rating: 6 },
//       b: { rating: 4 },
//       c: { rating: 10 }
//     }
//   })

//   s.subscribe({
//     collection: {
//       $any: {
//         $keys: (keys, s) => keys.filter(val => s.get([ val, 'rating', 'compute' ]) > 5.5),
//         val: true
//       }
//     }
//   }, (val, type) => {
//     results.push(type === 'remove' ? '-' + val.key : val.key)
//   })
//   t.same(results, [ 'a', 'c' ], 'initial subscription')
//   results = []
//   s.collection.set({ a: { rating: 1 } })
//   t.same(results, [ 'c', '-c' ], 'remove a, shift c')
//   t.end()
// })

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

  t.same(results, [ '+a', '+target' ], 'initial subscription')
  results = []
  s.target.set('b')
  t.same(results, [ 'target', 'b' ], 'replace a')

  results = []
  s.target.set('*')
  t.same(results, [ 'target', 'a', '+b', '+c' ], 'add all')

  results = []
  s.target.set('b')
  t.same(results, [ 'target', 'b', '-b', '-c' ], 'use b') // this breaks everything now

  results = []
  s.target.set('nothing') // this crashes...
  t.same(results, [ 'target', '-b' ], 'use nothing') // this breaks everything now

  results = []
  s.target.set('*')
  t.same(results, [ 'target', '+a', '+b', '+c' ], 'add all')

  results = []
  s.set({ hello: 'yes' })
  t.same(results, [ '+hello', 'a', '+hello', 'b', '+hello', 'c' ], 'update hello')

  t.end()
})

test('subscription - any - multiple filter', t => {
  const movie1 = { title: 'movie1' }
  const movie2 = { title: 'movie1' }
  const show1 = { title: 'show1' }
  const show2 = { title: 'show2' }

  const s = struct({
    page: {
      movie1,
      movie2,
      show1,
      show2,
      shows: {
        title: 'shows',
        items: [
          [ '@', 'root', 'page', 'show1' ],
          [ '@', 'root', 'page', 'show2' ]
        ]
      },
      movies: {
        title: 'movies',
        items: [
          [ '@', 'root', 'page', 'movie1' ],
          [ '@', 'root', 'page', 'movie2' ]
        ]
      },
      search: {
        shows: {
          order: 0,
          val: [ '@', 'root', 'page', 'shows' ]
        },
        movies: {
          order: 1,
          val: [ '@', 'root', 'page', 'movies' ]
        }
      }
    },
    search: {
      page: [ '@', 'root', 'page', 'search' ]
    }
  })

  const sInstance = s.create()

  const path = []

  sInstance.subscribe({
    page: {
      current: {
        $any: {
          items: {
            $any: {
              $keys: {
                root: { search: { query: true } },
                title: true,
                val: (keys, s) => keys.filter(key => {
                  const q = s.root().get([ 'search', 'query', 'compute' ])
                  if (q && (s.get([ key, 'title', 'compute' ]) || '').indexOf(q) !== -1) {
                    return true
                  }
                })
              },
              val: true
            }
          }
        }
      }
    }
  }, (val, type) => {
    console.log(val.path())
    path.push(val.path())
  })

  sInstance.set({
    page: {
      current: [ '@', 'root', 'search', 'page' ]
    }
  })

  sInstance.set({
    search: { query: 'show' }
  })

  t.same(path, [
    [ 'search', 'query' ],
    [ 'page', 'shows', 'items', '0' ],
    [ 'page', 'shows', 'items', '1' ],
    [ 'search', 'query' ]
  ])

  t.end()
})
