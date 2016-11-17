const test = require('tape')
const subsTest = require('./util')

test('basic', t => {
  const s = subsTest(
    t,
    { field: true },
    {
      field: { val: true },
      other: { yuzi: { val: true } }
    }
  )

  s(
    'initial subscription',
    [{ path: 'field', type: 'new' }]
  )

  s(
    'update nested field',
    [ { path: 'other/yuzi', type: 'new' } ],
    { other: { yuzi: true } }
  )

  // s(
  //   'remove field',
  //   [ { path: 'other/yuzi', type: 'remove' } ],
  //   { other: { yuzi: null } }
  // )

  // s(
  //   'reset yuzi',
  //   [ { path: 'other/yuzi', type: 'new' } ],
  //   { other: { yuzi: true } }
  // )

  // s(
  //   'remove other, no nested removal',
  //   [],
  //   { other: null }
  // )

  t.end()
})
