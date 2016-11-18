const perf = require('brisky-performance')
const struct = require('../../')
const Obs = require('vigour-observable')
const State = require('vigour-state')
const n = 1e3
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

// perf(() => {
//   const a = struct({ on: { data: { log: () => {} } } })
//   for (let i = 0; i < n * 100; i++) {
//     a.set(i, bs.create())
//   }
// }, () => {
//   const a = new Obs({ on: { data: { log: () => {} } } })
//   for (let i = 0; i < n * 100; i++) {
//     a.set(i)
//   }
// }, `fire listeners n = ${(n * 100 / 1e3) | 0}k`)

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

// perf(() => {
//   const a = struct()
//   struct({
//     val: a,
//     on: {
//       data: { lol () {} }
//     }
//   })
//   for (let i = 0; i < n * 100; i++) {
//     a.set(i, bs.create())
//   }
// }, () => {
//   const a = new Obs()
//   new Obs({ // eslint-disable-line
//     val: a,
//     on: {
//       data: {
//         lol () {}
//       }
//     }
//   })
//   for (let i = 0; i < n * 100; i++) {
//     a.set(i)
//   }
// }, `fire listeners over references n = ${(n * 100 / 1e3) | 0}k`)

// perf(() => {
//   const a = struct({})
//   for (let i = 0; i < n * 100; i++) {
//     a.set(i, bs.create())
//   }
// }, () => {
//   const a = new State({})
//   for (let i = 0; i < n * 100; i++) {
//     a.set(i)
//   }
// }, `fire listeners vs vigour-state n = ${(n * 100 / 1e3) | 0}k`)

// perf(() => {
//   const s = struct({ a: { b: { c: {} } } })
//   const a = s.a.b.c
//   for (let i = 0; i < n * 100; i++) {
//     a.set(i, bs.create())
//   }
// }, () => {
//   const s = new State({ a: { b: { c: {} } } })
//   const a = s.a.b.c
//   for (let i = 0; i < n * 100; i++) {
//     a.set(i)
//   }
// }, `fire listeners vs vigour-state deep n = ${(n * 100 / 1e3) | 0}k`)

perf(() => {
  const s = struct({ val: 's', $transform: val => val + '!' })
  for (let i = 0; i < n * 100; i++) {
    s.compute()
  }
}, () => {
  const s = new Obs({ val: 's', $transform: val => val + '!' })
  for (let i = 0; i < n * 100; i++) {
    s.compute()
  }
}, `$transform n = ${(n * 100 / 1e3) | 0}k`)

perf(() => {
  const s = struct({ a: { b: { c: {} } } })
  const a = s.a.b.c
  s.subscribe(
    { a: { b: { c: { val: true } } } },
    () => {}
  )
  for (let i = 0; i < n * 100; i++) {
    let stamp = bs.create()
    a.set(i, stamp)
    bs.close(stamp)
  }
}, () => {
  const s = new State({ a: { b: { c: {} } } })
  const a = s.a.b.c
  s.subscribe(
    { a: { b: { c: { val: true } } } },
    () => {}
  )
  for (let i = 0; i < n * 10; i++) {
    a.set(i)
  }
}, 10, 10)
//  `simple subscription n = ${(n * 100 / 1e3) | 0}k`
