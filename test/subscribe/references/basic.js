const test = require('tape')
const subsTest = require('../util')

test('subscription - references', t => {
  const s = subsTest(
    t,
    {
      field: {
        a: { val: true, nest: true },
        b: true
      },
      other: {
        a: {
          val: true,
          nest: true,
          field: true
        },
        b: true
      },
      ref: {
        val: [ '@', 'parent', 'field' ],
        b: true
      }
    },
    {
      ref: {
        $remove: true,
        a: {
          $remove: true,
          nest: { val: true },
          field: { val: true } // deeper should not fire
        },
        b: { val: true }
      }
    },
    true
  )

  s(
    'initial subscription',
    [
      { path: 'ref/b', type: 'new' },
      { path: 'field/a/nest', type: 'new' }
    ]
  )

  s(
    'switch reference',
    [
      { path: 'other/a/nest', type: 'update' },
      { path: 'other/a/field', type: 'new' }
    ],
    { ref: [ '@', 'parent', 'other' ] }
  )

  s(
    'remove reference',
    [
      { path: 'other/a/nest', type: 'remove' },
      { path: 'other/a/field', type: 'remove' }
    ],
    { other: null }
  )

  t.end()
})

test('subscription - reference - double', t => {
  const s = subsTest(
    t,
    {
      a: 'a',
      c: 'c',
      b: { ref: [ '@', 'root', 'a' ] }
    },
    { b: { ref: { val: true } } } // this will not fire ofc
  )

  s(
    'initial subscription',
    [{ path: 'b/ref', type: 'new' }]
  )

  s(
    'referenced field origin',
    [{ path: 'b/ref', type: 'update' }],
    { a: 'a-update' }
  )

  s(
    'change reference',
    [{ path: 'b/ref', type: 'update' }], // no listener since val:1
    { b: { ref: [ '@', 'root', 'c' ] } }
  )

  s(
    'change to primitve',
    [{ path: 'b/ref', type: 'update' }],  // no listener since val:1
    { b: { ref: 'hello' } }
  )

  s(
    'change to primitve again',
    [{ path: 'b/ref', type: 'update' }],
    { b: { ref: 'bye' } }
  )

  t.end()
})

test('subscription - reference - nested', t => {
  const s = subsTest(
    t,
    {
      a: { b: { c: 'its a.b.c!' } },
      b: { b: { x: 'its b.b.x!' } },
      c: { b: { c: 'its c.b.c!' } },
      ref: [ '@', 'parent', 'a' ]
    },
    {
      ref: {
        $remove: true,
        b: {
          $remove: true,
          c: { val: true },
          x: { val: true }
        }
      }
    }
  )

  s(
    'initial subscription',
    [
      { path: 'a/b/c', type: 'new' }
    ]
  )

  s(
    'switch reference',
    [
      { path: 'c/b/c', type: 'update' }
    ],
    { ref: [ '@', 'parent', 'c' ] }
  )

  console.log('go go go')
  s(
    'switch reference to excluding fields',
    [
      { path: 'c/b/c', type: 'remove' },
      { path: 'b/b/x', type: 'new' }
    ],
    { ref: [ '@', 'parent', 'b' ] }
  )

  // also i would expect this to fire for b and c: { val: true }
  // s(
  //   'remove reference',
  //   [
  //     { type: 'remove' } // maybe a path ? :X
  //   ],
  //   { ref: false }
  // )
  t.end()
})
