const test = require('tape')
const struct = require('../../')

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
