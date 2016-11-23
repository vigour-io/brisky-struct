const test = require('tape')
// const subsTest = require('../util')
const struct = require('../../../')

test('subscription - $transform - basic', t => {
  const s = struct({
    a: {
      x: 'hello'
    },
    b: {
      c: 'bye'
    },
    qeury: 'hello'
  })

  s.subscribe({
    $any: {
      // root: {
      //   qeury: {} // wtf??? why this this fire ?????
      // },
      $transform: (t, subs, tree) => {
        return { x: { val: true } } // if parse parse results of functions // bit of a waste but fuck it -- make faster later
      }
    }
  }, (t) => {
    console.log('go go go', t.path())
    console.log('lulllz')
  })

  s.qeury.set('yo qeury')

  t.end()
})
