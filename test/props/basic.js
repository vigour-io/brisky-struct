'use strict'

const test = require('tape')
const { create, set, get, struct, compute, parent } = require('../../')

test('props - default', t => {
  const s = create(struct, {
    props: {
      something: true
    },
    something: 'wrong'
  })

  t.equal(get(s, 'something'), 'wrong', 'something is wrong')
  t.end()
})

test('props - function', t => {
  const s = create(struct, {
    props: {
      speed (s, val) {
        set(s, { fast: val > 50 })
      }
    },
    speed: 40
  })

  t.equal(compute(get(s, 'fast')), false, 'not fast yet')

  set(s, { speed: 60 })

  t.equal(compute(get(s, 'fast')), true, 'now fast')
  t.end()
})

test('props - nested', t => {
  const s = create(struct, {
    props: {
      parent: {
        child: 'rebel'
      }
    }
  })

  set(s, { parent: 'conservative' })

  t.equal(compute(get(s, 'parent')), 'conservative', 'parent is conservative')
  t.equal(compute(get(s, ['parent', 'child'])), 'rebel', 'child is rebel')
  t.end()
})

test('props - default', t => {
  const s = create(struct, {
    props: {
      default: {
        props: {
          _volume (s, val) {
            set(s, {
              volume: val,
              mass: compute(get(s, 'density')) * val
            })
          },
          _mass (s, val) {
            set(s, {
              volume: val / compute(get(s, 'density')),
              mass: val
            })
          }
        },
        density: 1
      }
    },
    water: {
      melting: 0
    },
    gold: {
      density: 19.3,
      melting: 1064.18
    }
  })

  t.equal(compute(get(s, ['water', 'density'])), 1, 'density of water is 1')
  set(s, { gold: { density: 19.3, melting: 1064.18 } })
  t.equal(compute(get(s, ['gold', 'density'])), 19.3, 'density of gold is 19.3')
  set(s, { water: { _volume: 10 } })
  set(s, { gold: { _mass: 193 } })
  t.equal(compute(get(s, ['water', 'mass'])), 10, 'mass of water is 10')
  t.equal(compute(get(s, ['gold', 'volume'])), 10, 'volume of gold is 10')

  t.end()
})
