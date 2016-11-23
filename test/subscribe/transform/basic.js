const test = require('tape')
const subsTest = require('../util')
const tree = require('../util/tree')

test('subscription - $transform - basic', t => {
  const s = subsTest(t, {
    collection: {
      a: {
        x: 'hello'
      },
      b: {
        c: 'bye',
        d: 'HA!'
      }
    },
    qeury: 'hello'
  }, {
    collection: {
      $any: {
        $transform: (t, subs, tree) => {
          return { x: { val: true } }
        },
        $transform2: {
          val: (t, subs, tree) => {
            const q = t.get('root').qeury.compute()
            if (q === t.get([ 'c', 'compute' ])) {
              return { c: { val: true }, d: { val: true } }
            } else if (q === 'unicorn') {
              return { root: { unicorn: { val: true } } }
            }
          },
          c: { val: true },
          root: {
            qeury: { val: true }
          }
        }
      }
    }
  })

  const result = s('initial subscription', [ { path: 'collection/a/x', type: 'new' } ])
  const start = tree(result.tree)

  s('update query', [
    { path: 'collection/b/c', type: 'new' },
    { path: 'collection/b/d', type: 'new' }
  ], { qeury: 'bye' })

  s('update query to unicorn', [
    { path: 'collection/b/c', type: 'remove' },
    { path: 'collection/b/d', type: 'remove' }
  ], { qeury: 'unicorn' })

  s('update unicorn', [
    { path: 'unicorn', type: 'new' },
    { path: 'unicorn', type: 'new' }
  ], { unicorn: '🦄' })

  // console.log(result.tree)

  s('update query', [
    { path: 'unicorn', type: 'remove' },
    { path: 'unicorn', type: 'remove' },
    { path: 'collection/b/c', type: 'new' },
    { path: 'collection/b/d', type: 'new' }
  ], { qeury: 'bye' })

  s('update query', [
    { path: 'collection/b/c', type: 'remove' },
    { path: 'collection/b/d', type: 'remove' }
  ], { qeury: 'blax' })

  t.same(start, tree(result.tree), 'equal to start tree (cleared composites')

  s('update collection/b/c', [
    { path: 'collection/b/c', type: 'new' },
    { path: 'collection/b/d', type: 'new' }
  ], { collection: { b: { c: 'blax' } } })

  s('update collection/b/c', [
    { path: 'collection/b/d', type: 'update' }
  ], { collection: { b: { d: 'blurf' } } })

  s('update collection/b/c', [
   { path: 'collection/a/x', type: 'remove' },
   { path: 'collection/b/c', type: 'remove' },
   { path: 'collection/b/d', type: 'remove' }
  ], { collection: null })

  t.same(tree(result.tree), {}, 'empty tree after removal')
  t.end()
})
