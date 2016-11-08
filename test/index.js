'use strict'

const { create, struct } = require('../')
var bla = create(struct)

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

bla.set({
  x: 'XXX'
})

const x = bla.create()
console.log(bla.x.hello(), bla.x.compute())
console.log('??', x.compute())
// console.log(bla)
// require('./context')
require('./props')
require('./async')
