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
        XXXXXXXX: true,
        YYYYYYYY: true
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
      hello: {},
      gurky: { type: 'gurky' },
      val: 'smurt'
      // a: 'blabla'
    }
  })

  const a1 = a.bla.create()
  const a2 = a.bla.create({ MYOWN: true })
  const a3 = a.bla.create({ hello: null })
  const a32 = a3.create({
    'HA': true
  })

  a.bla.set({ type: 'b' })

  // console.log('\nINHERITS: 👁')
  // console.log(JSON.stringify(a.bla.poep, false, 2), a.bla.keys())

  // console.log('\n\nRESULTS: 👁')
  // console.log(JSON.stringify(a.bla.serialize(), false, 2))

  // console.log('\nRESULT INSTANCE: 👁')
  // console.log(JSON.stringify(a1.serialize(), false, 2))

  // console.log('\nRESULT INSTANCE 2 OWN KEYS: 👁')
  // console.log(JSON.stringify(a2.serialize(), false, 2))

  // console.log('\n 🦊  RESULT INSTANCE 3 OWN KEYS + REMOVAL: 🦊')
  // console.log(JSON.stringify(a3.serialize(), false, 2))

  console.log('\n 🦊🦏  RESULT INSTANCE 3-2 OWN KEYS + REMOVAL: 🦊🦏')
  console.log(JSON.stringify(a32.serialize(), false, 2))

  console.log(a3.keys())

  t.end()
})
