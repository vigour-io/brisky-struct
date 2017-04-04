const test = require('tape')
const { struct } = require('../')

test('reset - basic ', t => {
  const a = struct.create({
    a: {
      b: {
        c : true
      }
    },
    b: {
      c: true,
      d: true
    },
    c: 'bla'
  })

  a.set()

  t.end()
})

// test('reset - listeners ', t => {
//   const results = []
//   const a = struct.create()
//   t.equal(a.on(val => { results.push(val) }), a, 'returns struct')
//   a.set('hello')
//   t.same(results, [ 'hello' ], 'add listener using method')
//   t.end()
// })
