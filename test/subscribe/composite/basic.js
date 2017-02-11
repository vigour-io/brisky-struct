const test = require('tape')
const subsTest = require('../util')
const { create: struct } = require('../../../')

test('subscription - composite - root', t => {
  const subs = {
    a: {
      b: {
        c: {

          root: {

            b: { val: true, _: 'random information' }
          }
        }
      }
    }
  }
  const s = subsTest(t, struct({ a: { b: { c: {} } }, b: 'lullz' }, false), subs)
  const r = s('initial subscription', [ { path: 'b', type: 'new' } ])

  s('create b', [ { path: 'b', type: 'update' } ], { b: 'hello b!' })

  s('update b', [ { path: 'b', type: 'update' } ], { b: 'hello b2!' })

  s('remove b', [ { path: 'b', type: 'remove' } ], { b: null })

  s('create b (again)', [ { path: 'b', type: 'new' } ], { b: 'hello b!' })

  s('remove a/b/c', [ { path: 'b', type: 'remove' } ], { a: { b: { c: null } } })

  t.equal(r.state.a.$c, void 0, 'removed a/$c')
  t.equal(r.state.a.b.$c, void 0, 'removed a/b/$c')

  t.end()
})

test('subscription - composite - root - nested', t => {
  const subs = {
    a: {
      root: { b: { c: { d: { val: true } } } }
    }
  }
  const s = subsTest(t, { a: true }, subs)
  s(
    'set b/c/d',
    [ { path: 'b/c/d', type: 'new' } ],
    { b: { c: { d: 'its d!' } } }
  )
  t.end()
})

test('subscription - composite - root - double', t => {
  const subs = {
    a: {
      root: {
        b: {
          c: {
            root: { c: { val: true } }
          }
        }
      }
    }
  }
  const s = subsTest(t, { a: true }, subs)
  s(
    'set c',
    [ { path: 'c', type: 'new' } ],
    { b: { c: {} }, c: 'hello c!' }
  )
  t.end()
})

test('subscription - composite - root - multiple', t => {
  const subs = {
    a: {
      root: {
        c: { val: true },
        b: { val: true }
      }
    }
  }
  const s = subsTest(t, { a: true }, subs)
  s('initial subscription', [])
  s('set b', [ { path: 'b', type: 'new' } ], { b: 'hello b!' })
  s('set c', [ { path: 'c', type: 'new' } ], { c: 'hello c!' })
  s('update c', [ { path: 'c', type: 'update' } ], { c: 'hello c2!' })
  s('remove c', [ { path: 'c', type: 'remove' } ], { c: null })
  t.end()
})

test('subscription - composite - root - remove combined with normal', t => {
  const subs = {
    b: { val: true },
    a: { root: { b: { val: true } } }
  }
  const s = subsTest(t, { b: true, a: true }, subs)
  s('remove b', [
    { path: 'b', type: 'remove' },
    { path: 'b', type: 'remove' }
  ], { b: null })
  t.end()
})

test('subscription - composite - root - property', t => {
  const subs = {
    b: { val: 1 },
    a: {
      root: { b: { val: 1 } }
    }
  }
  const s = subsTest(t, {}, subs)
  s('create b', [ { path: 'b', type: 'new' } ], { b: true })
  s('create a', [ { path: 'b', type: 'new' } ], { a: true })
  s('update b', [], { b: 'update!' })
  s('remove b', [
    { path: 'b', type: 'remove' },
    { path: 'b', type: 'remove' }
  ], { b: null })
  t.end()
})
