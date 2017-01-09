const test = require('tape')
const { create: struct } = require('../')

// test('types ', t => {
//   const a = struct({
//     key: 'a',
//     types: {
//       something: {
//         field: 'real'
//       },
//       bla: { somehting: 'wrong' }
//     },
//     field: { type: 'something' }
//   })

//   const b = a.create({
//     types: {
//       something: {
//         type: 'something',
//         bla: true
//       },
//       bla: 'override!'
//     },
//     x: {
//       type: 'something'
//     },
//     y: { type: 'bla' }
//   })
//   t.same(b.get('x').keys(), [ 'field', 'bla' ], 'merged "something" type')
//   t.same(b.get('y').keys(), [], 'override "bla" type')
//   t.equal(b.get('y').compute(), 'override!', 'type with string')
//   t.same(a.get('field').keys(), [ 'field' ], '"field" on a has "field"')
//   const c = struct({
//     types: {
//       a: true
//     },
//     a: {
//       b: {
//         c: true
//       }
//     }
//   })
//   const c2 = c.create({ a: { type: 'a' } })
//   t.same(c2.get('a').keys(), [], 'override inheritance')
//   t.end()
// })

// test('types ', t => {
//   const a = struct({
//     key: 'a',
//     types: {
//       a: 'self'
//     },
//     define: {
//       haha: true
//     },
//     bla: { type: 'a' }
//   })
//   t.equal(a.bla.inherits, a, 'use self in types')
//   t.end()
// })

test('switch types', t => {
  const a = struct({
    key: 'a',
    types: {
      gurky: {
        hello: true
      },
      b: {
        x: true
      },
      a: {
        props: {
          default: {
            b: { on: { data: () => console.log('fire B') } }
          }
        },
        a: true
      }
    },
    bla: {
      type: 'a',
      hello: true,
      gurky: { type: 'gurky' },
      val: 'smurt',
      a: 'blabla'
    }
  })

  const a1 = a.bla.create()

  a.bla.set({ type: 'b' })

  t.end()
})
