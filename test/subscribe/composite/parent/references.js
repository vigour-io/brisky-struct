'use strict'
const test = require('tape')
const subsTest = require('../../util')

test(`subscription - composite - parent - references`, t => {
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
  s('set root/d', [], { d: 'hello!' })
  s('fire for a/b/d', [ { path: 'a/b/d', type: 'update' } ], { a: { b: { d: 'no!' } } })
  t.end()
})

test(`subscription - composite - parent - references - double`, t => {
  const s = subsTest(
    t,
    {
      bla: {
        x: {
          val: 'its x'
        },
        d: 'xxxx'
      },
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
    {
      a: {
        b: {
          c: {
            deep: {
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
  )
  s('initial subscription', [ { path: 'lulz/b/d', type: 'new' } ])
  t.end()
})

