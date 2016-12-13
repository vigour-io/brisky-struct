const test = require('tape')
const subsTest = require('../util')

// add simple array methods for collection -- where you handle the keys
// also lets handle resort a bit later (by using indexes in the tree as keys)
test('subscription - any - filter', t => {
  subsTest(
    t,
    {
      collection: {
        a: true,
        b: true,
        c: true
      }
    },
    {
      collection: {
        $any: { val: true }
      }
    }
  )
  t.end()
})
