import test from 'tape'
import { create as struct } from '../lib/'

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
  t.equal(a.a.b.c, null, 'removed a.a.b.c')
  t.same(results, [ null, 100 ], 'fires listeners for stamp in keys')
  a.set({ a: { b: { stamp: 'X' } } }, false)
  t.equal(a.tStamp, 'X', 'correct travel stamp')
  t.end()
})
