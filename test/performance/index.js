const perf = require('brisky-performance')
const struct = require('../../')
const Obs = require('vigour-observable')
const State = require('vigour-state')
var n = 1e3

// perf(() => {
//   for (let i = 0; i < n; i++) {
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
//   for (let i = 0; i < n; i++) {
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
//   for (let i = 0; i < n; i++) {
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
//   for (let i = 0; i < n; i++) {
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
//   for (let i = 0; i < n; i++) {
//     struct({ on: { data: { log: () => {} } } })
//   }
// }, () => {
//   for (let i = 0; i < n; i++) {
//     new Obs({ on: { data: { log: () => {} } } }) // eslint-disable-line
//   }
// }, 'create listeners')

perf(() => {
  const a = struct({ on: { data: { log: () => {} } } })
  for (let i = 0; i < n * 100; i++) {
    a.set(i)
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
//   for (let i = 0; i < n; i++) {
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
//   for (let i = 0; i < n; i++) {
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

// perf(() => {
//   const s = struct({ val: 's', $transform: val => val + '!' })
//   for (let i = 0; i < n * 100; i++) {
//     s.compute()
//   }
// }, () => {
//   const s = new Obs({ val: 's', $transform: val => val + '!' })
//   for (let i = 0; i < n * 100; i++) {
//     s.compute()
//   }
// }, `$transform n = ${(n * 100 / 1e3) | 0}k`)

// perf(() => {
//   const s = struct({ a: { b: { c: {} } } })
//   const a = s.a.b.c
//   s.subscribe(
//     { a: { b: { c: { val: true } } } },
//     () => {}
//   )
//   for (let i = 0; i < n * 100; i++) {
//     a.set(i)
//   }
// }, () => {
//   const s = new State({ a: { b: { c: {} } } })
//   const a = s.a.b.c
//   s.subscribe(
//     { a: { b: { c: { val: true } } } },
//     () => {}
//   )
//   for (let i = 0; i < n * 10; i++) {
//     a.set(i)
//   }
// }, `simple subscription n = ${(n * 100 / 1e3) | 0}k`, 10)

// perf(() => {
//   for (let i = 0; i < n * 10; i++) {
//     let s = struct({ a: { b: { c: {} } } })
//     let a = s.a.b.c
//     s.subscribe(
//       { a: { b: { c: { val: true } } } },
//       () => {}
//     )
//     a.set(i)
//   }
// }, () => {
//   for (let i = 0; i < n * 1; i++) {
//     let s = new State({ a: { b: { c: {} } } })
//     let a = s.a.b.c
//     s.subscribe(
//       { a: { b: { c: { val: true } } } },
//       () => {}
//     )
//     a.set(i)
//   }
// }, `creation n = ${(n * 10 / 1e3) | 0}k`, 10)

// n = 1

perf(() => {
  const s = struct({})
  s.subscribe(
    { $any: { val: true } },
    () => {}
  )
  for (let i = 0; i < n * 2; i++) {
    // console.log(' \nset')
    s.set({ [i]: i })
  }
}, () => {
  // const s = new State({})
  // s.subscribe(
  //   { $any: { val: true } },
  //   () => {}
  // )
  // for (let i = 0; i < n * 2; i++) {
  //   s.set({ [i]: i })
  // }
}, `any subscription n = ${((n * 2 / 1e3) | 0)}k`)

perf(() => {
  for (let i = 0; i < n * 10; i++) {
    let s = struct({})
    s.subscribe(
      { $any: { val: true } },
      () => {}
    )
    s.set({ [i]: i })
  }
}, () => {
  for (let i = 0; i < n * 10; i++) {
    let s = new State({})
    s.subscribe(
      { $any: { val: true } },
      () => {}
    )
    s.set({ [i]: i })
  }
}, `any subscription creation n = ${(n * 10 / 1e3) | 0}k`)
