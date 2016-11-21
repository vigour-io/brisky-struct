const test = require('tape')
const subsTest = require('../../util')
const field = require('../../util/field')

module.exports = type => {
  test(`subscription - composite - ${type}`, t => {
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
      field({
        top: {
          b: {
            c: {
              d: {
                $parent: {
                  val: true,
                  $parent: {
                    $parent: {
                      a: { val: true }
                    }
                  }
                }
              }
            }
          }
        }
      }, type, '$parent')
    )
    const r = s('initial subscription', [ { path: 'top/a', type: 'new' } ])

    // for normal parent allways needs to flavour tree
    t.equal('$c' in r.tree.top, type === 'parent', 'correct $c in top')

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

  test(`subscription - composite - ${type} - type`, t => {
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
      field({
        a: {
          b: {
            c: {
              $parent: {
                d: { val: true }
              }
            }
          }
        }
      }, type, '$parent')
    )
    s('initial subscription', [ { path: 'a/b/d', type: 'new' } ])
    t.end()
  })

  test(`subscription - composite - ${type} - $any`, t => {
    const s = subsTest(
      t,
      {
        collection: {
          a: true,
          b: true
        }
      },
      field({
        collection: {
          $any: {
            $parent: {
              $parent: {
                focus: { val: true }
              }
            }
          }
        }
      }, type, '$parent')
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
}
