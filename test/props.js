const test = require('tape')
const struct = require('../')

test('props - normal field', t => {
  const s = struct({
    props: {
      something: true
    },
    something: 'wrong'
  })
  t.equal(s.get('something'), 'wrong', 'something is wrong')
  t.end()
})

test('props - remove', t => {
  const s = struct({
    props: { something: true },
    something: 'wrong'
  })
  const instance = s.create({
    props: { something: null },
    something: true
  })
  t.equal(
    instance.get('something').compute(), true,
    'instance "something" is a struct (overrides prop definition)'
  )
  t.end()
})

test('props - function', t => {
  const s = struct({
    props: {
      default: {
        props: {
          _volume (s, val) {
            s.set({
              volume: val,
              mass: s.get('density').compute() * val
            })
          },
          _mass (s, val) {
            s.set({
              volume: val / s.get('density').compute(),
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
  t.equal(s.get(['water', 'density']).compute(), 1, 'density of water is 1')
  s.set({ gold: { density: 19.3, melting: 1064.18 } })
  t.equal(s.get(['gold', 'density']).compute(), 19.3, 'density of gold is 19.3')
  s.set({ water: { _volume: 10 } })
  s.set({ gold: { _mass: 193 } })
  t.equal(s.get(['water', 'mass']).compute(), 10, 'mass of water is 10')
  t.equal(s.get(['gold', 'volume']).compute(), 10, 'volume of gold is 10')
  t.end()
})
