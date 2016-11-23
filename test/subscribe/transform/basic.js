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

  t.same(start, tree(result.tree), 'equal to start tree')

  // console.log(result.tree)

  // t.same(results, [ { path: [ 'collection', 'a', 'x' ], type: 'new' } ], 'initial')

  // results = []
  // s.qeury.set('bye')

  // results = []
  // s.qeury.set('unicorn')

  // results = []
  // s.set({ unicorn: '🦄' })

  // results = []
  // s.qeury.set('blax')

  // results = []
  // s.collection.b.c.set('blax')

  // results = []
  // s.collection.b.d.set('blax')
  // // s.qeury.set('blurf')
  // // s.collection.b.c.set('blurf')
  // // s.collection.set(null)
  // t.same([
  //   // new
  //   { path: [ 'collection', 'a', 'x' ], type: 'new' },

  //   // query
  //   { path: [ 'collection', 'b', 'c' ], type: 'new' },
  //   { path: [ 'collection', 'b', 'd' ], type: 'new' },

  //   // switch
  //   { path: [ 'collection', 'b', 'c' ], type: 'remove' },
  //   { path: [ 'collection', 'b', 'd' ], type: 'remove' },

  //   // set unicorn
  //   { path: [ 'unicorn' ], type: 'new' },
  //   { path: [ 'unicorn' ], type: 'new' },

  //   // switch
  //   { path: [ 'unicorn' ], type: 'remove' },
  //   { path: [ 'unicorn' ], type: 'remove' },

  //   // change title
  //   { path: [ 'collection', 'b', 'c' ], type: 'new' },
  //   { path: [ 'collection', 'b', 'd' ], type: 'new' },

  //   // update fields
  //   { path: [ 'collection', 'b', 'd' ], type: 'update' },
  //   { path: [ 'collection', 'b', 'c' ], type: 'update' },
  //   { path: [ 'collection', 'a', 'x' ], type: 'remove' },
  //   { path: [ 'collection', 'b', 'c' ], type: 'remove' },
  //   { path: [ 'collection', 'b', 'd' ], type: 'remove' }
  // ], results, 'correct results')
  // t.same(tree(result), {}, 'empty tree after removal')
  t.end()
})
