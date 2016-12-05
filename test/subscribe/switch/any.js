const test = require('tape')
const subsTest = require('../util')
// const tree = require('../util/tree')

test('subscription - $switch - any', t => {
  const s = subsTest(t, {
    a: 'a',
    b: 'b',
    c: 'c',
    x: { val: true }
  }, {
    $any: {
      $switch: (t, subs, tree) => {
        if (t.compute() === 'a') {
          return { root: { x: { val: true } } }
        } else {
          return false
        }
      }
    }
  })
  s('initial subscription', [ { path: 'x', type: 'new' } ])
  s('rename', [ { path: 'x', type: 'remove' } ], { a: 'c' })
  s('rename', [ { path: 'x', type: 'new' } ], { b: 'a' })
  t.end()
})
