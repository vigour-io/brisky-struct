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
    x: {
      type: 'something'
    },
    y: { type: 'bla' }
  })
  t.same(b.get('x').keys(), [ 'field', 'bla' ], 'merged "something" type')
  t.same(b.get('y').keys(), [], 'override "bla" type')
  t.equal(b.get('y').compute(), 'override!', 'type with string')
  t.same(a.get('field').keys(), [ 'field' ], '"field" on a has "field"')
  const c = struct({
    types: {
      a: true
    },
    a: {
      b: {
        c: true
      }
    }
  })
  const c2 = c.create({ a: { type: 'a' } })
  t.same(c2.get('a').keys(), [], 'override inheritance')
  t.end()
})

test('types ', t => {
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

test('switch types - keys', t => {
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

  t.same(a1.keys(), [ 'XXXXXXXX', 'YYYYYYYY', 'hello', 'gurky' ], 'correct keys on "a1"')
  t.same(a2.keys(), [ 'XXXXXXXX', 'YYYYYYYY', 'hello', 'gurky', 'MYOWN' ], 'correct keys on "a2"')
  t.same(a3.keys(), [ 'XXXXXXXX', 'YYYYYYYY', 'gurky' ], 'correct keys on "a3"')
  t.same(a32.keys(), [ 'XXXXXXXX', 'YYYYYYYY', 'gurky', 'HA' ], 'correct keys on "a3-2"')
  t.same(fieldInstance.keys(), [], 'correct keys on "fieldInstance"')

  t.end()
})

test('switch types - subscriptions', t => {
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
