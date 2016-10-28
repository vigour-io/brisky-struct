'use strict'
const { create, set, get, struct, compute } = require('../')

const a = create(struct, {
  on: {
    data: { a: () => {} }
  }
})

const a2 = create(a, { x: true })

set(a2, null)
