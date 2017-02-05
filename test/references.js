const test = require('tape')
const { create: struct, uid } = require('../')

test('references - listeners', t => {
  const a = struct({ $transform: val => val * 5 })
  const b = struct({ val: a, $transform: val => val * 5 })
  var results = []
  const c = struct({
    key: 'c',
    val: b,
    on: {
      data: {
        result: (val, stamp, t) => {
          results.push(t.path())
        }
      }
    }
  })
  const a2 = a.create() //eslint-disable-line
  const c2 = c.create({ key: 'c2' })
  a.set(1, 'stamp-1')

  t.same(b._uid, uid(b), 'a has uid')

  t.same(
    results, [ [ 'c' ], [ 'c2' ] ],
    'fires for "c" and "c2" (does not fire for "a" instance)'
  )

  t.equal(c.compute(), 25, 'compute processes transforms in the reference chain')

  const d = struct({
    key: 'd',
    val: c2,
    on: {
      data: {
        result: (val, stamp, t) => {
          results.push(t.path())
        }
      }
    }
  })

  t.equal(d.origin(), c2, 'correct origin for "d"')

  const d2 = d.create({ //eslint-disable-line
    key: 'd2',
    val: 'clear!'
  })

  const e = struct({
    x: {
      y: {
        props: {
          default: d
        },
        z: {}
      }
    }
  })

  const e2 = e.create({ key: 'e2' }) //eslint-disable-line

  results = []
  a.set(2)
  t.same(results, [
      [ 'c' ],
      [ 'c2' ],
      [ 'd' ],
      [ 'e2', 'x', 'y', 'z' ],
      [ 'x', 'y', 'z' ]
  ], 'fires only for c (does not fire for a instance)')

  results = []
  a.emit('data', [ 10 ])

  t.same(results, [
      [ 'c' ],
      [ 'c2' ],
      [ 'd' ],
      [ 'e2', 'x', 'y', 'z' ],
      [ 'x', 'y', 'z' ]
  ], 'fires from a data emit')
  t.end()
})

test('references - serialized', t => {
  const a = struct({
    hello: true,
    bye: [ '@', 'root', 'hello' ],
    greeting: {
      val: [ '@', 'dutch' ],
      dutch: 'goede morgen'
    },
    vocabulary: [ '@', 'parent', 'greeting' ]
  })
  t.equal(a.bye.val, a.hello, 'create reference to root')
  t.equal(a.greeting.val, a.greeting.dutch, 'create reference to self')
  t.equal(a.vocabulary.val, a.greeting, 'create reference to parent')
  const b = struct({
    bla: {
      on: {
        data: {
          x () {
            t.pass('fires listener when making a new reference')
            t.end()
          }
        }
      }
    }
  })
  b.set({ x: [ '@', 'parent', 'bla', 'newthing' ] })
})

test('references - override & remove', t => {
  const a = struct('a')
  const b = struct({ val: 'b', on: { error () {} } })
  const c = struct(a)
  c.set(b)
  t.same(a.emitters.data.struct, [], 'removed struct listener from "a"')
  t.same(b.emitters.data.struct, [ c ], 'added struct listener on "b"')
  c.set(null)
  t.same(b.emitters.data.struct, [], 'removed struct listener from "b"')
  const a2 = struct('a')
  const c2 = struct(a2)
  a2.set(null)
  t.same(c2.val, null, 'set .val on null references')
  t.end()
})

test('references - normal object for val', t => {
  const val = { hello: true }
  const a = struct({ val })
  const b = struct(a)
  const c = struct(() => 'lulz')
  t.equal(b.compute(), val, 'returns normal object')
  a.set(c)
  t.equal(b.compute(), 'lulz', 'function support')
  t.end()
})

test('references - get', t => {
  var cnt = 0
  const state = struct({
    holder: {
      fields: {
        thing: 1
      },
      fields2: {
        thing: 2
      },
      current: {
        val: [ '@', 'root', 'holder', 'fields' ],
        on: () => {
          cnt++
        }
      }
    }
  })
  t.ok(
    state.holder.current.val === state.holder.fields,
    'making a reference using root in a nested field'
  )
  t.ok(
    state.holder.current.val._p === state.holder,
    'ref holder is state.holder'
  )
  state.holder.current.set([ '@', 'root', 'holder', 'fields' ])
  t.equal(cnt, 0, 'did not fire')
  t.end()
})

test('references - remove referenced & gaurds', t => {
  const a = struct({
    a: {
      b: false
    }
  })
  a.a.b.set(a.a)
  a.a.b.on(() => {})
  a.a.on(() => {})
  a.a.b.set(null)
  t.same(a.a.emitters.data.struct, [])
  a.a.set({
    emitters: { data: { blurf: null } }
  })
  t.same(a.a.emitters.data.struct, [])
  t.end()
})

test('references - switch using get notations', t => {
  const state = struct({})
  state.set([
    { page: { val: [ '@', 'root', 'pages', 'b' ] } },
    { page: { val: [ '@', 'root', 'pages', 'a' ] } }
  ][Symbol.iterator]())
  // why does this not work -- async needs to get rid of timout
  setTimeout(() => {
    t.same(state.pages.b.emitters.data.struct, [], 'empty struct on b')
    t.same(state.pages.a.emitters.data.struct, [ state.page ], 'page on a')
    t.end()
  })
})
