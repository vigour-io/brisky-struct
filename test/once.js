import test from 'tape'
import { create as struct } from '../lib/'
import bs from 'brisky-stamp'

test('once ', t => {
  const a = struct()
  a.once()
  .then(() => a.once('hello'))
  .then(() => {
    a.once(void 0, (val, stamp, struct) => {
      t.ok('inherits' in struct, 'struct is 3rd argument')
      t.pass('promise, callback')
      t.end()
    })
    a.set('ha!')
  })
  a.set('a')
  a.once('a', (val, stamp, struct) => {
    t.ok('inherits' in struct, 'struct is 3rd argument')
  })
  a.once(t => {
    return t.compute() === 'a'
  }, (val, stamp, struct) => {
    t.ok('inherits' in struct, 'struct is 3rd argument')
  })
  setTimeout(() => a.set('hello'))
})

test('once - context', t => {
  const o = struct({
    props: {
      default: 'self',
      connected: { type: 'struct' }
    }
  })
  const a = o.create({
    b: {
      connected: false
    }
  })
  const b = a.b
  const weird = a.b.connected.create()  //eslint-disable-line
  const weird2 = a.b.connected.create()  //eslint-disable-line
  var cnt = 0

  const c = a.create({ key: 'c' }) //eslint-disable-line

  b.get('connected').once('jurx', (val, stamp, struct) => {})

  b.get('connected').on(() => {
    cnt++
  }, 'O2222')

  b.get('connected').once('jurx', (val, stamp, struct) => {
    t.equal(cnt, 4)
  })

  b.get('connected').once('jurx', (val, stamp, struct) => {
    t.equal(cnt, 4)
    a.get([ 'b', 'connected' ]).set(true)
  })

  b.get('connected').once(true, (val, stamp, struct) => {
    t.pass('correct set and resolvement')
    t.end()
  })

  b.get('connected').once('jurx', (val, stamp, struct) => {})

  a.get([ 'b', 'connected' ]).set('jurx')
})
