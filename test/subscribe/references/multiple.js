import test from 'tape'
import subsTest from '../util'

test('subscription - reference - multiple', t => {
  const s = subsTest(
    t,
    {
      a: [ '@', 'parent', 'b' ],
      b: [ '@', 'parent', 'c' ],
      c: { field1: true, field2: true },
      d: { field1: true, field2: 'x' },
      e: {
        val: [ '@', 'parent', 'a' ],
        field3: true
      },
      f: {
        val: [ '@', 'parent', 'd' ],
        field1: true,
        field2: true,
        field3: true
      },
      ref: {
        val: [ '@', 'parent', 'a' ],
        field2: true
      }
    },
    {
      ref: {
        field1: { val: true },
        field2: { val: true },
        field3: { val: true }
      }
    }
  )

  s(
    'initial subscription',
    [
      { path: 'c/field1', type: 'new' },
      { path: 'ref/field2', type: 'new' }
    ]
  )

  // now i get the same shit thats happenig for the defualt much simnpler!
  s('switch to a', [], { ref: [ '@', 'parent', 'b' ] })

  s(
    'switch ref',
    [
      { path: 'd/field1', type: 'update' }
    ],
    { ref: [ '@', 'parent', 'd' ] }
  )

  s(
    'switch to c',
    [
      { path: 'c/field1', type: 'update' }
    ],
    { ref: [ '@', 'parent', 'c' ] }
  )

  s('switch to a', [], { ref: [ '@', 'parent', 'a' ] })

  s(
    'switch to e',
    [ { path: 'e/field3', type: 'new' } ],
    { ref: [ '@', 'parent', 'e' ] }
  )

  s(
    'switch to a',
    [ { path: 'e/field3', type: 'remove' } ],
    { ref: [ '@', 'parent', 'a' ] }
  )

  s('switch to b', [], { ref: [ '@', 'parent', 'b' ] })

  s(
    'switch nested refrence',
    [
      { path: 'd/field1', type: 'update' }
    ],
    { b: [ '@', 'parent', 'd' ] }
  )

  s(
    'switch to c',
    [
      { path: 'c/field1', type: 'update' }
    ],
    { ref: [ '@', 'parent', 'c' ] }
  )

  s('switch to a', [
    { path: 'd/field1', type: 'update' }
  ], { ref: [ '@', 'parent', 'a' ] })

  s('switch to f', [
    { path: 'f/field1', type: 'update' },
    { path: 'f/field3', type: 'new' }
  ], { ref: [ '@', 'parent', 'f' ] })

  s('switch to d', [
    { path: 'd/field1', type: 'update' },
    { path: 'f/field3', type: 'remove' }
  ], { ref: [ '@', 'parent', 'd' ] })

  s('switch to b', [], { ref: [ '@', 'parent', 'b' ] })

  s('remove field2 from ref', [
    { path: 'd/field2', type: 'update' }
  ], { ref: { field2: null } })

  s('add field2 to ref', [
    { path: 'ref/field2', type: 'update' }
  ], { ref: { field2: true } })

  s('add field3 to d', [
    { path: 'd/field3', type: 'new' }
  ], { d: { field3: true } })

  s('switch to f', [
    { path: 'f/field1', type: 'update' },
    { path: 'f/field3', type: 'update' }
  ], { ref: [ '@', 'parent', 'f' ] })

  s('remove field3 from f', [
    { path: 'd/field3', type: 'update' }
  ], { f: { field3: null } })

  s('add field3 to f', [
    { path: 'f/field3', type: 'update' }
  ], { f: { field3: true } })

  t.end()
})

test('subscription - reference - multiple - non origin', t => {
  const s = subsTest(
    t,
    {
      a: { val: [ '@', 'parent', 'b' ], y: true },
      b: [ '@', 'parent', 'c' ],
      c: {
        val: [ '@', 'parent', 'd' ],
        x: 'from c'
      },
      d: {
        x: 'lullz',
        y: 'haha'
      },
      x: [ '@', 'parent', 'a' ],
      ref: {
        val: [ '@', 'parent', 'a' ]
      }
    },
    {
      ref: {
        x: { val: true },
        y: { val: true }
      }
    }
  )

  s(
    'initial subscription',
    [
      { path: 'c/x', type: 'new' },
      { path: 'a/y', type: 'new' }
    ]
  )
  s(
    'switch ref',
    [],
    { ref: [ '@', 'parent', 'x' ] }
  )

  s(
    'add ref on a',
    [
      { path: 'a/x', type: 'update' }
    ],
    { a: { x: true } }
  )

  s(
    'remove ref on a',
    [
      { path: 'c/x', type: 'update' }
    ],
    { a: { x: null } }
  )

  s(
    'switch ref to b',
    [
      { path: 'd/y', type: 'update' }
    ],
    { ref: [ '@', 'parent', 'b' ] }
  )

  s(
    'switch ref to primtive',
    [
      { path: 'c/x', type: 'remove' },
      { path: 'd/y', type: 'remove' }
    ],
    { ref: false }
  )

  t.end()
})

test('subscription - reference - multiple - nested (dont fire)', t => {
  const s = subsTest(
    t,
    {
      end: { x: true },
      allmost: [ '@', 'root', 'end' ],
      a: [ '@', 'root', 'end' ],
      c: 'c',
      z: [ '@', 'root', 'a' ],
      b: { ref: [ '@', 'root', 'a' ] },
      y: { ref: [ '@', 'root', 'end' ] },
      x: [ '@', 'root', 'b' ]
    },
    { x: { ref: { x: { val: true } } } } // this will not fire ofc
  )

  s(
    'initial subscription',
    [{ path: 'end/x', type: 'new' }]
  )

  s(
    'switch ref b to z',
    [],
    { b: { ref: [ '@', 'root', 'z' ] } }
  )

  s(
    'switch ref x to b',
    [],
    { x: [ '@', 'root', 'b' ] }
  )

  s(
    'switch ref a to allmost',
    [],
    { a: [ '@', 'root', 'allmost' ] }
  )

  s(
    'switch x a to y',
    [],
    { x: [ '@', 'root', 'y' ] }
  )

  t.end()
})
