'use strict'

const { create, struct } = require('../')
var bla = create(struct)

// console.log(bla.Constructor)

// bla.

// bla.Constructor = function () {}

bla.set({
  define: {
    hello () {
      console.log('yo hello!')
    }
  },
  props: {
    default: 'self'
  }
})

bla.set({
  x: 'XXX'
})

const x = bla.create()
console.log(bla.x.hello(), bla.x.compute())
console.log('??', x.compute())
// console.log(bla)
// require('./context')
// require('./props')
// require('./async')
