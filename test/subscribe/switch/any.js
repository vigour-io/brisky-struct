const test = require('tape')
const subsTest = require('../util')
const tree = require('../util/tree')

test('subscription - $switch - any', t => {
  const s = subsTest(t, {
    a: 'a',
    b: 'b',
    c: 'c',
    x: { val: true }
  }, {
    $any: {
      $switch: (t, subs, tree) => {
        if (t.compute() === 'a') {
          return { root: { x: { val: true } } }
        } else {
          return false
        }
      }
    }
  })
  const r = s('initial subscription', [ { path: 'x', type: 'new' } ])
  t.same(tree(r.tree).$any.$c, { 0: 'root' }, 'correct composite')
  s('rename', [ { path: 'x', type: 'remove' } ], { a: 'c' })
  t.same(tree(r.tree).$any.$c, void 0, 'removed composite')
  s('rename', [ { path: 'x', type: 'new' } ], { b: 'a' })
  t.same(tree(r.tree).$any.$c, { 1: 'root' }, 'correct composite')
  t.end()
})

test('subscription - $switch - any - composite - remove', t => {
  const s = subsTest(t, {
    list: [ 1, 2, 3 ],
    thing: 1
  }, {
    list: {
      $any: {
        $switch: {
          val: (t, subs, tree) => {
            if (t.root().thing.compute() === t.compute()) {
              return { val: true }
            }
          },
          root: { thing: true }
        }
      }
    }
  })
  s('initial subscription', [ { path: 'list/0', type: 'new' } ])
  s('update target', [
    { path: 'list/0', type: 'remove' },
    { path: 'list/1', type: 'new' }
  ], { thing: 2 })
  t.end()
})

test('subscription - $switch - any - composite - remove', t => {
  const s = subsTest(t, {
    list: [ 1, 2, 3 ],
    thing: 1
  }, {
    list: {
      $any: {
        $switch: {
          val: (t, subs, tree) => {
            if (t.root().thing.compute() === t.compute()) {
              return { val: true }
            }
          },
          root: { thing: true }
        }
      }
    }
  })
  s('initial subscription', [ { path: 'list/0', type: 'new' } ])
  s('update target', [
    { path: 'list/0', type: 'remove' }
  ], { thing: 'bla' })
  t.end()
})

test('subscription - $switch - any - filter', t => {
  const s = subsTest(t, {
    list: [ { rating: 1 }, { rating: 2 }, { rating: 3 } ],
    thing: 1
  }, {
    list: {
      $any: {
        $switch: {
          val: (t, subs, tree) => {
            if (t.rating.compute() > 2) {
              return { val: true }
            }
          },
          rating: { val: true }
        }
      }
    }
  })
  s('initial subscription', [ { path: 'list/2', type: 'new' } ])

  s('update target', [
    { path: 'list/2', type: 'remove' }
  ], { list: { 2: { rating: 0 } } })
  t.end()
})
