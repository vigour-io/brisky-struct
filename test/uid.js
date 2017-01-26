const test = require('tape')
const { create } = require('../')

test('uid - cuid', t => {
  const a = create()
  a.set({
    a: {
      b: {
        c: {
          val: 'hello'
        }
      }
    }
  })
  a._uid = 1e4
  a.a._uid = 1e4 + 1
  a.a.b._uid = 1e4 + 2
  a.a.b.c._uid = 1e4 + 3
  const a2 = a.create()
  a2._uid = 1e4 + 4
  t.equal(a2.get(['a', 'b', 'c']).uid(true), 1757830017)
  t.end()
})
