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
        $transform: (t, subs, tree) => {
          return { x: { val: true } } // if parse parse results of functions // bit of a waste but fuck it -- make faster later
        },
        $transform2: {
          val: (t, subs, tree) => {
            console.log('blurrrr')
            return { c: { val: true } } // if parse parse results of functions // bit of a waste but fuck it -- make faster later
          },
          root: {
            qeury: { val: true }
          }
        }
      }
    }
  }, (t) => {
    console.log('FIRE:', t.path())
  })

  console.log(tree.collection.$any.b.$c)

  console.log(' \nextra!')
  s.qeury.set('yo qeury')

  t.end()
})
