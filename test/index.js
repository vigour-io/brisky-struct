'use strict'
const { create, set, get, struct, compute } = require('../')
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

const b = create(struct, {
  props: {
    default: {
      title: 'yo',
      props: { default: 'self' }
    }
  }
})

const c = create(b, { hello: true })

console.log(compute(get(c.hello, 'title')))
