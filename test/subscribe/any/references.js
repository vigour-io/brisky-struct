'use strict'
const test = require('tape')
const subsTest = require('../util')
// const struct = require('../../../')

test('subscription - any - reference - fields', t => {
  const s = subsTest(
    t,
    {
      0: 'its zero',
      1: 'its 1',
      collection: {
        0: [ '@', 'root', 0 ],
        1: [ '@', 'root', 1 ]
      }
    },
    {
      collection: {
        $any: { val: true }
      }
    }
  )
  s(
    'initial subscription',
    [
      { path: 'collection/0', type: 'new' },
      { path: 'collection/1', type: 'new' }
    ]
  )
  s(
    'update 0',
    [
      { path: 'collection/0', type: 'update' }
    ],
    [ 'hello its an update in zero' ]
  )
  s(
    'remove 0',
    [
      { path: 'collection/0', type: 'update' }
    ],
    [ null ]
  )
  t.end()
})

// test('reference - any - target - struct', function (t) {
//   const subscription = {
//     a: {
//       $remove: true,
//       $any: {
//         $remove: true,
//         title: { val: true }
//       }
//     }
//   }
//   const b = [ { title: 1 }, { title: 2 }, { title: 3 }, { title: 4 } ]
//   const s = subsTest(t, { b: b, a: '$root.b' }, subscription)
//   s('initial subscription', multiple('new'))
//   function multiple (type, nopath) {
//     const val = []
//     for (let i = 0, len = b.length; i < len; i++) {
//       if (nopath) {
//         val.push({ type: type })
//       } else {
//         val.push({ type: type, path: 'b/' + i + '/title' })
//       }
//     }
//     return val
//   }

//   s(
//     'remove reference',
//      multiple('remove', true),
//      { a: false }
//    )
//   t.end()
// })

// test('reference - any - over reference', function (t) {
//   const state = new State({
//     a: {
//       a1: true,
//       a2: true
//     },
//     b: {
//       b1: true
//     },
//     collection: '$root.a'
//   })

//   const s = subsTest(
//     t,
//     state,
//     {
//       collection: {
//         $any: { val: true }
//       }
//     }
//   )
//   s(
//     'initial subscription',
//     [
//       { path: 'a/a1', type: 'new' },
//       { path: 'a/a2', type: 'new' }
//     ]
//   )
//   s(
//     'update 0',
//     [
//       { type: 'remove' },
//       { type: 'remove' },
//       { path: 'b/b1', type: 'new' }
//     ],
//     {
//       collection: '$root.b'
//     }
//   )
//   t.end()
// })

// test('reference - any - over reference on field', function (t) {
//   const state = new State({
//     holder: {
//       a: {
//         a1: true,
//         a2: true
//       },
//       b: {
//         a1: true
//       },
//       collection: '$root.holder.a'
//     }
//   })

//   const s = subsTest(
//     t,
//     state,
//     {
//       holder: {
//         $remove: true,
//         collection: {
//           val: 1,
//           $any: { val: true }
//         }
//       }
//     }
//   )
//   s(
//     'initial subscription',
//     [
//       { path: 'holder/collection', type: 'new' },
//       { path: 'holder/a/a1', type: 'new' },
//       { path: 'holder/a/a2', type: 'new' }
//     ]
//   )
//   s(
//     'update 0',
//     [
//       // { path: 'holder/b/a1', type: 'update' }, // need to make this a remove
//       { path: 'holder/collection', type: 'update' },
//       { type: 'remove' },
//       { type: 'remove' },
//       { path: 'holder/b/a1', type: 'new' }
//     ],
//     {
//       holder: { collection: '$root.holder.b' }
//     }
//   )
//   t.end()
// })

// test('reference - any - target - struct', function (t) {
//   const subscription = {
//     a: {
//       $remove: true,
//       $any: {
//         $remove: true,
//         title: { val: true }
//       }
//     }
//   }
//   const b = [ { title: 1 }, { title: 2 }, { title: 3 }, { title: 4 } ]
//   const s = subsTest(t, { b: b, a: '$root.b' }, subscription)
//   s('initial subscription', multiple('new'))
//   function multiple (type, nopath) {
//     const val = []
//     for (let i = 0, len = b.length; i < len; i++) {
//       if (nopath) {
//         val.push({ type: type })
//       } else {
//         val.push({ type: type, path: 'b/' + i + '/title' })
//       }
//     }
//     return val
//   }
//   s(
//     'remove reference',
//      multiple('remove', true),
//      { a: false }
//    )
//   t.end()
// })

// test('reference - any - over reference on field using $test', function (t) {
//   const state = new State({
//     holder: {
//       a: {
//         a1: true,
//         a2: true
//       },
//       b: {
//         a1: true
//       },
//       collection: '$root.holder.a'
//     }
//   })

//   const s = subsTest(
//     t,
//     state,
//     {
//       holder: {
//         $remove: true,
//         collection: {
//           val: 1,
//           $any: {
//             // val: 1,
//             $test: {
//               exec: () => true,
//               $pass: {
//                 val: true
//               }
//             }
//           }
//         }
//       }
//     }
//   )
//   s(
//     'initial subscription',
//     [
//       { path: 'holder/collection', type: 'new' },
//       { path: 'holder/a/a1', type: 'new' },
//       { path: 'holder/a/a2', type: 'new' }
//     ]
//   )
//   s(
//     'update 0',
//     [
//       { path: 'holder/collection', type: 'update' },
//       { type: 'remove' },
//       { type: 'remove' },
//       { path: 'holder/b/a1', type: 'new' }
//     ],
//     {
//       holder: { collection: '$root.holder.b' }
//     }
//   )
//   t.end()
// })
