const test = require('tape')
const subsTest = require('../util')
const struct = require('../../../')

test('subscription - any - basic', t => {
  const s = subsTest(
    t,
    {},
    {
      fields: { $any: { title: { val: true } } },
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

  // [ { path: 'fields/b/title', type: 'update' }, { path: 'fields/b/title', type: 'remove' }, { path: 'fields/c/title', type: 'remove' } ]

  const r = s(
    'remove field in a collection',
    [
      { path: 'fields/b/title', type: 'update' }, // this is new ofc
      { path: 'fields/b/title', type: 'remove' } // seems weird that you dont get a but it makes all the sense
    ],
    { fields: { a: null, c: null } }
  )
  console.log(r.state.fields.keys())

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

  const result = s('initial subscription', [], {})

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

  // console.log(result.state.keys())

  s(
    'remove field',
    [
       { path: 'b', type: 'update' },
       { path: 'c', type: 'update' },
       { path: 'd', type: 'update' },
       { path: 'd', type: 'remove' }
    ],
    { a: null }
  )

  console.log(result.state.keys())

  s(
    'remove fields',
    [
      { path: 'd', type: 'update' },
      { path: 'a', type: 'update' },
      { path: 'd', type: 'remove' }
      // if you want to get info about the previous one need to cache do may be nice to do.... this is jsut weird
      // were removing b and c
    ],
    { a: 'hello', b: null, c: null }
  )

  // this one is wrong... needs to clean up better
  console.log(result.tree.$any.$keys.length, result.tree.$any.$keys.map(val => val.$t.path()))
  console.log(result.state.keys())

  const struct = result.state
  struct.set({ start: 'start' }, false)
  const k1 = struct.keys()[1]
  struct.keys()[1] = struct.keys()[2]
  struct.keys()[2] = k1

  // reshuffle needs to fire updates!
  // need to see 2 new but new for things that are allrdy rendered thats re-order
  s(
    'add field and reorder keys',
    [
      { path: 'start', type: 'update' },
      { path: 'a', type: 'new' },
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
    // hmm this is not so nice need to fire for switch as well...
    // when switch in any its becomes to weird
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
      { path: 'b', type: 'remove' } // ok so this seems strange but it aint
    ],
    { a: null }
  )

  t.end()
})

// test('subscription - any - basic - combined with a field with nested subs', t => {
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

// test('subscription - any - basic - empty fields', t => {
//   var s = subsTest(
//     t,
//     {
//       fields: [ true, true ]
//     },
//     {
//       fields: {
//         $any: { val: true }
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
//       { path: 'fields/0', type: 'remove' },
//       { path: 'fields/1', type: 'remove' }
//     ],
//     {
//       fields: { 0: null, 1: null }
//     }
//   )

//   t.end()
// })

// test('subscription - any - basic - remove nested fields', t => {
//   var s = subsTest(
//     t,
//     {
//       fields: [ true, true ]
//     },
//     {
//       fields: {
//         $any: { val: true }
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

// test('subscription - any - basic - swap', t => {
//   const state = struct({ a: true })
//   state.set({ b: 'ha!' })
//   const tree = state.subscribe({
//     $any: { val: true }
//   }, t => {})

//   state.keys()[0] = 'b'
//   state.keys()[1] = 'a'
//   state.emit('data')
//   t.same(tree.$any.$keys, state.keys(), 'correct keys in tree')
//   state.set({ c: 'ha!' })
//   state.set({ d: 'ha!' })
//   state.set({ e: 'ha!' })
//   state.set({ f: 'ha!' })
//   state.set({ g: 'ha!' })
//   state.set({ h: 'ha!' })
//   state.set({ i: 'ha!' })
//   state.set({ j: 'ha!' })
//   state.set({ k: 'ha!' })

//   var cnt = 10
//   const shuffle = (cnt) => {
//     state.keys().sort(() => Math.random() > 0.5 ? 1 : -1)
//     state.emit('data')
//     t.same(tree.$any.$keys, state.keys(), `shuffle ${cnt} correct keys in tree`)
//   }
//   while (cnt--) { shuffle(cnt) }
//   t.end()
// })
