const test = require('tape')
const { create: struct } = require('../../')

test('context - resolve - simple', t => {
  var results = []

  const a = struct({
    key: 'a',
    b: {
      c: {
        d: {},
        on: {
          data: {
            results: (val, stamp, t) => {
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
  const resolved = zC.set('haha', 'stamp-1')
  t.not(resolved, zC, 'resolved context (level 2)')
  t.same(results, [ [ 'x', 'y', 'z', 'b', 'c' ] ], 'fired correct listeners')
  t.equal(zC.context, null, 'cleared context on resolve')
  t.equal(zC.contextLevel, null, 'cleared contextLevel on resolve')

  const z2B = x.get([ 'y', 'z2', 'b' ])
  const resolved2 = z2B.set('haha', 'stamp-2')
  t.not(resolved2, z2B, 'resolved context (level 1)')

  const z3D = x.get([ 'y', 'z3', 'b', 'c', 'd' ])
  const resolved3 = z3D.set(null, 'stamp')
  t.equal(resolved3, null, 'returns null from context remove')
  t.not(resolved3, z3D, 'resolved context (level 3)')
  t.equal(x.get([ 'y', 'z3', 'b', 'c', 'd' ]), void 0, 'removed d')

  t.end()
})

test('context - resolve - multiple', t => {
  var results = []

  const a = struct({
    key: 'a',
    b: {
      on: {
        data: {
          results: (val, stamp, t) => results.push(t.path())
        }
      },
      c: {
        d: {
          on: {
            data: {
              results: (val, stamp, t) => results.push(t.path())
            }
          }
        }
      }
    }
  })

  const x = struct({
    key: 'x',
    y: {
      on: {
        data: {
          results: (val, stamp, t) => results.push(t.path())
        }
      },
      props: {
        default: a
      },
      z: {}
    }
  })

  const x2 = struct({
    key: 'x2',
    y2: {
      props: { default: x },
      on: {
        data: {
          results: (val, stamp, t) => results.push(t.path())
        }
      },
      z2: {}
    }
  })

  const x3 = struct({
    key: 'x3',
    y3: {
      props: { default: x2 },
      z3: {}
    }
  })

  a.b.c.d.set('haha')
  t.same(results, [
    [ 'x', 'y', 'z', 'b', 'c', 'd' ],
    [ 'x2', 'y2', 'z2', 'y', 'z', 'b', 'c', 'd' ],
    [ 'x3', 'y3', 'z3', 'y2', 'z2', 'y', 'z', 'b', 'c', 'd' ],
    [ 'a', 'b', 'c', 'd' ]
  ], 'fires all contexts when original updates')

  results = []
  const z3D = x3.get([ 'y3', 'z3', 'y2', 'z2', 'y', 'z', 'b', 'c', 'd' ])
  z3D.set({ bla: true })
  t.same(
    results, [ [ 'x3', 'y3', 'z3', 'y2', 'z2', 'y', 'z', 'b', 'c', 'd' ] ],
    'fires for resolved context'
  )

  t.same(a.b.c.context, null, 'cleared context on "a.b.c"')
  t.same(x.y.context, null, 'cleared context on "x.y"')
  t.same(x2.y2.context, null, 'cleared context on "x2.y2"')

  results = []
  a.get([ 'b', 'c', 'd' ]).set('ha!')

  t.same(results, [
    [ 'x', 'y', 'z', 'b', 'c', 'd' ],
    [ 'x2', 'y2', 'z2', 'y', 'z', 'b', 'c', 'd' ],
    [ 'a', 'b', 'c', 'd' ],
    [ 'x3', 'y3', 'z3', 'y2', 'z2', 'y', 'z', 'b', 'c', 'd' ] // instance update
  ], 'fires all contexts and instance when original updates')

  results = []
  a.get([ 'b', 'c', 'd' ]).set({ bla: 'nice' })
  t.same(results, [
    [ 'x', 'y', 'z', 'b', 'c', 'd' ],
    [ 'x2', 'y2', 'z2', 'y', 'z', 'b', 'c', 'd' ],
    [ 'a', 'b', 'c', 'd' ]
  ], 'fires all contexts when original updates not for instance (same)')

  results = []
  x3.get([ 'y3', 'z3', 'y2', 'z2', 'y', 'z', 'b', 'c', 'd' ]).set('myself!', false)

  a.get([ 'b', 'c', 'd' ]).set('yo yo yo')
  t.same(results, [
    [ 'x', 'y', 'z', 'b', 'c', 'd' ],
    [ 'x2', 'y2', 'z2', 'y', 'z', 'b', 'c', 'd' ],
    [ 'a', 'b', 'c', 'd' ]
  ], 'fires all contexts when original updates not for has its own')

  t.end()
})
