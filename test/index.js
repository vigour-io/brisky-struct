'use strict'
const { create, set, get, struct } = require('../')
const bstamp = require('brisky-stamp')

const a = create(struct, {
  on: {
    data: {
      a: () => console.log('yes fire')
    }
  }
})

// 1 mil sets 60ms
console.log('go set!')
const s = bstamp.create()
set(a, 'bla', 'x', s)
bstamp.close(s)

// console.log(a.on.data.inherits.child)

// removing it