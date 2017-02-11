const test = require('tape')
const { create: struct } = require('../')
const bs = require('brisky-stamp')

test('set - stamp', t => {
  const a = struct()
  a.set({
    a: {
      b: {
        c: {
          val: 'hello',
          stamp: 100
        }
      }
    }
  }, 'ha-100')
  t.equal(a.a.b.c.stamp, 100, 'use stamp set in val object')
  t.equal(a.a.b.c.tStamp, 'ha-100', 'tStamp is ha-100')
  t.end()
})

test('set - composed stamp', t => {
  const a = struct()
  a.set({
    a: {
      b: {
        c: {
          val: 'hello',
          stamp: bs.create(100)
        }
      }
    }
  }, bs.create(2, 2, 'hello'))
  t.same(a.a.b.c.stamp, bs.create(100), 'use stamp set in val object')
  t.same(a.a.b.c.tStamp, bs.create(2), 'tStamp is hello-100')
  t.end()
})

test('set - composed stamp instances', t => {
  const a = struct()
  const b = a.create()
  const c = b.create() //eslint-disable-line
  const stamp = bs.create(100)
  a.set({
    val: 'hello',
    stamp
  }, bs.create(2, 2, 'hello'))
  t.same(a.stamp, stamp, 'a stamp is hello-100')
  t.same(b.stamp, stamp, 'b stamp is hello-100')
  t.same(c.stamp, stamp, 'c stamp is hello-100')
  a.set({
    val: 'hello',
    stamp: bs.create(100)
  }, bs.create(2))
  const stamp2 = bs.create(3)
  a.set({
    val: 'hello',
    a: { val: 'a', stamp },
    b: { val: 'b', stamp }
  }, stamp2)
  t.same(a.a.stamp, stamp, 'a.a stamp is hello-100')
  t.same(a.b.stamp, stamp, 'a.b stamp is hello-100')
  t.same(a.tStamp, stamp2, 'a tStamp is y-3')
  t.same(b.tStamp, stamp2, 'b tStamp is y-3')
  t.same(c.tStamp, stamp2, 'c tStamp is y-3')

  const stamp3 = bs.create(3)
  const stamp4 = bs.create(4)
  a.set({
    val: 'hello',
    a: 'a',
    c: 'c',
    d: 'd',
    stamp: stamp3
  }, stamp4)

  t.same(a.tStamp, stamp4, 'a tStamp is 4')
  t.same(a.stamp, stamp3, 'a stamp is 3')
  t.same(a.c.stamp, stamp4, 'a.c stamp is 4')
  t.same(c.tStamp, stamp4, 'c tStamp is 4')
  t.same(c.stamp, stamp3, 'c stamp is 3')
  t.end()
})

test('set - stamp - remove', t => {
  var results = []
  const a = struct({
    a: {
      b: {
        c: {
          val: 'ha!',
          on: (val, stamp, t) => {
            results.push(val, stamp)
          }
        }
      }
    }
  })
  a.set({
    a: {
      b: {
        c: {
          val: null,
          stamp: 100
        }
      }
    }
  }, false)

  const b = a.a.b

  a.set({
    a: {
      b: {
        val: null,
        stamp: bs.create('keepit100')
      }
    }
  }, 'hello')

  t.same(b.stamp, bs.create('keepit100'))
  t.equal(a.a.b, null, 'removed a.a.b')
  a.set({ a: { b: { stamp: bs.create('X') } } }, false)
  t.same(a.tStamp, bs.create('X'), 'correct travel stamp')
  t.end()
})
