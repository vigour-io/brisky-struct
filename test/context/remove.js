import test from 'tape'
import { create as struct } from '../../lib/'

test('context - remove', t => {
  var results = []

  const a = struct({
    key: 'a',
    b: {
      c: {
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

  const x = struct({ //eslint-disable-line
    props: { default: a },
    y: {}
  })

  a.get([ 'b', 'c' ]).set(null, 'stamp')

  t.same(
    results, [ [ 'y', 'b', 'c' ], [ 'a', 'b', 'c' ] ],
    'fired correct results (context remove)'
  )

  t.end()
})

test('context - remove', t => {
  var results = []

  const a = struct({
    val: 'a',
    on: (val, stamp, t) => results.push(t.path())
  })

  const x = struct({
    key: 'x',
    props: { b: a },
    b: {}
  })

  const xInstance = x.create({ // eslint-disable-line
    key: 'xInstance'
  })

  const aInstance = a.create({ // eslint-disable-line
    key: 'aInstance'
  })

  const z = struct({
    key: 'z',
    props: { x2: x },
    x2: {}
  })

  const zInstance = z.create({ // eslint-disable-line
    key: 'zInstance'
  })

  const c = struct({ // eslint-disable-line
    key: 'c',
    x: {
      props: { z2: z },
      z2: {}
    }
  })

  z.set({
    x2: {
      b: null
    }
  })

  console.log('results', results)

  t.same(
    results,
    [
      [ 'z', 'x2', 'b' ],
      [ 'c', 'x', 'z2', 'x2', 'b' ],
      [ 'zInstance', 'x2', 'b' ]
    ], // this is shit //  [ 'xInstance', 'b' ]
    'fires for all instances'
  )

  t.end()
})
