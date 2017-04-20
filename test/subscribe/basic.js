const test = require('tape')
const subsTest = require('./util')

test('subscription - basic - root', t => {
  const s = subsTest(
    t,
    { field: true },
    { val: true }
  )
  s(
    'initial subscription',
    [{ type: 'new' }]
  )
  s(
    'update root',
    [ { type: 'update' } ],
    'hello'
  )
  t.end()
})

test('subscription - basic - shallow - 1', t => {
  const s = subsTest(
    t,
    {
      val: 'hello',
      field: 1,
      bla: 2,
      blurf: { blars: 1 }
    },
    { val: 'shallow' }
  )
  s(
    'initial subscription',
    [{ type: 'new' }]
  )
  s(
    'update root',
    [{ type: 'update' }],
    'bye'
  )
  t.end()
})

test('subscription - basic', t => {
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

  s(
    'remove field',
    [ { path: 'other/yuzi', type: 'remove' } ],
    { other: { yuzi: null } }
  )

  s(
    'reset yuzi',
    [ { path: 'other/yuzi', type: 'new' } ],
    { other: { yuzi: true } }
  )

  s(
    'remove other, no nested removal',
    [ { path: 'other/yuzi', type: 'remove' } ],
    { other: null }
  )

  t.end()
})

test('subscription - basic - nested removal', t => {
  const s = subsTest(
    t,
    { field: true, other: { yuzi: true } },
    {
      field: { val: true },
      other: { yuzi: { val: true } }
    }
  )
  s(
    'initial subscription',
    [
      { path: 'field', type: 'new' },
      { path: 'other/yuzi', type: 'new' }
    ]
  )
  s(
    'remove and nested removal',
    [
      { path: 'other/yuzi', type: 'remove' }
    ],
    { other: null }
  )
  t.end()
})

test('subscription - root', t => {
  const s = subsTest(
    t,
    { field: true },
    { val: true }
  )
  s(
    'initial subscription',
    [{ type: 'new' }]
  )
  s(
    'update root',
    [ { type: 'update' } ],
    'hello'
  )
  t.end()
})

test('subscription - basic - shallow - 1', t => {
  const s = subsTest(
    t,
    {
      val: 'hello',
      field: 1,
      bla: 2,
      blurf: { blars: 1 }
    },
    { blurf: { val: 'shallow' } }
  )
  s(
    'initial subscription',
    [{ path: 'blurf', type: 'new' }]
  )
  s(
    'update root',
    [{ path: 'blurf', type: 'update' }],
    { blurf: { blars: 2 } }
  )
  t.end()
})

test('subscription - basic - switch', t => {
  const s = subsTest(
    t,
    {
      field: true,
      bla: [ '@', 'root', 'gurf' ],
      gurf: [ '@', 'root', 'grubs' ],
      xx: true,
      grubs: 'ok'
    },
    { field: { val: 'switch' } }
  )
  s(
    'initial subscription',
    [{ type: 'new', path: 'field' }]
  )
  s(
    'update field',
    [],
    { field: 'hello' }
  )

  s(
    'update field',
    [{ type: 'update', path: 'field' }],
    { field: [ '@', 'root', 'bla' ] }
  )

  s(
    'update field',
    [{ type: 'update', path: 'field' }],
    { gurf: [ '@', 'root', 'xx' ] }
  )

  t.end()
})
