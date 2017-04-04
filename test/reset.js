const test = require('tape')
const { struct } = require('../')

test('reset - basic ', t => {
  console.log('----------------')

  const a = struct.create({
    a: {
      b: {
        c : true
      },
      x: true
    },
    // b: {
    //   c: true,
    //   d: true
    // },
    // c: 'bla'
  })


  console.log('----------------')
  a.set({
    a: {
      b: 'ha!'
    },
    // b: {
    //   d: 'smurf'
    // }
  }, void 0, true)

  // t.same(a.keys(), [ 'a', 'b' ])
  // t.same(a.a.keys(), [ 'b' ])
  // t.same(a.a.b.keys(), [])
  // t.same(a.b.keys(), [ 'd' ])

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
