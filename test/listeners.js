'use strict'
const { create, set, get, struct, compute } = require('../')

const a = create(struct, {
  on: {
    data: { a: () => { console.log('!!!!') } }
  }
})

const b = create(struct, {
  val: a,
  on: {
    data: {
      1: () => {
        console.log('1a')
      }
    }
  }
})
set(a, null, 'x')

console.log('--------------')
const a2 = create(a, {
  on: {
    data: { A2: () => { console.log('my instance a2') } }
  }
})

const a3 = create(a2, {
  on: {
    data: { A3: () => { console.log('my instance a3') } }
  }
})

set(a, {
  on: {
    data: { xxx: () => { console.log('xxxx') } }
  }
}, 'x')

console.log('remove listener?')
set(a, {
  on: {
    data: { a: null }
  }
}, 'x')

console.log(a.on.data.fn)
console.log(a2.on.data.fn)
console.log(a3.on.data.fn.map(val => val.toString()).join('\n'))

set(a, {
  on: {
    data: { GURK: (GURK) => {}, A2: () => { console.log('poooooop') } }
  }
}, 'x')

console.log('AFTER')
console.log(a2.on.data.fn.map(val => val.toString()).join('\n'))
console.log('--------')
console.log(a3.on.data.fn.map(val => val.toString()).join('\n'))

// want to remove all instances as well perhaps?

