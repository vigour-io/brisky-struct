const { create, set, get, struct, compute } = require('../')

const a = create(struct, {
  a: true,
  b: true,
  c: true
})

const b = create(a, { b: true })
const c = create(b)
const c2 = create(c, { b: null })

const d = create(c, { x: true })
const e = create(d)
const f = create(d, { bla: true })

console.log(a.keys)
console.log(b.keys)
console.log('c2', c2.keys)

// console.log(c.keys)
console.log('GO GO GO')
set(a, { b: null, d: true })

console.log('a', a.keys)
console.log('b', b.keys) // console.log('b')
console.log('c', c.keys)
console.log('c2', c2.keys)
console.log('d', d.keys)
console.log('e', e.keys)
console.log('f', f.keys)
