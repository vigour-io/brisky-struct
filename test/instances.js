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

console.log(a._ks)
console.log(b._ks)
console.log('c2', c2._ks)

// console.log(c._ks)
console.log('GO GO GO')
set(a, { b: null, d: true })

console.log('a', a._ks)
console.log('b', b._ks) // console.log('b')
console.log('c', c._ks)
console.log('c2', c2._ks)
console.log('d', d._ks)
console.log('e', e._ks)
console.log('f', f._ks)
