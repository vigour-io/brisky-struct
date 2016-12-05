const test = require('tape')
const subsTest = require('../util')
const tree = require('../util/tree')

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
  const r = s('initial subscription', [ { path: 'x', type: 'new' } ])
  t.same(tree(r.tree).$any.$c, { a: 'root' }, 'correct composite')
  s('rename', [ { path: 'x', type: 'remove' } ], { a: 'c' })
  t.same(tree(r.tree).$any.$c, void 0, 'removed composite')
  s('rename', [ { path: 'x', type: 'new' } ], { b: 'a' })
  t.same(tree(r.tree).$any.$c, { b: 'root' }, 'correct composite')
  t.end()
})
