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
          stamp: bs.create(100, 100, 'hello')
        }
      }
    }
  }, bs.create(2, 2, 'hello'))
  t.same(a.a.b.c.stamp, bs.create(100, 100, 'hello'), 'use stamp set in val object')
  t.same(a.a.b.c.tStamp, bs.create(2, 2, 'hello'), 'tStamp is hello-100')
  t.end()
})

test('set - composed stamp instances', t => {
  const a = struct()
  const b = a.create()
  const c = b.create() //eslint-disable-line

  const stamp = bs.create(100, 100, 'hello')

  a.set({
    val: 'hello',
    stamp
  }, bs.create(2, 2, 'hello'))

  console.log(a.stamp, stamp)
  console.log(b.stamp, stamp)
  console.log(c.stamp, stamp)

  t.same(a.stamp, stamp, 'stamp is hello-100')
  t.same(b.stamp, stamp, 'stamp is hello-100')
  t.same(c.stamp, stamp, 'stamp is hello-100')

  a.set({
    val: 'hello',
    stamp: bs.create(100, 100, 'hello')
  }, bs.create(2, 2, 'hello'))
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
        stamp: bs.create(false, false, 'keepit100')
      }
    }
  }, 'hello')

  t.same(b.stamp, bs.create(false, false, 'keepit100'))
  t.equal(a.a.b, null, 'removed a.a.b')
  a.set({ a: { b: { stamp: bs.create(false, false, 'X') } } }, false)
  t.same(a.tStamp, bs.create(false, false, 'X'), 'correct travel stamp')
  t.end()
})
