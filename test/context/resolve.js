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
      z: {},
      z2: {}
    }
  })
  const z = x.get([ 'y', 'z', 'b', 'c' ])
  const resolved = z.set('haha', 'stamp')
  t.not(resolved, z, 'resolved context')
  t.same(results, [ [ 'x', 'y', 'z', 'b', 'c' ] ], 'fired correct listeners')
  t.equal(z.context, null, 'cleared context on resolve')
  t.equal(z.contextLevel, null, 'cleared contextLevel on resolve')
  const z2 = x.get([ 'y', 'z2', 'b' ])
  const resolved2 = z2.set('haha', 'stamp')
  t.not(resolved2, z2, 'resolved context - low level')
  t.end()
})
