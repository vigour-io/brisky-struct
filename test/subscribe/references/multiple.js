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

  s('switch to a', [], { ref: [ '@', 'parent', 'b' ] })

  s(
    'switch ref',
    [ { path: 'd/field1', type: 'update' } ],
    { ref: [ '@', 'parent', 'd' ] }
  )

  s(
    'switch to c',
    [ { path: 'c/field1', type: 'update' } ],
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
    [ { path: 'd/field1', type: 'update' } ],
    { b: [ '@', 'parent', 'd' ] }
  )

  console.log(' \nHERE')
  s(
    'switch to c',
    [ { path: 'c/field1', type: 'update' } ],
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
    { path: 'f/field3', type: 'remove' },
    { path: 'd/field1', type: 'update' }
  ], { ref: [ '@', 'parent', 'd' ] })

  s('switch to b', [], { ref: [ '@', 'parent', 'b' ] })

  s('remove field2 from ref', [
    // has to become an update same eas everything else
    { path: 'ref/field2', type: 'remove' },
    { path: 'd/field2', type: 'new' }
  ], { ref: { field2: null } })

  s('add field2 to ref', [
    { path: 'ref/field2', type: 'new' },
    { path: 'd/field2', type: 'remove' }
  ], { ref: { field2: true } })

  t.end()
})
