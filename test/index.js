'use strict'

const struct = require('../')
const bla = struct()

bla.set({
  define: {
    hello () {
      console.log('yo hello!', this.compute(), this.blur())
    },
    blur () {
      return 'x'
    }
  },
  props: {
    default: 'self'
  },
  val: 'xxxxx'
})

const instance = bla.create({
  x: 'XXX',
  y: 'yyyy',
  z: 'zzzz',
  u: 'xxxx',
  f: {
    g: {
      h: {
        x: true
      }
    }
  }
})

for (let i = 0; i < 10; i++) {
  instance.push(i)
}

console.log(instance.f.g.h.x)

// console.log(instance.map((val, key, keys) => val.compute()))

// console.log(instance.filter(val => val.compute() === 'XXX'))
console.log(instance.x)

console.log(instance)
// parent is #1
// maybe key as well (make it like _K and _P)
// can add extend again -- not a biggy

const x = instance.create()
console.log(instance.x.hello(), instance.x.compute())
console.log('??', x.compute())
// console.log(bla)
// require('./context')
// require('./props')
// require('./async')
