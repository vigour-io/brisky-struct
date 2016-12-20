import test from 'tape'
import { create as struct } from '../lib/'

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
    a.set('ha!', 'stamp-2')
  })
  a.set('a', 'stamp')
  a.once('a', (val, stamp, struct) => {
    t.ok('inherits' in struct, 'struct is 3rd argument')
  })
  a.once(t => {
    return t.compute() === 'a'
  }, (val, stamp, struct) => {
    t.ok('inherits' in struct, 'struct is 3rd argument')
  })
  setTimeout(() => a.set('hello', 'stamp-1'))
})

test('once -context', t => {
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
  a.create()
  b.get('connected').once(true, (val, stamp, struct) => {
    if (!struct.context) {
      t.end()
    }
  })
  b.get('connected').set(true)
})
