const test = require('tape')
const subsTest = require('../util')

test('subscription - $switch - references', t => {
  const s = subsTest(t, {
    a: { a: 'hello' },
    b: { a: 'hello' },
    field: [ '@', 'root', 'a' ]
  }, {
    field: {
      $switch: (t, subs, tree) => {
        // in render this will allways have $blockRemove (make sure thats true ;))
        return { a: { val: true } }
      }
    }
  })

  s('initial subscription', [ { path: 'a/a', type: 'new' } ])

  s('switch reference', [
    { path: 'a/a', type: 'remove' },
    { path: 'b/a', type: 'new' }
  ], { field: [ '@', 'root', 'b' ] })

  t.end()
})
