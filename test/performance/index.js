const perf = require('brisky-performance')
const struct = require('../../')
const Obs = require('vigour-observable') // eslint-disable-line
const State = require('vigour-state') // eslint-disable-line
var n = 1e3 // eslint-disable-line

perf(() => {
  for (let i = 0; i < n; i++) {
    let a = struct({
      b: { c: { d: true } },
      on: {
        data: {
          lol () {}
        }
      }
    })
    a.set(null)
  }
}, () => {
  for (let i = 0; i < n; i++) {
    let a = new Obs({ // eslint-disable-line
      b: { c: { d: true } },
      on: {
        data: {
          lol () {}
        }
      }
    })
    a.remove(false)
  }
}, 'remove')

perf(() => {
  for (let i = 0; i < n * 10; i++) {
    let a = struct({
      a: i, b: i, c: i
    })
    let b = a.create() // eslint-disable-line
  }
}, () => {
  for (let i = 0; i < n * 10; i++) {
    let a = new Obs({
      a: i, b: i, c: i
    })
    let b = new a.Constructor() // eslint-disable-line
  }
}, `create context n = ${(n * 10 / 1e3) | 0}k`)

perf(() => {
  for (let i = 0; i < n; i++) {
    let a = struct({
      b: {
        c: {
          d: true,
          on: {
            data: {
              lol () {}
            }
          }
        }
      },
      on: {
        data: {
          lol () {}
        }
      }
    })
    let b = a.create() // eslint-disable-line
    a.set(null, i)
  }
}, () => {
  for (let i = 0; i < n; i++) {
    let a = new Obs({
      b: {
        c: {
          d: true,
          on: {
            data: {
              lol () {}
            }
          }
        }
      },
      on: {
        data: {
          lol () {}
        }
      }
    })
    let b = new a.Constructor() // eslint-disable-line
    a.set(null)
  }
}, 'remove - listeners')

perf(() => {
  for (let i = 0; i < n; i++) {
    struct({ on: { data: { log: () => {} } } })
  }
}, () => {
  for (let i = 0; i < n; i++) {
    new Obs({ on: { data: { log: () => {} } } }) // eslint-disable-line
  }
}, 'create listeners')

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

perf(() => {
  const orig = struct({
    on: {
      data: {
        lol: () => {}
      }
    }
  })
  for (let i = 0; i < n; i++) {
    let a = orig.create()
    struct(a)
  }
}, () => {
  const orig = new Obs({
    on: {
      data: {
        lol: () => {}
      }
    }
  })
  for (let i = 0; i < n; i++) {
    let a = new orig.Constructor()
    new Obs(a) // eslint-disable-line
  }
}, 'create references')

