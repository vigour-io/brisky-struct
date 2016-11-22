'use strict'
const test = require('tape')
const subsTest = require('../../util')

test(`subscription - composite - parent - root`, t => {
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
    {
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
  )
  s('initial subscription', [ { path: 'b/d', type: 'new' } ])
  t.end()
})

test('parent - references - combined', function (t) {
  const s = subsTest(
    t,
    {
      bla: {
        x: 'its x',
        d: 'xxxx'
      },
      a: {},
      b: {
        c: {
          deep: [ '@', 'root', 'bla', 'x' ]
        },
        d: 'yes!'
      }
    },
    {
      a: {
        root: {
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
    }
  )
  s('initial subscription', [ { path: 'b/d', type: 'new' } ])
  t.end()
})
