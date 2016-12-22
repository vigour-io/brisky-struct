const test = require('tape')
const { create: struct } = require('../')

test('inject ', t => {
  const a = struct({
    inject (t) {
      t.nastyField = true
    }
  })
  t.equal(a.nastyField, true, 'added normal field using inject function')
  a.set({
    inject: [
      { b: true },
      (t) => {
        t.set({ c: true })
      }
    ]
  })
  t.same(a.keys(), [ 'b', 'c' ], 'inject using array')
  t.end()
})
