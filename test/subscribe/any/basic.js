'use strict'
const test = require('tape')
const subsTest = require('../util')

test('any - basic', t => {
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
      { path: 'fields/0/title', type: 'new' },
      { path: 'fields/1/title', type: 'new' }
    ],
    {
      fields: [
        { title: 'james' },
        { title: 'yuz' }
      ]
    }
  )

  s(
    'specific field in a collection',
    [ { path: 'fields/0/title', type: 'update' } ],
    { fields: [ { title: 'smurts' } ] }
  )

  console.log('go remove!')
  const r = s(
    'remove field in a collection',
    [
      { path: 'fields/0/title', type: 'remove' }
    ],
    { fields: [ null ] }
  )
  console.log(r.state.fields)

  // s(
  //   'toplevel id collection subscription',
  //   [ { path: 'a/id', type: 'new' } ],
  //   { a: { id: true } }
  // )

  t.end()
})

// test('any - basic - true', t => {
//   var s = subsTest(
//     t,
//     {},
//     { $any: { val: true } }
//   )

//   s('initial subscription', [], {})

//   s(
//     'create fields',
//     [
//       { path: 'a', type: 'new' },
//       { path: 'b', type: 'new' }
//     ],
//     {
//       a: {},
//       b: {}
//     }
//   )

//   s(
//     'change field',
//     [ { path: 'a', type: 'update' } ],
//     { a: 'a' }
//   )

//   s(
//     'remove field',
//     [
//       { path: 'a', type: 'remove' }
//     ],
//     { a: null }
//   )
//   t.end()
// })

// test('any - basic - val: "property"', t => {
//   var s = subsTest(
//     t,
//     {},
//     { $any: { val: 'property' } }
//   )

//   s('initial subscription', [], {})

//   s(
//     'create fields',
//     [
//       { path: 'a', type: 'new' },
//       { path: 'b', type: 'new' }
//     ],
//     {
//       a: {},
//       b: {}
//     }
//   )

//   s(
//     'set fields',
//     [],
//     {
//       a: 'a',
//       b: 'b'
//     }
//   )

//   s(
//     'remove field',
//     [
//       { path: 'a', type: 'remove' }
//     ],
//     { a: null }
//   )

//   t.end()
// })

// test('any - basic - combined with a field with nested subs', t => {
//   var s = subsTest(
//     t,
//     {},
//     {
//       field: { nested: { val: true } },
//       $any: { val: true }
//     }
//   )

//   s('initial subscription', [], {})

//   s(
//     'create fields',
//     [
//       { path: 'field/nested', type: 'new' },
//       { path: 'a', type: 'new' },
//       { path: 'field', type: 'new' }
//     ],
//     {
//       a: {},
//       field: {
//         nested: 'hello'
//       }
//     }
//   )

//   t.end()
// })

// test('any - basic - empty fields', t => {
//   var s = subsTest(
//     t,
//     {
//       fields: [ true, true ]
//     },
//     {
//       fields: {
//         $remove: true,
//         $any: { val: true, $remove: true }
//       }
//     }
//   )

//   s('initial subscription', [
//     { path: 'fields/0', type: 'new' },
//     { path: 'fields/1', type: 'new' }
//   ])

//   s(
//     'remove fields',
//     [ { type: 'remove' }, { type: 'remove' } ],
//     {
//       fields: { reset: true }
//     }
//   )

//   t.end()
// })

// test('any - basic - remove nested fields using $remove listener', t => {
//   var s = subsTest(
//     t,
//     {
//       fields: [ true, true ]
//     },
//     {
//       fields: {
//         $remove: true,
//         $any: { val: true, $remove: true }
//       }
//     }
//   )

//   s('initial subscription', [
//     { path: 'fields/0', type: 'new' },
//     { path: 'fields/1', type: 'new' }
//   ])

//   s(
//     'remove fields',
//     [
//       { path: 'fields/0', type: 'remove' }, { path: 'fields/1', type: 'remove' }
//     ],
//     {
//       fields: null
//     }
//   )

//   t.end()
// })
