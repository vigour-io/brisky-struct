const test = require('tape')
const struct = require('../../')

test('context - resolve', t => {
  var results = []
  const a = struct({
    key: 'a',
    b: {
      c: {
        on: {
          data: {
            results: (t) => {
              results.push(t.path())
            }
          }
        }
      }
    }
  })

  const x = struct({
    key: 'x',
    y: {
      props: {
        default: a
      },
      z: {}
    }
  })

  const context = x.get([ 'y', 'z', 'b', 'c' ])
  const resolved = context.set('haha', 'stamp')
  t.not(resolved, context, 'resolved context')
  t.same(results, [ [ 'x', 'y', 'z', 'b', 'c' ] ], 'fired correct listeners')
  t.end()
})
