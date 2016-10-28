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
    data: { b: () => { console.log('my instance a2') } }
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

// want to remove all instances as well perhaps?

