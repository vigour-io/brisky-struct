const { create, set, get, struct, compute } = require('../')

const a = create(struct, {
  a: true,
  b: true
})

const b = create(a, { b: true })

const c = create(b)

console.log(a.keys)
console.log(b.keys)
console.log(c.keys)

set(a, { b: null, d: true })

console.log(a.keys)
console.log(b.keys)
console.log(c.keys)
