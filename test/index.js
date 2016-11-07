'use strict'

const { create, struct } = require('../')
var bla = create(struct)

// console.log(bla.Constructor)

bla.Constructor = function () {}
bla.Constructor.prototype = new struct.Constructor()
bla.Constructor.prototype.hello = function () {
  console.log('hello!!!!!')
}

bla.set({
  props: {
    default: 'self'
  }
})

bla.set({
  x: 'XXX'
})

const x = bla.create()

console.log(bla.x.hello(), bla.x.compute())

// console.log(bla)

require('./context')
// require('./props')
// require('./async')
