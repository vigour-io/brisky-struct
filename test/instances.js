const { create, set, get, struct, compute } = require('../')

const a = create(struct, {
  a: true,
  b: true,
  c: true
})

const b = create(a, { b: true })

const c = create(b)

const d = create(c, { x: true })

console.log(a.keys)
console.log(b.keys)
// console.log(c.keys)

console.log('GO GO GO')
set(a, { b: null, d: true })

console.log('a', a.keys)
console.log('b', b.keys) // console.log('b')
console.log('c', c.keys)
console.log('d', d.keys)
