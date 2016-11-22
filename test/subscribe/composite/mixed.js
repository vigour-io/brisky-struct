'use strict'
const test = require('tape')
const subsTest = require('../util')

test(`subscription - composite - parent - root`, t => {
  const s = subsTest(
    t,
    {
      bla: {},
      x: { a: {} },
      b: {
        d: 'yes',
        c: {}
      }
    },
    {
      x: {
        a: {
          root: {
            b: {
              c: {
                parent: { d: { val: true } }
              }
            }
          }
        }
      }
    }
  )
  const r = s('initial subscription', [ { path: 'b/d', type: 'new' } ])
  t.equal('$c' in r.tree.x, true, 'has $c')
  s('remove x.a', [ { path: 'b/d', type: 'remove' } ], { x: { a: null } })
  t.equal('$c' in r.tree.x, false, 'remove $c')
  t.end()
})

test('subscription - composite - parent - root - references', t => {
  const s = subsTest(
    t,
    {
      bla: {
        x: 'its x',
        d: 'xxxx'
      },
      y: 'hello',
      z: {},
      x: {
        a: {},
        bla: { blurf: {}, b: {} },
        c: { d: {} }
      },
      b: {
        c: {
          deep: [ '@', 'root', 'bla', 'x' ]
        },
        d: 'yes!'
      }
    },
    {
      x: {
        bla: {
          blurf: {
            parent: {
              b: {
                parent: {
                  parent: {
                    c: {
                      d: {
                        root: {
                          // y: { val: true },
                          z: { parent: { y: { val: true } } }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
        // a: {
        //   root: {
        //     b: {
        //       c: {
        //         deep: {
        //           val: true,
        //           parent: {
        //             parent: {
        //               d: { val: true }
        //             }
        //           }
        //         }
        //       }
        //     }
        //   }
        // }
      }
    }
  )

  const r = s('initial subscription', [
    { path: 'y', type: 'new' }
    // { path: 'b/c/deep', type: 'new' },
    // { path: 'b/d', type: 'new' }
  ])

  s('update b/d', [
    // { path: 'b/c/deep', type: 'update' }
  ], { bla: { x: 'wow!' } })

  s('update y', [
    { path: 'y', type: 'update' }
  ], { y: 'wow!' })

  // t.same(r.tree.x.$c, { a: true, b: true }, 'correct $c')

  console.log('1', r.tree)

  // s('remove x/c/d', [
  //   { path: 'y', type: 'remove' }
  // ], { x: { c: { d: null } } })
  // console.log('2', r.tree)

  // // t.same(r.tree.x.$c, { a: true }, 'remove b correct $c')
  // // console.log('1', r.tree)


  // // console.log( '\n go go go go')

  // s('remove x/bla/b', [
  //   { path: 'y', type: 'remove' }
  // ], { x: { bla: { b: null } } })
  // console.log('3', r.tree)

  // s('remove x/bla/b', [
  //   { path: 'y', type: 'remove' }
  // ], { x: { bla: { b: {} } } })
  // console.log('2', r.tree)

  // s('remove x/b', [
  //   { path: 'y', type: 'remove' }
  // ], { x: { bla: null } })
  // console.log('4', r.tree)

  // console.log('remove dat', r.tree)

  // s('add x/c/d', [
  //   { path: 'y', type: 'new' }
  // ], { x: { c: { d: {} } } })

  // console.log(r.tree)

  // s('remove x/c/d', [
  //   { path: 'y', type: 'remove' }
  // ], { x: { c: { d: null } } })

  // s('remove b/c/deep', [
  //   { path: 'b/c/deep', type: 'remove' },
  //   { path: 'b/d', type: 'remove' }
  // ], { b: { c: { deep: null } } })

  // s('remove b/c/deep', [], { x: { a: null } })

  // t.same(r.tree.x.$c, void 0, 'removed x $c')

  t.end()
})
