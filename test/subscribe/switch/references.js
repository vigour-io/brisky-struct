const test = require('tape')
const subsTest = require('../util')
const struct = require('../../../').create

test('subscription - $switch - references', t => {
  const s = subsTest(t, {
    a: { a: 'hello' },
    b: { a: 'hello' },
    field: [ '@', 'root', 'a' ]
  }, {
    field: {
      $switch: (t, subs, tree) => {
        // in render this will allways have $blockRemove (make sure thats true ;))
        return { a: { val: true } }
      }
    }
  })

  s('initial subscription', [ { path: 'a/a', type: 'new' } ])

  s('switch reference', [
    { path: 'a/a', type: 'remove' },
    { path: 'b/a', type: 'new' }
  ], { field: [ '@', 'root', 'b' ] })

  t.end()
})

test('subscription - $switch - references', t => {
  const state = struct()
  var results = []
  var cnt = 0

  state.subscribe({
    field: {
      navigation: {
        $switch (val) {
          cnt++
          return {
            title: { val: true },
            navigation: {
              $switch (val) {
                return {
                  title: { val: true }
                }
              }
            }
          }
        }
      }
    }
  }, (s, type) => results.push(s.path(), type))

  state.set({
    otheritems: {
      first: { title: 'first' },
      second: { rating: 100 }
    },
    items: {
      first: {
        title: 'first',
        navigation: {}
      },
      second: { rating: 100 }
    },
    field: {
      val: 'blurf',
      navigation: {
        val: [ '@', 'root', 'items', 'first' ]
      }
    }
  })

  t.same([ [ 'items', 'first', 'title' ], 'new' ], results, 'results')
  t.equal(cnt, 1, 'top switch fired once')
  results = []
  state.items.first.navigation.set([ '@', 'root', 'items', 'first' ])
  t.same([ [ 'items', 'first', 'title' ], 'new' ], results, 'results')
  t.end()
})
