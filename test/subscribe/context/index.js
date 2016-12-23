const test = require('tape')
const { create } = require('../../../')
const bs = require('brisky-stamp')

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

  s.get([ 'collection' ]).set([ 1, 2, 3, 4 ])

  const listen = (v, t, s, tree) => {
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

  t.same(results, [
    '+0/a/b/c',
    '+1/a/b/c',
    '+2/a/b/c',
    '+3/a/b/c'
  ], 'correct initial')

  const s2 = s.create({ key: 's2' })
  results = []

  s2.subscribe({
    collection: { $any: { a: { b: { c: 'switch' } } } }
  }, listen)
  t.same(results, [
    '+s2/0/a/b/c',
    '+s2/1/a/b/c',
    '+s2/2/a/b/c',
    '+s2/3/a/b/c'
  ], 'correct initial on instance s2')

  results = []
  s.set({
    types: {
      bla: {
        a: { b: { c: 'WOW' } }
      }
    }
  })

  t.same(results, [
    '0/a/b/c',
    '1/a/b/c',
    '2/a/b/c',
    '3/a/b/c'
    // 's2/0/a/b/c', (since switch)
    // 's2/1/a/b/c',
    // 's2/2/a/b/c',
    // 's2/3/a/b/c'
  ], 'correct results from context updates')

  results = []

  // context removal....
  s2.set({
    collection: {
      0: null
    }
  })

  t.same(results, [
    's2/1/a/b/c',
    's2/2/a/b/c',
    's2/3/a/b/c',
    '-s2/3/a/b/c'
  ], 'correct results from context removal')

  results = []
  s2.set({
    collection: {
      1: null
    }
  })

  t.same(results, [
    's2/2/a/b/c',
    's2/3/a/b/c',
    '-s2/3/a/b/c'
  ], 'correct results from context removal')

  results = []
  s.set({
    types: {
      collection: {
        'WOW': {}
      }
    }
  })

  t.same(results, [
    '+WOW/a/b/c',
    '+s2/WOW/a/b/c'
  ], 'correct results from context update on collection')

  t.end()
})

test('subscription - context - basic - switch', t => {
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
        },
        a: 'a',
        b: 'b',
        c: 'c'
      }
    },
    collection: { type: 'collection' }
  })

  const listen = (v, t, s, tree) => {
    var p = v.path().join('/')
    results.push(t === 'remove' ? '-' + p : t === 'new' ? '+' + p : p)
  }

  s.subscribe({
    collection: { $any: 'switch' }
  }, listen)

  t.same(results, [ '+collection/a', '+collection/b', '+collection/c' ])

  const s2 = s.create({ key: 's2' })
  s2.subscribe({
    collection: { $any: true }
  }, listen)

  results = []
  s.get([ 'types', 'collection', 'b' ]).set(null)
  t.same(results, [ 'collection/c', '-collection/c', 's2/collection/c', '-s2/collection/c' ], 'fires update for switch')

  results = []
  s.get([ 'types', 'bla', 'a', 'b', 'c' ]).set('hello')
  t.same(results, [
    's2/collection/a',
    's2/collection/c'
  ], 'fires update for deep update')
  t.end()
})

test('subscription - context - basic - override', t => {
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
        },
        a: 'a',
        b: 'b',
        c: 'c'
      },
      dirt: {
        x: {
          y: {
            z: {
              props: {
                default: { type: 'bla' }
              },
              bla: {}
            }
          }
        }
      }
    },
    collection: { type: 'collection' },
    dirt: { type: 'dirt' }
  })

  const listen = (v, t, s, tree) => {
    var p = v.path().join('/')
    results.push(t === 'remove' ? '-' + p : t === 'new' ? '+' + p : p)
  }

  s.subscribe({
    collection: { $any: 'switch' }
  }, listen)

  t.same(results, [ '+collection/a', '+collection/b', '+collection/c' ])

  const s2 = s.create({ key: 's2' })
  s2.subscribe({
    collection: {
      $any: true
    },
    dirt: true
  }, listen)

  results = []
  s.get([ 'types', 'bla', 'a', 'b', 'c' ]).set({
    val: 'ha!',
    stamp: bs.create(false, false, 1)
  }, bs.create('override', false, 2))
  bs.close()

  t.same(results, [
    's2/collection/a',
    's2/collection/b',
    's2/collection/c',
    's2/dirt'
  ], 'fires update for deep update')
  t.end()
})
