const test = require('tape')
const { create: struct } = require('../')

test('types ', t => {
  const a = struct({
    key: 'a',
    types: {
      something: {
        field: 'real'
      },
      bla: { somehting: 'wrong' }
    },
    field: { type: 'something' }
  })

  const b = a.create({
    types: {
      something: {
        type: 'something',
        bla: true
      },
      bla: 'override!'
    },
    x: { type: 'something' },
    y: { type: 'bla' }
  })

  t.same(b.get('x').keys(), [ 'field', 'bla' ], 'merged "something" type')
  t.same(b.get('y').keys(), [], 'override "bla" type')
  t.equal(b.get('y').compute(), 'override!', 'type with string')
  t.same(a.get('field').keys(), [ 'field' ], '"field" on a has "field"')
  const c = struct({
    types: { a: true },
    a: {
      b: {
        c: true
      }
    }
  })
  const c2 = c.create({ a: { type: 'a', reset: true } })
  t.same(c2.get('a').keys(), [], 'override inheritance')
  t.end()
})

test('types - simple ', t => {
  const a = struct({
    key: 'a',
    types: {
      a: 'self'
    },
    define: {
      haha: true
    },
    bla: { type: 'a' }
  })
  t.equal(a.bla.inherits, a, 'use self in types')
  t.end()
})

test('types - switch - keys', t => {
  const a = struct({
    key: 'a',
    types: {
      gurky: {
        hello: true
      },
      b: {
        XXXXXXXX: true,
        YYYYYYYY: true
      },
      a: {
        props: {
          default: { b: {} }
        },
        a: true
      }
    },
    bla: {
      type: 'a',
      hello: {},
      gurky: { type: 'gurky' },
      val: 'smurt'
    }
  })

  const a1 = a.bla.create()
  const a2 = a.bla.create({ MYOWN: true })
  const a3 = a.bla.create({ hello: null })
  const a32 = a3.create({ HA: true })
  const fieldInstance = a.bla.hello.create()

  a.bla.set({ type: 'b' })

  t.same(a.bla.keys(), [ 'XXXXXXXX', 'YYYYYYYY', 'hello', 'gurky' ], 'correct keys on "a.bla"')
  t.same(a1.keys(), [ 'XXXXXXXX', 'YYYYYYYY', 'hello', 'gurky' ], 'correct keys on "a1"')
  t.same(a2.keys(), [ 'XXXXXXXX', 'YYYYYYYY', 'hello', 'gurky', 'MYOWN' ], 'correct keys on "a2"')
  t.same(a3.keys(), [ 'XXXXXXXX', 'YYYYYYYY', 'gurky' ], 'correct keys on "a3"')
  t.same(a32.keys(), [ 'XXXXXXXX', 'YYYYYYYY', 'gurky', 'HA' ], 'correct keys on "a3-2"')
  t.same(fieldInstance.keys(), [], 'correct keys on "fieldInstance"')

  a.bla.set({ type: 'a', reset: true })
  t.same(a.bla.keys(), [ 'a' ], 'correct keys on "a.bla"') // need to update instances
  t.same(a1.keys(), [ 'a' ], 'correct keys on "a1"')
  t.same(a2.keys(), [ 'a', 'MYOWN' ], 'correct keys on "a2"')
  t.same(a3.keys(), [ 'a' ], 'correct keys on "a3"')
  t.same(a32.keys(), [ 'a', 'HA' ], 'correct keys on "a3-2"')

  t.end()
})

test('types - switch - subscriptions', t => {
  var cnt = 0
  const a = struct({
    key: 'a',
    types: {
      gurky: {
        hello: true
      },
      b: {
        XXXXXXXX: true,
        YYYYYYYY: true
      },
      a: {
        props: {
          default: { b: {} }
        },
        a: true
      }
    },
    bla: {
      type: 'a',
      hello: {},
      gurky: { type: 'gurky' },
      val: 'smurt'
    }
  })
  a.subscribe({ bla: { hello: true } }, () => { cnt++ })
  cnt = 0
  a.bla.set({ type: 'b' })
  t.equal(cnt, 1, 'fires subscription on type change')
  t.end()
})

test('types - switch - creation / context', t => {
  const x = struct({ hello: true })
  const b = struct({
    types: { what: { a: true } },
    props: { x: x },
    x: { type: 'what' }
  })
  t.same(b.x.keys(), [ 'a' ], 'correct keys on "b.x" removes inherited')
  const b2 = struct({
    types: { what: { a: true } },
    props: { x: x },
    x: { bla: true }
  })
  const b3 = b2.create({ x: { type: 'what' } })
  t.same(b3.x.keys(), [ 'a', 'bla' ], 'correct keys on "b.x" removes inherited')
  t.end()
})

test('types - subscription', t => {
  const results = []
  const a = struct({ types: { what: { a: true } } })
  a.subscribe({ types: { $any: true } }, t => {
    results.push(t.path())
  })
  a.types.set({ rick: { fun: true } })
  t.same(results, [ [ 'types', 'what' ], [ 'types', 'rick' ] ])
  t.end()
})

test('types - non existing', t => {
  const a = struct({ bla: { type: 'james' } })
  t.same(a.types.keys(), [ 'james' ])
  t.end()
})

test('types - merge and listeners', t => {
  var cnt = 0
  const a = struct({
    types: {
      derp: {
        on: { data: { bla: () => cnt++, blurf: () => cnt++ } }
      },
      x: { hello: true }
    },
    bla: { type: 'derp', on: { data: { gur: () => cnt++, blurf: null } } }
  })
  cnt = 0
  a.set({ bla: { type: 'x' } })
  t.equal(cnt, 1, 'listeners fire when merging type')
  cnt = 0
  a.bla.set('hello')
  t.equal(cnt, 1, 'listeners fire when merging type')
  t.end()
})

test('types - listeners on types', t => {
  var cnt = 0
  const a = struct({ types: {} })
  a.types.on(() => { cnt++ })
  a.set({ types: { hello: true } })
  t.equal(cnt, 1, 'fires correct amount of listeners')
  t.end()
})
