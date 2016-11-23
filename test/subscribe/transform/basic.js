const test = require('tape')
// const subsTest = require('../util')
const struct = require('../../../')

test('subscription - $transform - basic', t => {
  const s = struct({
    collection: {
      a: {
        x: 'hello'
      },
      b: {
        c: 'bye'
      }
    },
    qeury: 'hello'
  })

  const tree = s.subscribe({
    collection: {
      $any: {
        // this has to work differently in the transform unforutately
        // $transform: (t, subs, tree) => {
        //   return { x: { val: true } } // if parse parse results of functions // bit of a waste but fuck it -- make faster later
        // },
        $transform2: {
          val: (t, subs, tree) => {
            console.log('?', t.path())
            if (t.get('root').qeury.compute() === t.get([ 'c', 'compute' ])) {
              console.log('pass')
              return { c: { val: true } }
            }
          },
          c: { val: true },
          root: {
            qeury: { val: true }
          }
        }
      }
    }
  }, (t, type) => {
    console.log('FIRE:', t.path(), type)
  })

  console.log(tree.collection.$any.b.$c)

  console.log(' \nextra!')
  s.qeury.set('bye')

  console.log(' \nmore more!')
  s.qeury.set('blax')

  console.log(' \ncollection.b.c')
  s.collection.b.c.set('blax')

  // console.log(' \nhaha broken!')
  // s.collection.b.c.set('yo qeury')

  t.end()
})
