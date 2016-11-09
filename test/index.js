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

bla.set({
  x: 'XXX'
})

// parent is #1
// maybe key as well (make it like _K and _P)
// can add extend again -- not a biggy

const x = bla.create()
console.log(bla.x.hello(), bla.x.compute())
console.log('??', x.compute())
// console.log(bla)
// require('./context')
// require('./props')
// require('./async')
