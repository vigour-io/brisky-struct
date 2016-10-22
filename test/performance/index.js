const perf = require('brisky-performance')
const struct = require('../../')
const base = require('brisky-base')
const Obs = require('vigour-observable')
const amount = 1e5

const s = struct.struct

perf(
  function structitSingle () {
    for (let i = 0; i < amount; i++) {
      struct.create(s, i)
    }
  },
  function baseitSingle () {
    for (let i = 0; i < amount; i++) {
      base(i)
    }
  }
)

perf(
  function structitFields () {
    for (let i = 0; i < amount; i++) {
      struct.create(s, { x: i })
    }
  },
  function baseitFields () {
    for (let i = 0; i < amount; i++) {
      base({ x: i })
    }
  }, 1
)

perf(
  function instanceStruct () {
    const a = struct.create(s, { x: true })
    for (let i = 0; i < amount; i++) {
      struct.create(a, { y: true })
    }
  },
  function instanceBase () {
    const a = base({ x: true })
    for (let i = 0; i < amount; i++) {
      new a.Constructor({ y: true }) // eslint-disable-line
    }
  }
)

perf(
  function instanceStructProperties () {
    const a = struct.create(s, {
      x: true,
      instances: false,
      properties: {
        bla (target, key, val, stamp) {

        }
      }
    })
    for (let i = 0; i < amount; i++) {
      struct.create(a, {
        y: true,
        bla: true
      })
    }
  },
  function instanceBaseProperties () {
    const a = base({
      x: true,
      instances: false,
      properties: {
        bla (target, key, val, stamp) {

        }
      }
    })
    for (let i = 0; i < amount; i++) {
      new a.Constructor({ // eslint-disable-line
        y: true,
        bla: true
      })
    }
  }
)

perf(
  function makeClassStruct () {
    for (let i = 0; i < amount / 20; i++) {
      const a = struct.create(s, { x: true })
      struct.create(a, { y: true })
    }
  },
  function makeClassBase () {
    for (let i = 0; i < amount / 20; i++) {
      const a = base({ x: true })
      new a.Constructor({ y: true }) // eslint-disable-line
    }
  }
)

perf(
  function instanceStructResolveContext () {
    const a = struct.create(s, {
      x: { y: { z: true } }
    })
    for (let i = 0; i < amount; i++) {
      struct.create(a, { x: { y: { a: true } } })
    }
  },
  function instanceBaseResolveContext () {
    const a = base({
      x: { y: { z: true } }
    })
    for (let i = 0; i < amount; i++) {
      new a.Constructor({ // eslint-disable-line
        x: { y: { a: true } }
      })
    }
  }, 1, 1
)

perf(
  function instanceStructResolveContextFromEndPoint () {
    const a = struct.create(s, {
      x: { y: { z: true } }
    })
    for (let i = 0; i < amount; i++) {
      const x = struct.create(a)
      struct.set(struct.get(x, [ 'x', 'y', 'z' ]), 'hello')
    }
  },
  function instanceBaseResolveContextFromEndPoint () {
    const a = base({
      x: { y: { z: true } }
    })
    for (let i = 0; i < amount; i++) {
      const x = new a.Constructor()
      x.x.y.z.set('hello')
    }
  }, 1, 1
)

perf(
  function instanceStructResolveContextSingle () {
    const a = struct.create(s, {
      x: { y: { z: true } }
    })
    for (let i = 0; i < amount; i++) {
      const x = struct.create(a)
      struct.set(struct.get(x, 'x'), 'hello')
    }
  },
  function instanceBaseResolveContextSingle () {
    const a = base({
      x: { y: { z: true } }
    })
    for (let i = 0; i < amount; i++) {
      const x = new a.Constructor()
      x.x.set('hello')
    }
  }, 1, 1
)

perf(
  function simpleRemoveStruct () {
    for (let i = 0; i < amount; i++) {
      let x = struct.create(s, i)
      // struct.set(x.x, null)
      struct.set(x, null)
    }
  },
  function simpleRemoveBase () {
    for (let i = 0; i < amount; i++) {
      let x = base(i)
      x.remove()
    }
  }
)

perf(
  function simpleRemoveFieldsStruct () {
    for (let i = 0; i < amount; i++) {
      let x = struct.create(s, { x: i })
      // struct.set(x.x, null)
      struct.set(x.x, null)
    }
  },
  function simpleRemoveFieldsBase () {
    for (let i = 0; i < amount; i++) {
      let x = base({ x: i })
      x.x.remove()
    }
  }, 1, 1
)

perf(
  function simpleRemoveStructSet () {
    for (let i = 0; i < amount; i++) {
      let x = struct.create(s, { x: i })
      struct.set(x, null)
    }
  },
  function simpleRemoveBaseSet () {
    for (let i = 0; i < amount; i++) {
      let x = base({ x: i })
      x.set(null)
    }
  }
)

perf(
  function computeStruct () {
    let x = struct.create(s, { x: 100 })
    let y = struct.create(s, {
      val: x.x,
      $transform: val => val * 3
    })
    let z = struct.create(s, { val: y, $transform: val => val * 2 })
    for (let i = 0; i < amount; i++) {
      struct.compute(z)
    }
  },
  function computeObservable () {
    const x = new Obs({ x: 100 })
    const y = new Obs({
      val: x.x,
      $transform: val => val * 3
    })
    const z = new Obs({ y })
    for (let i = 0; i < amount; i++) {
      z.compute()
    }
  }, 1, 1
)

perf(
  function instanceStructResolveContextRemove () {
    const a = struct.create(s, {
      x: { y: { z: true } }
    })
    for (let i = 0; i < amount; i++) {
      let x = struct.create(a, { x: { y: { z: null } } })
    }
  },
  function instanceBaseResolveContextRemove () {
    const a = base({
      x: { y: { z: true } }
    })
    for (let i = 0; i < amount; i++) {
      new a.Constructor({ // eslint-disable-line
        x: { y: { a: null } }
      })
    }
  }, 1, 1
)

perf(
  function instanceStructResolveContextFromEndPointRenove () {
    const a = struct.create(s, {
      x: { y: { z: true } }
    })
    for (let i = 0; i < amount; i++) {
      const x = struct.create(a)
      struct.set(struct.get(x, [ 'x', 'y', 'z' ]), null)
    }
  },
  function instanceBaseResolveContextFromEndPoint () {
    const a = base({
      x: { y: { z: true } }
    })
    for (let i = 0; i < amount; i++) {
      const x = new a.Constructor()
      x.x.y.z.set(null)
    }
  }, 1, 1
)
