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

test('subscription - basic - root - 1', t => {
  const s = subsTest(
    t,
    { field: true },
    { val: 'property' }
  )
  s(
    'initial subscription',
    [{ type: 'new' }]
  )
  s(
    'update root',
    [],
    'hello'
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

// test('basic - top', t => {
//   t.plan(2)
//   const s = require('../s')
//   const state = s({ haha: true }, false)
//   const cnt = { new: 0, update: 0 }
//   state.subscribe({ val: true }, (target, type, stamp, subs, tree, sType) => {
//     if (sType) { cnt[sType]++ }
//     cnt[type]++
//   })
//   state.set('lullz')
//   t.equal(cnt.new, 1, 'fired new twice')
//   t.equal(cnt.update, 1, 'fired update twice')
// })
