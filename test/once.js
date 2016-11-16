const test = require('tape')
const struct = require('../')

test('once ', t => {
  const a = struct()
  a.once()
  .then(() => a.once('hello'))
  .then(() => {
    a.once(void 0, () => {
      t.pass('fires with callbacks, with checks and without')
      t.end()
    })
    a.set('ha!', 'stamp-2')
  })
  a.set('a', 'stamp')
  setTimeout(() => a.set('hello', 'stamp-1'))
})
