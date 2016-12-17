import test from 'tape'
import { create } from '../../../lib/'

test('subscription - context - basic', t => {
  var cnt = 0
  var n = 4
  const orig = create({
    types: {
      ha: { bla: 'hello' }
    },
    a: { type: 'ha' }
  })
  orig.subscribe({
    a: { bla: true }
  }, () => {
    cnt++
  })
  for (let i = 0; i < n; i++) {
    orig.types.ha.get('bla').set(i)
  }
  t.equal(cnt, 5, 'fires correct amount')
  t.end()
})

test('subscription - context - basic - remove', t => {
  var results = []
  const s = create({
    types: {
      bla: {
        a: {
          b: {
            c: {
              val: 'ha!'
            }
          }
        }
      },
      collection: {
        props: {
          default: { type: 'bla' }
        }
      }
    },
    collection: { type: 'collection' }
  })

  // s.get([ 'types', 'collection' ]).set([ 1, 2, 3, 4 ])

  s.get([ 'collection' ]).set([ 1, 2, 3, 4 ])

  const listen = (v, t, s, tree) => {
    var p = v.path()
    // go the info right hur
    // tree.$t.context = tree.$tc
    // tree.$t.contextLevel = tree.$tcl || 1
    // var p = v.path()
    // console.log('---->', t === tree.$t, p === tree.$t.path())
    console.log('---->', v.contextLevel, v.context && v.context.path(), v.context.contextLevel)

    // if changed then go and check if its ACTUALLY removed and get rid of it
    // send higher up as well thats smooth
    // if (changes then)

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
    collection: { $any: { a: { b: { c: true } } } }
  }, listen)
  t.same(results, [ '+s2/0/a/b/c', '+s2/1/a/b/c', '+s2/2/a/b/c' ], 'correct initial on instance s2')

  results = []
  s.set({
    types: {
      bla: {
        a: { b: { c: 'WOW' } }
      }
    }
  })
  t.same(results, [ '0/a/b/c', '1/a/b/c', '2/a/b/c', 's2/0/a/b/c', 's2/1/a/b/c', 's2/2/a/b/c' ], 'correct results from context updates')

  results = []

  // context removal....
  s2.set({
    collection: {
      0: null
    }
  })

  console.log(results)

  // this is very weird...
  // t.same(results, [ '-s2/0/a/b/c' ], 'correct context applied on removed item')

  results = []
  s2.set({
    collection: {
      1: null
    }
  })

  console.log(results)

  // t.same(results, [ '-s2/0/a/b/c' ], 'correct context applied on removed item')


  // // console.log(tree.collection.$any.$keys)

  // s2.set({
  //   collection: {
  //     1: {
  //       a: {
  //         b: {
  //           c: 'LULLLZ'
  //         }
  //       }
  //     }
  //   }
  // })

  // console.log(tree)

  // s2.set({
  //   collection: {
  //     0: null
  //   }
  // })

  t.end()
})
