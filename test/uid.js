const test = require('tape')
const { create, puid } = require('../')

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

test('uid - puid', t => {
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
  const a2 = a.create()
  t.equal(puid(a2.get(['a', 'b', 'c'])), puid(a.get(['a', 'b', 'c'])))

  // var i = 1e6
  // var cntx = a2.get(['a', 'b', 'c'])
  // var d = Date.now()
  // while (i--) {
  //   puid(cntx)
  // }
  // console.log('context', Date.now() - d, 'ms')

  // i = 1e6
  // var normal = a.get(['a', 'b', 'c'])
  // d = Date.now()
  // while (i--) {
  //   puid(normal)
  // }
  // console.log('normal', Date.now() - d, 'ms')

  t.end()
})
