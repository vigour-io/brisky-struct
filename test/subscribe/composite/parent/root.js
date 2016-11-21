'use strict'
const test = require('tape')
const subsTest = require('../../util')
const field = require('../../util/field')

module.exports = type => {
  test(`subscription - composite - ${type} - root`, t => {
    const s = subsTest(
      t,
      {
        bla: {},
        a: {},
        b: {
          d: 'yes',
          c: {}
        }
      },
      field({
        a: {
          root: {
            b: {
              c: {
                $parent: {
                  d: { val: true }
                }
              }
            }
          }
        }
      }, type, '$parent')
    )
    const r = s('initial subscription', [ { path: 'b/d', type: 'new' } ])
    console.log(r.tree)
    // s('update b/d', [ { path: 'b/d', type: 'update' } ], { b: { d: 'x' } })
    t.end()
  })
}
