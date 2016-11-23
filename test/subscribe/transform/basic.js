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
    query: 'hello'
  }, {
    collection: {
      $any: {
        $transform: (t, subs, tree) => {
          return { x: { val: true } }
        },
        $transform2: {
          val: (t, subs, tree) => {
            const q = t.get('root').query.compute()
            if (q === t.get([ 'c', 'compute' ])) {
              return { c: { val: true }, d: { val: true } }
            } else if (q === 'unicorn') {
              return { root: { unicorn: { val: true } } }
            }
          },
          c: { val: true },
          root: {
            query: { val: true }
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
  ], { query: 'bye' })

  s('update query to unicorn', [
    { path: 'collection/b/c', type: 'remove' },
    { path: 'collection/b/d', type: 'remove' }
  ], { query: 'unicorn' })

  s('update unicorn', [
    { path: 'unicorn', type: 'new' },
    { path: 'unicorn', type: 'new' }
  ], { unicorn: '🦄' })

  s('update query', [
    { path: 'unicorn', type: 'remove' },
    { path: 'unicorn', type: 'remove' },
    { path: 'collection/b/c', type: 'new' },
    { path: 'collection/b/d', type: 'new' }
  ], { query: 'bye' })

  s('update query', [
    { path: 'collection/b/c', type: 'remove' },
    { path: 'collection/b/d', type: 'remove' }
  ], { query: 'blax' })

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

test('subscription - $transform - nested', t => {
  const s = subsTest(t, {
    collection: {
      a: {
        val: 'hello',
        hello: 'hello',
        unicorn: 'not a unicorn'
      },
      b: {
        val: 'hello',
        hello: 'hello',
        unicorn: '🦄'
      }
    },
    query: 'hello'
  }, {
    collection: {
      $any: {
        $transform: (t, subs, tree) => {
          console.log(t.val)
          if (t.val === 'unicorn') {
            return {
              hello: {
                parent: {
                  unicorn: {
                    $transform: t => {
                      if (t.val === '🦄') {
                        console.log('transform passes')
                        return { val: true } // this is a bit shitty
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  })

  const result = s('initial subscription', [])
  const start = tree(result.tree)

  s('update query', [ ':/' ], {
    collection: { b: 'unicorn' }
  })

  t.end()
})
