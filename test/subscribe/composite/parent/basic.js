const test = require('tape')
const subsTest = require('../../util')

test(`subscription - composite - parent`, t => {
  const s = subsTest(
    t,
    {
      sibbling: {
        text: true
      },
      top: {
        a: 'its d!',
        b: {
          c: {
            d: {}
          }
        }
      }
    },
    {
      top: {
        b: {
          c: {
            d: {
              parent: {
                val: true,
                parent: {
                  parent: {
                    a: { val: true }
                  }
                }
              }
            }
          }
        }
      }
    }
  )
  const r = s('initial subscription', [ { path: 'top/a', type: 'new' } ])

  t.equal('$c' in r.tree.top, false, 'correct $c in top')

  t.equal(
    '$c' in r.tree.top.b && 'c' in r.tree.top.b.$c,
    true,
    'got b in top/a/$c'
  )

  s('update top/a', [
    { path: 'top/a', type: 'update' }
  ], { top: { a: 'its more a!' } })

  s('remove top/b/c/d',
    [ { path: 'top/a', type: 'remove' } ],
    { top: { b: { c: { d: null } } }
  })
  t.end()
})

test(`subscription - composite - parent - type`, t => {
  const s = subsTest(
    t,
    {
      types: {
        swag: {
          val: ''
        }
      },
      a: {
        b: {
          d: 'yes!',
          c: {
            type: 'swag'
          }
        }
      }
    },
    {
      a: {
        b: {
          c: {
            parent: {
              d: { val: true }
            }
          }
        }
      }
    }
  )
  s('initial subscription', [ { path: 'a/b/d', type: 'new' } ])
  t.end()
})

test(`subscription - composite - parent - $any`, t => {
  const s = subsTest(
    t,
    {
      collection: {
        a: true,
        b: true
      }
    },
    {
      collection: {
        $any: {
          parent: {
            parent: {
              focus: { val: true }
            }
          }
        }
      }
    }
  )

  s('initial subscription', [], {})

  s(
    'create a collection',
    [
      { path: 'focus', type: 'new' },
      { path: 'focus', type: 'new' }
    ],
    { focus: true }
  )
  t.end()
})

