'use strict'
const test = require('tape')
const subsTest = require('../util')
const tree = require('../util/tree')

test(`subscription - composite - mixed`, t => {
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

test('subscription - composite - mixed - references', t => {
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
        bla: {
          blurf: {},
          gur: {
            b: {},
            x: {}
          }
        },
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
              gur: {
                x: { root: { z: { val: true } } },
                b: {
                  parent: {
                    parent: {
                      parent: {
                        c: {
                          d: {
                            root: {
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
          }
        },
        a: {
          root: {
            b: {
              c: {
                deep: {
                  val: true,
                  parent: {
                    parent: {
                      d: { val: true }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  )

  const r = s('initial subscription', [
    { path: 'z', type: 'new' },
    { path: 'y', type: 'new' },
    { path: 'b/c/deep', type: 'new' },
    { path: 'b/d', type: 'new' }
  ])

  const start = tree(r.tree)

  s('update b/d', [ { path: 'b/c/deep', type: 'update' } ], { bla: { x: 'wow!' } })
  s('update y', [ { path: 'y', type: 'update' } ], { y: 'wow!' })
  s('update z', [ { path: 'z', type: 'update' } ], { z: 'wow!' })

  t.same(r.tree.x.$c, { a: 'root', bla: 'root' }, 'correct $c')

  s(
    'remove x/c/d',
    [ { path: 'y', type: 'remove' } ],
    { x: { c: { d: null } } }
  )

  s(
    'remove x/bla/gur/x',
    [ { path: 'z', type: 'remove' } ],
    { x: { bla: { gur: { x: null } } } }
  )

  s('remove x/a', [
    { path: 'b/c/deep', type: 'remove' },
    { path: 'b/d', type: 'remove' }
  ], { x: { a: null } })

  const empty = {
    x: {
      bla: {
        blurf: {
          parent: {
            gur: {
              $c: {
                b: 'parent'
              },
              b: {
                parent: {
                  parent: {
                    parent: {
                      c: {}
                    }
                  }
                },
                $c: {
                  parent: 'parent'
                }
              }
            }
          },
          $c: {
            parent: 'parent'
          }
        },
        $c: {
          blurf: 'parent'
        }
      }
    }
  }
  t.same(tree(r.tree), empty, 'removed root composites')

  s('add x/c/d', [
    { path: 'y', type: 'new' }
  ], { x: { c: { d: {} } } })

  s('add x/bla/gur/x', [
    { path: 'z', type: 'new' }
  ], { x: { bla: { gur: { x: true } } } })

  s('add x/a', [
    { path: 'b/c/deep', type: 'new' },
    { path: 'b/d', type: 'new' }
  ], { x: { a: {} } })

  t.same(tree(r.tree), start, 'same as start')

  t.end()
})
