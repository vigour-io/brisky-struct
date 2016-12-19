import test from 'tape'
import subsTest from '../util'
import tree from '../util/tree'

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
  s('initial subscription', [
    { path: 'thing', type: 'new' },
    { path: 'list/0', type: 'new' },
    { path: 'thing', type: 'new' },
    { path: 'thing', type: 'new' }
  ])
  s('update target', [
    { path: 'thing', type: 'update' },
    { path: 'list/0', type: 'remove' },
    { path: 'thing', type: 'update' },
    { path: 'thing', type: 'update' }
  ], { thing: 2 })
  t.end()
})

test('subscription - $switch - any - composite - remove (variant)', t => {
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

// test('subscription - $switch - any - filter', t => {
//   const s = subsTest(t, {
//     list: [ { rating: 1 }, { rating: 2 }, { rating: 3 } ],
//     thing: 1
//   }, {
//     list: {
//       $any: {
//         $switch: {
//           val: (t, subs, tree) => {
//             if (t.rating.compute() > 2) {
//               return { val: true }
//             }
//           },
//           rating: { val: true }
//         }
//       }
//     }
//   })
//   s('initial subscription', [ { path: 'list/2', type: 'new' } ])

//   s('update target', [
//     { path: 'list/2', type: 'remove' }
//   ], { list: { 2: { rating: 0 } } })
//   t.end()
// })

// test('subscription - $switch - any - filter', t => {
//   const s = subsTest(t, {
//     list: [ { bla: { rating: 3 } }, { bla: { rating: 1 } }, { bla: { rating: 2 } }, { bla: { rating: 4 } } ],
//     thing: 1,
//     unicorn: 'unicorn'
//   }, {
//     list: {
//       $any: {
//         $keys: (keys, s) => {
//           return keys.filter(val => s[val].bla.rating.compute() < 10)
//         },
//         bla: {
//           $switch: {
//             val: (t, subs, tree) => {
//               if (t.rating.compute() > 2) {
//                 return { root: { unicorn: { val: true } } }
//               } else {
//                 return { val: true }
//               }
//             },
//             rating: { val: true }
//           }
//         }
//       }
//     }
//   })

//   s('initial subscription', [
//     { path: 'unicorn', type: 'new' },
//     { path: 'list/1/bla', type: 'new' },
//     { path: 'list/2/bla', type: 'new' },
//     { path: 'unicorn', type: 'new' }
//   ])

//   s('remove 0', [
//     { path: 'unicorn', type: 'remove' },
//     { path: 'list/1/bla', type: 'new' },
//     { path: 'list/1/bla', type: 'remove' },
//     { path: 'list/2/bla', type: 'new' },
//     { path: 'list/2/bla', type: 'remove' },
//     { path: 'unicorn', type: 'new' },
//     { path: 'unicorn', type: 'remove' }
//   ], { list: { 0: { bla: { rating: 10 } } } })

//   t.end()
// })
