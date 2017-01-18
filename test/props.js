const test = require('tape')
const { create: struct, struct: structIns } = require('../')

// test('props - normal field', t => {
//   const s = struct({
//     props: {
//       something: true
//     },
//     something: 'wrong'
//   })
//   t.equal(s.get('something'), 'wrong', 'something is wrong')
//   t.end()
// })

// test('props - type struct', t => {
//   const s = struct({
//     props: { default: 'self' },
//     rick: true,
//     something: { type: 'struct' }
//   })
//   t.ok(!s.something.get('rick'))
//   t.end()
// })

// test('props - remove', t => {
//   const s = struct({
//     props: { something: true },
//     something: 'wrong'
//   })
//   const instance = s.create({
//     props: { something: null },
//     something: true
//   })
//   t.equal(
//     instance.get('something').compute(), true,
//     'instance "something" is a struct (overrides prop definition)'
//   )
//   t.end()
// })

// test('props - function', t => {
//   const s = struct({
//     props: {
//       default: {
//         props: {
//           _volume (s, val) {
//             s.set({
//               volume: val,
//               mass: s.get('density') * val
//             })
//           },
//           _mass (s, val) {
//             s.set({
//               volume: val / s.get('density'),
//               mass: val
//             })
//           },
//           density: true,
//           melting: true
//         },
//         density: 1,
//         melting: 0
//       }
//     },
//     water: {}
//   })

//   t.equal(s.get(['water', 'density']), 1, 'density of water is 1')
//   t.equal(s.get(['water', 'melting']), 0, 'melting point of water is 0')
//   s.set({ gold: { density: 19.3, melting: 1064.18 } })
//   t.equal(s.get(['gold', 'density']), 19.3, 'density of gold is 19.3')
//   s.set({ water: { _volume: 10 } })
//   s.set({ gold: { _mass: 193 } })
//   t.equal(s.get(['water', 'mass']).compute(), 10, 'mass of water is 10')
//   t.equal(s.get(['gold', 'volume']).compute(), 10, 'volume of gold is 10')
//   t.end()
// })

// test('props - self', t => {
//   const s = struct({
//     props: {
//       special: { something: 'special' },
//       default: 'self'
//     },
//     hello: 'so nested',
//     normal: {
//       type: 'struct',
//       val: 'so normal',
//       props: { normal: 'self' },
//       normal: {},
//       somethingNormal: true
//     }
//   })

//   const instance = s.create({
//     bla: true,
//     normal: { normal: true }
//   })

//   t.equal(
//     instance.get('hello').get('hello').get('hello').compute(), 'so nested',
//     'recursion by using self on default'
//   )

//   t.equal(
//     instance.get('normal').get('normal').get('normal').compute(), 'so normal',
//     'recursion by using self on specific field'
//   )

//   instance.set({
//     props: { special: { field: true } },
//     special: 'whatever'
//   })

//   t.equal(
//     instance.get('special').get('field').compute(), true,
//     'set on existing struct properties'
//   )

//   instance.set({
//     props: {
//       special: { field: true, extra: true }
//     }
//   })

//   t.same(
//     instance.special.keys(), [ 'something', 'field', 'extra' ],
//     'setting a key on property updates instances'
//   )

//   const instance2 = s.create({ special: 'hello' })

//   t.same(
//     instance2.special.keys(), [ 'something' ],
//     'set on existing struct property did not influence original'
//   )

//   t.end()
// })

// test('props - reset', t => {
//   const s = struct({
//     a: 'a',
//     b: 'b',
//     c: 'c'
//   })

//   s.set({ reset: true })

//   t.same(s.keys(), [], 'removed keys')

//   s.set({
//     a: 'a',
//     b: 'b',
//     c: 'c',
//     d: 'd'
//   })

//   s.set({ reset: [ 'c', 'a' ] })

//   t.same(s.keys(), [ 'a', 'c' ], 'removed keys (and exclude)')

//   t.end()
// })

// test('props - context', t => {
//   const s = struct({
//     key: 's',
//     types: {
//       lurf: {
//         field: {
//           val: 'hello'
//         }
//       }
//     },
//     hello: {
//       props: {
//         lurf: { type: 'lurf' }
//       },
//       lurf: {}
//     }
//   })

//   s.set({
//     types: {
//       lurf: {
//         field: 'blue'
//       }
//     }
//   })

//   t.equal(s.get([ 'hello', 'lurf', 'field' ]).compute(), 'blue', 'correct inhertiance')

//   t.end()
// })
