import test from 'tape'
import { create as struct } from '../../../lib/'

test('subscription - context - basic', t => {
  var results = []
  const s = struct({
    types: {
      bla: {
        a: {
          b: {
            c: {
              val: 'ha!',
              // on: (v, s, t) => {
              //   console.log(t.path().slice(1).join('/'))
              // }
            }
          }
        }
      }
    },
    collection: {
      props: {
        default: { type: 'bla' }
      }
    }
  })

  s.collection.set([ 1, 2, 3 ])

  const listen = (v, t) => {
    var p = v.path()
    if (p[0] === 's2') {
      p.splice(1, 1)
    } else {
      p = p.slice(1)
    }
    p = p.join('/')
    results.push(t === 'remove' ? '-' + p : t === 'new' ? '+' + p : p)
  }

  s.subscribe({
    collection: {
      $any: {
        a: {
          b: {
            c: true
          }
        }
      }
    }
  }, listen)

  t.same(results, [ '+0/a/b/c', '+1/a/b/c', '+2/a/b/c' ], 'correct initial')

  const s2 = s.create({ key: 's2' })
  results = []
  s2.subscribe({
    collection: { 0: { a: { b: { c: true } } } }
  }, listen)
  t.same(results, [ '+s2/0/a/b/c' ], 'correct initial on instance s2')

  results = []
  s.set({
    types: {
      bla: {
        a: { b: { c: 'WOW' } }
      }
    }
  })
  t.same(results, [ '0/a/b/c', '1/a/b/c', '2/a/b/c', 's2/0/a/b/c' ], 'correct results from context updates')

  results = []

  // context removal....
  s2.set({
    collection: {
      0: null
    }
  })
  console.log(results)

  t.end()
})
