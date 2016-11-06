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
  t.end()
})
