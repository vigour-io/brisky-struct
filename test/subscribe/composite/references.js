const test = require('tape')
const subsTest = require('../util')
test('subscription - composite - root - references', t => {
  const subscription = {
    a: {
      b: {
        root: {
          b: {
            d: { val: true }
          }
        }
      }
    }
  }

  const state = {
    a: [ '@', 'root', 'e' ],
    b: [ '@', 'root', 'c' ],
    c: { d: 'c.d' },
    d: { d: 'd.d' },
    e: { b: {} },
    dirt: { b: {} },
    f: [ '@', 'root', 'e' ]
  }

  const s = subsTest(t, state, subscription)

  s('initial subscription', [{ path: 'c/d', type: 'new' }])

  s(
    'switch reference on b',
    [
      { path: 'd/d', type: 'update' }
    ],
    { b: [ '@', 'root', 'd' ] }
  )

  s(
    'remove reference on b',
    [{ path: 'd/d', type: 'remove' }],
    { b: 'no more ref!' }
  )

  s(
    'switch b to c',
    [{ path: 'c/d', type: 'new' }],
    { b: [ '@', 'root', 'c' ] }
  )

  s(
    'switch a to f',
    [],
    { a: [ '@', 'root', 'f' ] }
  )

  s(
    'switch a to dirt',
    [],
    { a: [ '@', 'root', 'dirt' ] }
  )

  t.end()
})
