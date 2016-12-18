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

// test('set - extra argument', t => {
//   const a = struct({ c: true })
//   const b = struct({ a: { b: a } })
//   const c = struct(b)
//   t.equal(c.get(['a', 'b', 'c']), a.c, 'references')
//   t.end()
// })
