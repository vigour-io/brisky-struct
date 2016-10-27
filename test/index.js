'use strict'
const { create, set, get, struct, compute } = require('../')
const bstamp = require('brisky-stamp')

const a = create(struct, {
  val: 1,
  b: 2,
  c: 3,
  on: {
    data: {
      1: (t, val) => {
        // need to add path + context
        console.log('fire!', t.key, t.keys)
      }
    }
  }
})
a.key = 'a'

const a2 = create(a, {
  c: 4,
  spesh: true
})
a2.key = 'a2'

const a22 = create(a2)
a22.key = 'a22'

const a3 = create(a, {
  val: 2,
  yuzi: true
})
a3.key = 'a3'

var s

console.log('-------------------------------------------')
console.log('\n\ngo set case')

s = bstamp.create()
set(a, 3, s)
bstamp.close(s)

// want to fire for a2
console.log('a:', compute(a), 'a2:', compute(a2), 'a3:', compute(a3))

console.log('-------------------------------------------')
console.log('\n\ngo multi case')
s = bstamp.create()
set(a, { yuzi: true }, s)
bstamp.close(s)

console.log('-------------------------------------------')
console.log('\n update exsiting key (remove)')
s = bstamp.create()
set(a, { c: null }, s)
bstamp.close(s)

console.log('-------------------------------------------')
console.log('\n update exsiting key (spesh)')
s = bstamp.create()
set(a, { spesh: true }, s)
bstamp.close(s)

console.log('-------------------------------------------')
console.log('\n CONTEXT TIME')

// const a = create(struct, {
//   val: 1,
//   on: {
//     data: {
//       1: (t, val) => {
//         console.log('fire!', t.key, t.keys)
//       }
//     }
//   }
// })
// a.key = 'a'
