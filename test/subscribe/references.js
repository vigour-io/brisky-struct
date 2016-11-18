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
        a: { val: true },
        b: { val: true }
      }
    },
    true
  )

  s(
    'initial subscription',
    [
      { path: 'ref/b', type: 'new' },
      { path: 'field/a', type: 'new' }
    ]
  )

  // see how this is qualified in pervious -- must be update
  s(
    'switch reference',
    [
      { path: 'other/a', type: 'update' }
    ],
    { ref: [ '@', 'parent', 'other' ] }
  )

  t.end()
})
