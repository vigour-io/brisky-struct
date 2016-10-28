'use strict'
const { create, set, get, struct, compute } = require('../')

console.log('-------------------------------------------')
console.log('\n PROPS')
// also do types ofc
const a = create(struct, {
  props: {
    bla: {
      yuzi: 'xxx'
    }
  }
})

set(a, { bla: true })

console.log(compute(get(a, [ 'bla', 'yuzi' ])))

set(a, {
  props: {
    bla: {
      yuzi: 'NEW'
    }
  }
})

console.log(compute(get(a, [ 'bla', 'yuzi' ])))

console.log('-------------------------------------------')
console.log('\n PROPS INSTANCE ENHANCE')
const a2 = create(a, {
  props: {
    bla: {
      gurrr: 'GURRR' // inherit
    }
  },
  bla: null // may need to update ask the yuzi
})

set(a2, { bla: 'xxxx' })
console.log(compute(get(a2, [ 'bla', 'gurrr' ])))

console.log('-------------------------------------------')
console.log('\n TYPES')
const b = create(struct, {
  props: {
    default: { hello: true }
  }
})

console.log('-------------------------------------------')
console.log('\n (wrong default -- revert to struct)')
const v = create(struct, {
  props: {
    default: () => {},
    x: create(struct)
  },
  types: {
    blurf: { text: 'xxx' }
  },
  x: {
    type: 'blurf'
  }
})
