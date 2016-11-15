const test = require('tape')
const struct = require('../../')

test('context - resolve', t => {
  var results = []
  const a = struct({
    key: 'a',
    b: {
      c: {
        d: {},
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
      z2: {},
      z3: {}
    }
  })
  const zC = x.get([ 'y', 'z', 'b', 'c' ])
  const resolved = zC.set('haha', 'stamp')
  t.not(resolved, zC, 'resolved context (level 2)')
  t.same(results, [ [ 'x', 'y', 'z', 'b', 'c' ] ], 'fired correct listeners')
  t.equal(zC.context, null, 'cleared context on resolve')
  t.equal(zC.contextLevel, null, 'cleared contextLevel on resolve')

  const z2B = x.get([ 'y', 'z2', 'b' ])
  const resolved2 = z2B.set('haha', 'stamp')
  t.not(resolved2, z2B, 'resolved context (level 1)')

  const z3D = x.get([ 'y', 'z3', 'b', 'c', 'd' ])
  const resolved3 = z3D.set(null, 'stamp')
  t.equal(resolved3, null, 'returns null from context remove')
  t.not(resolved3, z3D, 'resolved context (level 3)')
  t.equal(x.get([ 'y', 'z3', 'b', 'c', 'd' ]), void 0, 'removed d')

  t.end()
})
