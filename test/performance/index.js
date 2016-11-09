const perf = require('brisky-performance')
const struct = require('../../')
const Obs = require('vigour-observable')
const amount = 1e4

perf(() => {
  const orig = struct({
    on: {
      data: {
        lol: () => {}
      }
    }
  })
  for (let i = 0; i < amount; i++) {
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
  for (let i = 0; i < amount; i++) {
    let a = new orig.Constructor()
    new Obs(a) // eslint-disable-line
  }
}, 'create references')

perf(() => {
  const orig = struct({
    on: {
      data: {
        lol: () => {}
      }
    }
  })
  for (let i = 0; i < amount; i++) {
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
  for (let i = 0; i < amount; i++) {
    let a = new orig.Constructor()
    new Obs(a) // eslint-disable-line
  }
}, 'fire listeners over references')
