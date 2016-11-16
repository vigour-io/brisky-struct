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

  s.set(null, 'stamp')

  console.log(results)

  t.end()
})
