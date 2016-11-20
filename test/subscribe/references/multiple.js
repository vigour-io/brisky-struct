const test = require('tape')
const subsTest = require('../util')

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
        $remove: true, // bit fucked
        field1: { val: true },
        field2: { val: true },
        field3: { val: true }
      }
    }
  )

  s(
    'initial subscription',
    [
      { path: 'ref/field2', type: 'new' },
      { path: 'c/field1', type: 'new' }
    ]
  )

  // now i get the same shit thats happenig for the defualt much simnpler!
  s('switch to a', [], { ref: [ '@', 'parent', 'b' ] })

  s(
    'switch ref',
    [
      { path: 'c/field1', type: 'remove' },
      { path: 'd/field1', type: 'new' }
    ],
    { ref: [ '@', 'parent', 'd' ] }
  )

  s(
    'switch to c',
    [
      { path: 'd/field1', type: 'remove' },
      { path: 'c/field1', type: 'new' }
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
      { path: 'c/field1', type: 'remove' },
      { path: 'd/field1', type: 'new' }
    ],
    { b: [ '@', 'parent', 'd' ] }
  )

  s(
    'switch to c',
    [
      { path: 'd/field1', type: 'remove' },
      { path: 'c/field1', type: 'new' }
    ],
    { ref: [ '@', 'parent', 'c' ] }
  )

  s('switch to a', [
    { path: 'c/field1', type: 'remove' },
    { path: 'd/field1', type: 'new' }
  ], { ref: [ '@', 'parent', 'a' ] })

  s('switch to f', [
    { path: 'd/field1', type: 'remove' },
    { path: 'f/field1', type: 'new' },
    { path: 'f/field3', type: 'new' }
  ], { ref: [ '@', 'parent', 'f' ] })

  // s('switch to d', [
  //   { path: 'f/field3', type: 'remove' },
  //   { path: 'd/field1', type: 'update' }
  // ], { ref: [ '@', 'parent', 'd' ] })

  // s('switch to b', [], { ref: [ '@', 'parent', 'b' ] })

  // s('remove field2 from ref', [
  //   // has to become an update same eas everything else
  //   { path: 'ref/field2', type: 'remove' },
  //   { path: 'd/field2', type: 'new' }
  // ], { ref: { field2: null } })

  // s('add field2 to ref', [
  //   { path: 'd/field2', type: 'remove' },
  //   { path: 'ref/field2', type: 'new' }
  // ], { ref: { field2: true } })

  // s('add field3 to d', [
  //   { path: 'd/field3', type: 'new' }
  // ], { d: { field3: true } })

  // s('switch to f', [
  //   { path: 'f/field1', type: 'update' },
  //   { path: 'f/field3', type: 'update' }
  // ], { ref: [ '@', 'parent', 'f' ] })

  // s('remove field3 from f', [
  //   // has to become an update same eas everything else
  //   { path: 'f/field3', type: 'remove' },
  //   { path: 'd/field3', type: 'new' }
  // ], { f: { field3: null } })

  // s('add field3 to f', [
  //   { path: 'd/field3', type: 'remove' },
  //   { path: 'f/field3', type: 'new' }
  // ], { f: { field3: true } })

  t.end()
})

test('subscription - reference - multiple', t => {
  const s = subsTest(
    t,
    {
      a: [ '@', 'parent', 'b' ],
      b: [ '@', 'parent', 'c' ],
      c: {
        val: [ '@', 'parent', 'd' ],
        x: 'from c'
      },
      d: {
        x: 'lullz'
      },
      x: [ '@', 'parent', 'a' ],
      ref: {
        val: [ '@', 'parent', 'a' ]
      }
    },
    {
      ref: {
        $remove: true, // bit fucked
        x: { val: true }
      }
    }
  )

  s(
    'initial subscription',
    [
      { path: 'c/x', type: 'new' }
    ]
  )
  s(
    'switch ref',
    [],
    { ref: [ '@', 'parent', 'x' ] }
  )

  t.end()
})
