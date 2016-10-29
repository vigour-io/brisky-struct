const { create, set, get, struct, compute } = require('../')
const bstamp = require('brisky-stamp')

// const a = create(struct, {
//   val: 1,
//   b: 2,
//   c: 3,
//   on: {
//     data: {
//       1: (t, val) => {
//         // need to add path + context
//         console.log('fire!', t.key, t.keys)
//       }
//     }
//   }
// })
// a.key = 'a'

// const a2 = create(a, {
//   c: 4,
//   spesh: true
// })
// a2.key = 'a2'

// const a22 = create(a2)
// a22.key = 'a22'

// const a3 = create(a, {
//   val: 2,
//   yuzi: true
// })
// a3.key = 'a3'


// const bla = create(struct, {
//   val: a2,
//   on: {
//     data: {
//       x: () => {
//         console.log('YESSSSS')
//       }
//     }
//   }
// })

// const xxx = create(bla, {})

// var s

// console.log('-------------------------------------------')
// console.log('\n\ngo set case')

// s = bstamp.create()
// set(a, 3, s)
// bstamp.close(s)

// // want to fire for a2
// console.log('a:', compute(a), 'a2:', compute(a2), 'a3:', compute(a3))

// console.log('-------------------------------------------')
// console.log('\n\ngo multi case')
// s = bstamp.create()
// set(a, { yuzi: true }, s)
// bstamp.close(s)

// console.log('-------------------------------------------')
// console.log('\n update exsiting key (remove)')
// s = bstamp.create()
// set(a, { c: null }, s)
// bstamp.close(s)

// console.log('-------------------------------------------')
// console.log('\n update exsiting key (spesh)')
// s = bstamp.create()
// set(a, { spesh: true }, s)
// bstamp.close(s)

console.log('-------------------------------------------')
console.log('\n CONTEXT TIME')

var cnt = 0

const b = create(struct, {
  C: {
    on: {
      data: {
        1: (t, val) => {
          cnt++
          console.log('fire!', path(t))
        }
      }
    }
  }
})

// const b2 = create(b)
// b2.key = 'b2'
const x = create(struct, {
  a: {
    b: {
      props: { default: b },
      // so here is one
      X: true
    }
  }
})

const yuzi = create(x, {
  a: {
    b: {
      X: {
        C: {
          on: {
            data: {
              1: () => {}
            }
          }
        }
      }
    }
  }
})
yuzi.key = 'yuzi'

const path = require('../lib/traversal').path
// console.log('hello', path(x.a.b))
// console.log(path(get(x, ['a', 'b', 'X', 'c'])))

const x2 = create(x)

const x3 = create(struct, {
  xx: {
    xxx: {
      props: { default: x },
      // so here is one
      XXXX: true
    }
  }
})

const x4 = create(struct, {
  A: {
    B: {
      props: { default: x3 },
      C: true
    }
  }
})

// console.log(b.c.contextPath, x.a.contextPath, x.a.b.X.contextPath, b.c.context.key, x.a.b.X.context.key)
// console.log(get(x4, [ 'A', 'B', 'C', 'xx', 'xxx', 'XXXX', 'a', 'b', 'X', 'C' ]).contextLevel)
// console.log(path(get(x4, [ 'A', 'B', 'C', 'xx', 'xxx', 'XXXX', 'a', 'b', 'X', 'C' ])))
console.log(set(get(x4, [ 'A', 'B', 'C', 'xx', 'xxx', 'XXXX', 'a', 'b', 'X', 'C' ]), 'TRIPPLE MOFO').val)
// console.log('LOLLL', x4.A.B.C.xx.xxx.XXXX.a.b.X.C.val)
// console.log(x3.xx.xxx.XXXX)
// console.log(b.c.val)
// console.log(x3.xx.xxx.XXXX.a.b.X.c.val) // super wrong
// console.log(x4.A.B.C.xx.xxx.XXXX.a.b.X.c.val) // super wrong
const xx2 = create(x)
const xx3 = create(x)
const xx4 = create(x)
const xx5 = create(x3)


const y = create(struct, {
  yy: {
    props: { default: x },
    Y: true
  }
})

const y2 = create(y)

const bla = create(struct, {
  bla: {
    x: {
      props: { default: y2 },
      Z: true
    }
  }
})

const yo = create(struct, {
  yo: {
    yoyo: {
      props: { default: bla },
      YO: true
    }
  }
})


// for (var i = 0; i < 1e6; i++) {
//   create(yo)
// }

// console.log(' \n\n')
var d = Date.now()

s = bstamp.create()
// console.log(b.C.contextLevel, b.C.context.key)
set(get(b, 'C'), 'hello', s)
// set(b, { C: 'hello' }, s)
bstamp.close(s)
console.log(Date.now() - d, 'fired:', cnt, 'k')

// require('./prop')
// require('./listeners')
// require('./instances')
console.log('!!!!!!!', path(get(bla, [ 'bla', 'x', 'Z', 'yy', 'Y', 'a', 'b', 'X', 'C' ])))
