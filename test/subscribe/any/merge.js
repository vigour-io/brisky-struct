'use strict'
const test = require('tape')
const subsTest = require('../util')

test('subscription - any - merge', t => {
  const s = subsTest(
    t,
    {
      a: { x: true, val: [ '@', 'parent', 'b' ] },
      b: { y: true, val: [ '@', 'parent', 'c' ] },
      c: { x: true, y: true, z: true },
      collection: [ '@', 'parent', 'a' ]
    },
    {
      collection: {
        $any: { val: true }
      }
    }
  )

  const r = s(
    'initial subscription',
    [
      { path: 'a/x', type: 'new' },
      { path: 'b/y', type: 'new' },
      { path: 'c/z', type: 'new' }
    ]
  )

  console.log(r.tree)
  s(
    'change reference to b',
    [
      { path: 'c/x', type: 'update' }
    ],
    { collection: [ '@', 'parent', 'b' ] }
  )

  console.log(r.state.collection.get('x').path())
  console.log(r.state.collection.get('y').path())
  console.log(r.state.collection.get('z').path())

  // s(
  //   'change reference to c',
  //   [
  //    { path: 'c/y', type: 'update' }
  //   ],
  //   { collection: [ '@', 'parent', 'c' ] }
  // )

  // s(
  //   'change reference to a',
  //   [
  //    { path: 'c/x', type: 'remove' },
  //    { path: 'c/y', type: 'remove' },
  //    { path: 'a/x', type: 'new' },
  //    { path: 'b/y', type: 'new' }
  //   ],
  //   { collection: [ '@', 'parent', 'a' ] }
  // )

  // s(
  //   'change reference to primitive',
  //   [
  //    { path: 'a/x', type: 'remove' },
  //    { path: 'b/y', type: 'remove' },
  //    { path: 'c/z', type: 'remove' }
  //   ],
  //   { collection: false }
  // )

  t.end()
})
