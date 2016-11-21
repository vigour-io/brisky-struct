'use strict'
const test = require('tape')
const subsTest = require('../../util')
const field = require('../../util/field')

module.exports = type => {
  test(`subscription - composite - ${type} - references`, t => {
    const s = subsTest(
      t,
      {
        bla: {},
        a: {
          b: {
            c: [ '@', 'root', 'bla' ],
            d: 'yes!'
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

    if (type === '$parent') {
      s('initial subscription', [ { path: 'a/b/d', type: 'new' } ])
      s('set root/d', [], { d: 'hello!' })
      s('fire for a/b/d', [ { path: 'a/b/d', type: 'update' } ], { a: { b: { d: 'no!' } } })
    } else if (type === 'parent') {
      s('initial subscription', [ { path: 'a/b/d', type: 'new' } ])
      // s('fire for root/d', [ { path: 'd', type: 'new' } ], { d: 'hello!' })
      s('fire for removing c', [ { path: 'a/b/d', type: 'update' } ], { a: { b: { c: false } } })
      s('fire for a/b/d', [ { path: 'a/b/d', type: 'update' } ], { a: { b: { d: 'no!' } } })
    }
    t.end()
  })

  test(`subscription - composite - ${type} - references - double`, t => {
    const s = subsTest(
      t,
      {
        bla: {
          x: {
            val: 'its x'
          },
          d: 'xxxx'
        },
        // shoudl work with $. -- strange make tests
        a: [ '@', 'root', 'lulz' ],
        lulz: {
          b: {
            c: {
              deep: [ '@', 'root', 'bla', 'x' ]
            },
            d: 'yes!'
          }
        }
      },
      field({
        a: {
          b: {
            c: {
              deep: {
                $parent: {
                  $parent: {
                    d: { val: true }
                  }
                }
              }
            }
          }
        }
      }, type, '$parent')
    )
    if (type === '$parent') {
      s('initial subscription', [ { path: 'lulz/b/d', type: 'new' } ])
    } else if (type === 'parent') {
      s('initial subscription', [])
      s('fire for $root.d', [ { path: 'd', type: 'new' } ], { d: 'hello!' })
    }
    t.end()
  })
}
