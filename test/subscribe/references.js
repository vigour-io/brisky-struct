const test = require('tape')
const subsTest = require('./util')

test('subscription - references', t => {
  const s = subsTest(
    t,
    {
      field: {
        a: true,
        b: true
      },
      other: {
        a: true,
        b: true
      },
      ref: {
        val: [ '@', 'parent', 'field' ],
        b: true
      }
    },
    {
      ref: {
        a: { val: true }
        // b: { val: true }
      }
    }
  )

  s(
    'initial subscription',
    [ { path: 'field/a', type: 'new' } ]
  )

  s(
    'switch reference',
    [ { path: 'other/a', type: 'new' } ],
    { ref: [ '@', 'parent', 'other' ] }
  )

  t.end()
})
