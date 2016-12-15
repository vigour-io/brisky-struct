'use strict'
import test from 'tape'
import subsTest from '../util'

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

  s(
    'initial subscription',
    [
      { path: 'a/x', type: 'new' },
      { path: 'b/y', type: 'new' },
      { path: 'c/z', type: 'new' }
    ]
  )

  s(
    'change reference to b',
    [
      { path: 'b/y', type: 'update' },
      { path: 'c/x', type: 'update' }
    ],
    { collection: [ '@', 'parent', 'b' ] }
  )

  s(
    'change reference to c',
    [
     { path: 'c/x', type: 'update' },
     { path: 'c/y', type: 'update' }
    ],
    { collection: [ '@', 'parent', 'c' ] }
  )

  s(
    'change reference to a',
    [
     { path: 'a/x', type: 'update' },
     { path: 'b/y', type: 'update' }
    ],
    { collection: [ '@', 'parent', 'a' ] }
  )

  s(
    'change reference to primitive',
    [
     { path: 'a/x', type: 'remove' },
     { path: 'b/y', type: 'remove' },
     { path: 'c/z', type: 'remove' }
    ],
    { collection: false }
  )

  t.end()
})
