const perf = require('brisky-performance')
const struct = require('../../')
const base = require('brisky-base')
// const Obs = require('vigour-observable')
const amount = 1e5

const s = struct.struct

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
  }
)

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
