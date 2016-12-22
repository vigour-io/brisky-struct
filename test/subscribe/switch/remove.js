const test = require('tape')
const subsTest = require('../util')

test('subscription - $switch - block remove', t => {
  const s = subsTest(t, {
    field: [ '@', 'parent', 'x' ],
    x: {
      y: {
        z: 'hello'
      }
    }
  }, {
    field: {
      $switch: (t, subs, tree) => {
        if (t.origin().get('key') === 'x') {
          return { y: { z: { val: true } }, $blockRemove: true }
        } else {
          return false
        }
      }
    }
  })
  s('initial subscription', [ { path: 'x/y/z', type: 'new' } ])

  s('switch', [], { field: [ '@', 'root', 'bla' ] })

  t.end()
})
