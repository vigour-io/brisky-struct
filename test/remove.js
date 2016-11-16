const test = require('tape')
const struct = require('../')

test('remove ', t => {
  const results = []
  const s = struct({
    key: 's',
    types: {
      a: {
        b: {
          c: { on: t => results.push(t.path()) }
        }
      },
      x: {
        z: { on: t => results.push(t.path()) }
      }
    },
    bla: {
      on: t => results.push(t.path()),
      a: { type: 'a' }
    },
    x: {
      type: 'x',
      field: true
    },
    on: t => results.push(t.path())
  })

  const s2 = s.create({ key: 's2' }) //eslint-disable-line

  const obj = { //eslint-disable-line
    props: {
      default: s
    },
    hello: {},
    bla: true
  }

  s.set(null, 'stamp')

  console.log(results)

  t.end()
})
