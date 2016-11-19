'use strict'
const test = require('tape')
const subsTest = require('../util')

test('subscription - any - basic', t => {
  const s = subsTest(
    t,
    {},
    {
      fields: { $remove: true, $any: { title: { val: true }, $remove: true } },
      $any: { id: { val: true } }
    }
  )

  s('initial subscription', [], {})

  s(
    'create a collection',
    [
      { path: 'fields/a/title', type: 'new' },
      { path: 'fields/b/title', type: 'new' },
      { path: 'fields/c/title', type: 'new' }
    ],
    {
      fields: {
        a: { title: 'james' },
        b: { title: 'yuz' },
        c: { title: 'sjonnie' }
      }
    }
  )

  s(
    'specific field in a collection',
    [ { path: 'fields/a/title', type: 'update' } ],
    { fields: { a: { title: 'smurts' } } }
  )

  s(
    'remove field in a collection',
    [
      { path: 'fields/a/title', type: 'remove' },
      { path: 'fields/c/title', type: 'remove' }
    ],
    { fields: { a: null, c: null } }
  )

  s(
    'toplevel id collection subscription',
    [ { path: 'a/id', type: 'new' } ],
    { a: { id: true } }
  )

  t.end()
})

test('subscription - any - basic - true', t => {
  var s = subsTest(
    t,
    {},
    { $any: { val: true } }
  )

  s('initial subscription', [], {})

  s(
    'create fields',
    [
      { path: 'a', type: 'new' },
      { path: 'b', type: 'new' },
      { path: 'c', type: 'new' },
      { path: 'd', type: 'new' }
    ],
    {
      a: {},
      b: {},
      c: {},
      d: {}
    }
  )

  s(
    'change field',
    [{ path: 'a', type: 'update' }],
    { a: 'a' }
  )

  s(
    'remove field',
    [
      { path: 'a', type: 'remove' }
    ],
    { a: null }
  )

  const result = s(
    'remove fields',
    [
      { path: 'b', type: 'remove' },
      { path: 'c', type: 'remove' },
      { path: 'a', type: 'new' }
    ],
    { a: 'hello', b: null, c: null }
  )

  const struct = result.state
  struct.set({ start: 'start' }, false)
  const k1 = struct.keys()[1]
  struct.keys()[1] = struct.keys()[2]
  struct.keys()[2] = k1
  s(
    'add field and reorder keys',
    [
      { path: 'start', type: 'new' },
      { path: 'hello', type: 'new' }
    ],
    { hello: true }
  )
  // shuffle array (re-sort)
  t.end()
})

test('subscription - any - basic - val: "property"', t => {
  var s = subsTest(
    t,
    {},
    { $any: { val: 'property' } }
  )

  s('initial subscription', [], {})

  s(
    'create fields',
    [
      { path: 'a', type: 'new' },
      { path: 'b', type: 'new' }
    ],
    {
      a: {},
      b: {}
    }
  )

  s(
    'set fields',
    [],
    {
      a: 'a',
      b: 'b'
    }
  )

  s(
    'remove field',
    [
      { path: 'a', type: 'remove' }
    ],
    { a: null }
  )

  t.end()
})

test('subscription - any - basic - combined with a field with nested subs', t => {
  var s = subsTest(
    t,
    {},
    {
      field: { nested: { val: true } },
      $any: { val: true }
    }
  )

  s('initial subscription', [], {})

  s(
    'create fields',
    [
      { path: 'field/nested', type: 'new' },
      { path: 'a', type: 'new' },
      { path: 'field', type: 'new' }
    ],
    {
      a: {},
      field: {
        nested: 'hello'
      }
    }
  )

  t.end()
})

test('subscription - any - basic - empty fields', t => {
  var s = subsTest(
    t,
    {
      fields: [ true, true ]
    },
    {
      fields: {
        $remove: true,
        $any: { val: true, $remove: true }
      }
    }
  )

  s('initial subscription', [
    { path: 'fields/0', type: 'new' },
    { path: 'fields/1', type: 'new' }
  ])

  s(
    'remove fields',
    [
      { path: 'fields/0', type: 'remove' },
      { path: 'fields/1', type: 'remove' }
    ],
    {
      fields: { 0: null, 1: null }
    }
  )

  t.end()
})

test('subscription - any - basic - remove nested fields using $remove listener', t => {
  var s = subsTest(
    t,
    {
      fields: [ true, true ]
    },
    {
      fields: {
        $remove: true,
        $any: { val: true, $remove: true }
      }
    }
  )

  s('initial subscription', [
    { path: 'fields/0', type: 'new' },
    { path: 'fields/1', type: 'new' }
  ])

  s(
    'remove fields',
    [
      { path: 'fields/0', type: 'remove' }, { path: 'fields/1', type: 'remove' }
    ],
    {
      fields: null
    }
  )
  t.end()
})
