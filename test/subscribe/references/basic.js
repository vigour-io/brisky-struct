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
    }
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
      { path: 'field/a/nest', type: 'remove' },
      { path: 'other/a/nest', type: 'new' },
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

test('subscription - reference - switch', t => {
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
      b: { b: { field: true, x: { val: 'its b.b.x!', bla: true } } },
      c: { b: { c: 'its c.b.c!' } },
      d: { b: { x: 'hahaha' } },
      ref: [ '@', 'parent', 'a' ]
    },
    {
      ref: {
        $remove: true,
        b: {
          $remove: true,
          c: { val: true },
          x: { val: true, bla: { val: true } }
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
      { path: 'a/b/c', type: 'remove' },
      { path: 'c/b/c', type: 'new' }
    ],
    { ref: [ '@', 'parent', 'c' ] }
  )

  s(
    'switch reference to excluding fields',
    [
      { path: 'c/b/c', type: 'remove' },
      { path: 'b/b/x', type: 'new' },
      { path: 'b/b/x/bla', type: 'new' }
    ],
    { ref: [ '@', 'parent', 'b' ] }
  )

  s(
    'switch reference to excluding deep fields',
    [
      { path: 'b/b/x', type: 'remove' },
      { path: 'b/b/x/bla', type: 'remove' },
      { path: 'd/b/x', type: 'new' }
    ],
    { ref: [ '@', 'parent', 'd' ] }
  )

  s(
    'remove reference',
    [
      { path: 'd/b/x', type: 'remove' }
    ],
    { ref: false }
  )

  t.end()
})

test('subscription - reference - nested remove', t => {
  const s = subsTest(
    t,
    {
      a: { x: true },
      c: 'c',
      b: { ref: [ '@', 'root', 'a' ] }
    },
    { b: { ref: { x: { val: true } } } } // this will not fire ofc
  )

  s(
    'initial subscription',
    [{ path: 'a/x', type: 'new' }]
  )

  s(
    'remove ref',
    [{ path: 'a/x', type: 'remove' }],
    { b: { ref: null } }
  )

  t.end()
})
