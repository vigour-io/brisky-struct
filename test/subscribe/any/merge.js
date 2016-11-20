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
    },
    true
  )
  s(
    'initial subscription',
    [
      { path: 'a/x', type: 'new' },
      { path: 'b/y', type: 'new' },
      { path: 'c/z', type: 'new' }
    ]
  )

  /*
    { path: 'a/x', type: 'remove' },
    { path: 'b/y', type: 'remove' },
    { path: 'c/z', type: 'remove' },
    { path: 'b/y', type: 'new' },
    { path: 'c/x', type: 'new' },
    { path: 'c/z', type: 'new' }
  */

  s(
    'change reference to b',
    [
     { path: 'a/x', type: 'remove' }, { path: 'c/x', type: 'new' }
    ],
    { collection: [ '@', 'parent', 'b' ] }
  )

  s(
    'change reference to c',
    [
     { path: 'b/y', type: 'remove' },
     { path: 'c/y', type: 'new' }
    ],
    { collection: [ '@', 'parent', 'c' ] }
  )

  s(
    'change reference to a',
    [
     { path: 'c/x', type: 'remove' },
     { path: 'c/y', type: 'remove' },
     { path: 'a/x', type: 'new' },
     { path: 'b/y', type: 'new' }
    ],
    { collection: [ '@', 'parent', 'a' ] }
  )

  t.end()
})
