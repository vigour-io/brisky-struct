const test = require('tape')
const { struct, switchInheritance } = require('../../')

test('context - switch inheritance - val', t => {
  const a = struct.create()
  const b = struct.create('b!')
  switchInheritance(a, b)
  t.equal(a.compute(), 'b!', 'correct val')
  t.end()
})

test('context - switch inheritance - keys', t => {
  const x = struct.create({
    x: { a: true, b: true },
    y: true,
    z: { bla: true }
  })

  const a = x.create({
    props: {
      g: () => {},
      dirt: { bye: true },
      h: { hello: true }
    },
    a: 'a!',
    z: 'z!',
    x: { b: 'yo!' },
    d: true,
    h: 'o o!'
  })

  const b = struct.create({
    b: 'b!',
    c: { d: 'd!' },
    d: 'hello',
    props: {
      x: 'myballz',
      default: {
        haha: 'fun!'
      }
    }
  })

  switchInheritance(a, b)
  t.same(x.instances.length, 0, 'removed instance')
  t.same(a.keys(), [ 'b', 'c', 'x', 'z', 'a', 'd', 'h' ], 'keys')
  t.equal(a.get('b').compute(), 'b!', 'vals')
  t.equal(a.get([ 'c', 'd' ]).compute(), 'd!', 'context')
  t.same(a.z.keys(), [], 'correct keys')
  t.equal(a.get([ 'z', 'bla' ]), void 0, 'remove inherited field')


  t.end()
})

// test('context - inheritance - basic', t => {
//   const original = struct.create()

//   const instance = original.create({
//     b: 'b!'
//   })

//   original.set({
//     b: {
//       c: true
//     }
//   })

//   t.equal(instance.get([ 'b', 'c' ]), true, 'gets same inheritance')

//   t.end()
// })

// test('context - inheritance', t => {
//   const original = struct.create({
//     props: {
//       default: 'self',
//       field: {
//         x: {
//           y: {
//             props: {
//               name: {
//                 hello: true
//               }
//             },
//             name: 'y'
//           }
//         }
//       }
//     }
//   })

//   const instance = original.create({

//   })

//   t.end()
// })

// updating props dynamicly?
// add types in the mix

// deep - complex

// references
// instances dont inherit refs anyways
// but need to test
// make ref make sure it resolves correctly


// add listeners!

// add DEEP