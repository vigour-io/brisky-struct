const test = require('tape')
const struct = require('../')

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
