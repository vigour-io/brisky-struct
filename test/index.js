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
        console.log('fire!', val)
      }
    }
  }
})

const a2 = create(a, {
  c: 4
})

const a22 = create(a2)

const a3 = create(a, {
  val: 2
})

const s = bstamp.create()
set(a, 3, s)
bstamp.close(s)

// want to fire for a2
console.log('a:', compute(a), 'a2:', compute(a2), 'a3:', compute(a3))
