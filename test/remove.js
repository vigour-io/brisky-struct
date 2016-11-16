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
  const obj = struct({ //eslint-disable-line
    key: 'obj',
    props: {
      default: s
    },
    hello: {},
    blurf: {
      x: {
        z: 'haha'
      }
    }
  })
  s.set(null, 'stamp')
  t.same(results, [
    [ 'obj', 'blurf' ],
    [ 'obj', 'blurf', 'bla' ],
    [ 'obj', 'blurf', 'bla', 'a', 'b', 'c' ],
    [ 'obj', 'blurf', 'x', 'z' ],
    [ 'obj', 'hello' ],
    [ 'obj', 'hello', 'bla' ],
    [ 'obj', 'hello', 'bla', 'a', 'b', 'c' ],
    [ 'obj', 'hello', 'x', 'z' ],
    [ 's2' ],
    [ 's2', 'bla' ],
    [ 's2', 'bla', 'a', 'b', 'c' ],
    [ 's2', 'x', 'z' ],
    [ 's' ],
    [ 's', 'bla' ],
    [ 's', 'bla', 'a', 'b', 'c' ]
  ], 'fires all listeners on remove')
  t.end()
})
