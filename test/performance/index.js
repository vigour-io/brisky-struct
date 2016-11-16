const perf = require('brisky-performance')
const struct = require('../../')
const Obs = require('vigour-observable')
const n = 1e4
const bs = require('brisky-stamp')

// perf(() => {
//   for (let i = 0; i < amount; i++) {
//     let a = struct({
//       b: { c: { d: true } },
//       on: {
//         data: {
//           lol () {}
//         }
//       }
//     })
//     a.set(null)
//   }
// }, () => {
//   for (let i = 0; i < amount; i++) {
//     let a = new Obs({ // eslint-disable-line
//       b: { c: { d: true } },
//       on: {
//         data: {
//           lol () {}
//         }
//       }
//     })
//     a.remove(false)
//   }
// }, 'remove')

// perf(() => {
//   for (let i = 0; i < amount; i++) {
//     let a = struct({
//       b: {
//         c: {
//           d: true,
//           on: {
//             data: {
//               lol () {}
//             }
//           }
//         }
//       },
//       on: {
//         data: {
//           lol () {}
//         }
//       }
//     })
//     let b = a.create() // eslint-disable-line
//     a.set(null, i)
//   }
// }, () => {
//   for (let i = 0; i < amount; i++) {
//     let a = new Obs({
//       b: {
//         c: {
//           d: true,
//           on: {
//             data: {
//               lol () {}
//             }
//           }
//         }
//       },
//       on: {
//         data: {
//           lol () {}
//         }
//       }
//     })
//     let b = new a.Constructor() // eslint-disable-line
//     a.set(null)
//   }
// }, 'remove - listeners')

// perf(() => {
//   for (let i = 0; i < amount; i++) {
//     struct({ on: { data: { log: () => {} } } })
//   }
// }, () => {
//   for (let i = 0; i < amount; i++) {
//     new Obs({ on: { data: { log: () => {} } } }) // eslint-disable-line
//   }
// }, 'create listeners')

perf(() => {
  const a = struct({ on: { data: { log: () => {} } } })
  for (let i = 0; i < n * 100; i++) {
    a.set(i, bs.create())
  }
}, () => {
  const a = new Obs({ on: { data: { log: () => {} } } })
  for (let i = 0; i < n * 100; i++) {
    a.set(i)
  }
}, `fire listeners n = ${(n * 100 / 1e3) | 0}k`)

// perf(() => {
//   const orig = struct({
//     on: {
//       data: {
//         lol: () => {}
//       }
//     }
//   })
//   for (let i = 0; i < amount; i++) {
//     let a = orig.create()
//     struct(a)
//   }
// }, () => {
//   const orig = new Obs({
//     on: {
//       data: {
//         lol: () => {}
//       }
//     }
//   })
//   for (let i = 0; i < amount; i++) {
//     let a = new orig.Constructor()
//     new Obs(a) // eslint-disable-line
//   }
// }, 'create references')

perf(() => {
  const a = struct()
  struct({
    val: a,
    on: {
      data: { lol () {} }
    }
  })
  for (let i = 0; i < n * 100; i++) {
    a.set(i, bs.create())
  }
}, () => {
  const a = new Obs()
  new Obs({ // eslint-disable-line
    val: a,
    on: {
      data: {
        lol () {}
      }
    }
  })
  for (let i = 0; i < n * 100; i++) {
    a.set(i)
  }
}, `fire listeners over references n = ${(n * 100 / 1e3) | 0}k`)