perf(() => {
  const a = struct()
  struct({
    val: a,
    on: {
      data: { lol () {} }
    }
  })
  for (let i = 0; i < n * 100; i++) {
    a.set(i)
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

perf(() => {
  const a = struct({})
  for (let i = 0; i < n * 100; i++) {
    a.set(i)
  }
}, () => {
  const a = new State({})
  for (let i = 0; i < n * 100; i++) {
    a.set(i)
  }
}, `fire listeners vs vigour-state n = ${(n * 100 / 1e3) | 0}k`)

perf(() => {
  const s = struct({ a: { b: { c: {} } } })
  const a = s.a.b.c
  for (let i = 0; i < n * 100; i++) {
    a.set(i)
  }
}, () => {
  const s = new State({ a: { b: { c: {} } } })
  const a = s.a.b.c
  for (let i = 0; i < n * 100; i++) {
    a.set(i)
  }
}, `fire listeners vs vigour-state deep n = ${(n * 100 / 1e3) | 0}k`)

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
  for (let i = 0; i < n * 10; i++) {
    let s = struct({ a: { b: { c: {} } } })
    let a = s.a.b.c
    s.subscribe(
      { a: { b: { c: { val: true } } } },
      () => {}
    )
    a.set(i)
  }
}, () => {
  for (let i = 0; i < n * 1; i++) {
    let s = new State({ a: { b: { c: {} } } })
    let a = s.a.b.c
    s.subscribe(
      { a: { b: { c: { val: true } } } },
      () => {}
    )
    a.set(i)
  }
}, `creation n = ${(n * 10 / 1e3) | 0}k`, 10)

const s = struct({})
var arr = []
for (let i = 0; i < 3e5; i++) {
  arr.push(i)
}
s.subscribe(
  { $any: { val: true } },
  () => {}
)
// will also optmize creation!
s.set(arr)

const ss = new State({})
var arrs = []
for (let i = 0; i < 3e5; i++) {
  arrs.push(i)
}
ss.subscribe(
  { $any: { val: true } },
  () => {}
)
// will also optmize creation!
ss.set(arrs)

perf(() => {
  s[(Math.random() * 3e5) | 0].set('face')
}, () => {
  ss[(Math.random() * 3e5) | 0].set('face')
}, `any subscription large set n = 300k`)

perf(() => {
  for (let i = 0; i < n * 10; i++) {
    let s = struct({})
    s.subscribe(
      { $any: { val: true } },
      () => {},
      true
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

perf(() => {
  const s = struct({})
  s.subscribe(
    { $any: { val: true } },
    () => {}
  )
  for (let i = 0; i < n; i++) {
    s.set({ [i]: i })
  }
}, () => {
  const s = new State({})
  s.subscribe(
    { $any: { val: true } },
    () => {}
  )
  for (let i = 0; i < n; i++) {
    s.set({ [i]: i })
  }
}, `any subscription n = ${((n / 1e3) | 0)}k`)

perf(() => {
  const s = struct({ a: { b: { c: {} } } })
  const a = s.a.b.c
  s.subscribe(
    { a: { b: { c: { val: true } } } },
    () => {}
  )
  for (let i = 0; i < n * 100; i++) {
    a.set(i)
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
}, `simple subscription n = ${(n * 100 / 1e3) | 0}k`, 10)

perf(() => {
  const arr = []
  let i = 100
  while (i--) {
    arr.push({ x: true })
  }
  const s = struct({
    collection: arr,
    query: 'hello'
  })
  s.subscribe(
    { collection: { $any: { x: { root: { query: true } } } } },
    () => {}
  )
  for (let i = 0; i < n * 10; i++) {
    s.query.set(i)
  }
}, () => {
  const arr = []
  let i = 100
  while (i--) {
    arr.push({ x: true })
  }
  const s = new State({
    collection: arr,
    query: 'hello'
  })
  s.subscribe(
    { collection: { $any: { x: { $root: { query: { val: true } } } } } },
    () => {}
  )
  for (let i = 0; i < n; i++) {
    s.query.set(i)
  }
}, `root subscription n = ${(n * 10 * 100 / 1e3) | 0}k`, 10)

perf(() => {
  const arr = []
  let i = 100
  while (i--) {
    arr.push({ x: true })
  }
  const s = struct({
    collection: arr,
    query: 'hello'
  })
  s.subscribe(
    {
      collection: {
        $any: {
          $switch: state => {
            return state.key === '1' &&
            { x: { root: { query: { val: true } } } }
          }
        }
      }
    },
    () => {}
  )
  for (let i = 0; i < n * 100; i++) {
    s.query.set(i)
  }
}, () => {
  const arr = []
  let i = 100
  while (i--) {
    arr.push({ x: true })
  }
  const s = new State({
    collection: arr,
    query: 'hello'
  })
  s.subscribe(
    { collection: {
      $any: {
        $test: {
          exec: state => state.key === '10',
          $pass: {
            x: { $root: { query: { val: true } } }
          }
        }
      }
    } },
    () => {}
  )
  for (let i = 0; i < n * 10; i++) {
    s.query.set(i)
  }
}, `root + test subscription n = ${(n * 100 / 1e3) | 0}k`, 10)

perf(() => {
  const arr = []
  let i = n * 10
  while (i--) {
    arr.push(i)
  }
  const s = struct({
    collection: arr,
    query: 'hello'
  })
  s.subscribe(
    {
      $any: {
        $transform: {
          val: (t) => {
            if (t.val === t.root().query.compute()) {
              return { val: true }
            }
          },
          root: { query: true }
        }
      }
    },
    () => {}
  )
  for (let i = 0; i < n * 10; i++) {
    s.query.set(i)
  }
}, () => {
  const arr = []
  let i = n * 10
  while (i--) {
    arr.push(i)
  }
  const s = new State({
    collection: arr,
    query: 'hello'
  })
  s.subscribe(
    {
      $any: {
        $test: {
          exec: (t) => {
            if (t.val === t.root.query.compute()) {
              return true
            }
          },
          $: {
            $root: { query: {} }
          },
          $pass: { val: true }
        }
      }
    },
    () => {}
  )
  for (let i = 0; i < n * 10; i++) {
    s.query.set(i)
  }
}, `$transform vs $test subscription n = ${(n * 10 / 1e3) | 0}k`, 10)
