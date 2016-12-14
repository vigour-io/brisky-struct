const test = require('tape')
const subsTest = require('../util')
const struct = require('../../../')

test('subscription - any - references - fields', t => {
  const s = subsTest(
    t,
    {
      0: 'its zero',
      1: 'its 1',
      collection: {
        0: [ '@', 'root', 0 ],
        1: [ '@', 'root', 1 ]
      }
    },
    {
      collection: {
        $any: { val: true }
      }
    }
  )
  s(
    'initial subscription',
    [
      { path: 'collection/0', type: 'new' },
      { path: 'collection/1', type: 'new' }
    ]
  )
  s(
    'update 0',
    [
      { path: 'collection/0', type: 'update' }
    ],
    [ 'hello its an update in zero' ]
  )
  s(
    'remove 0',
    [
      { path: 'collection/0', type: 'update' }
    ],
    [ null ]
  )
  t.end()
})

test('subscription - any - references - target - struct', function (t) {
  const subscription = {
    a: {
      $any: {
        title: { val: true }
      }
    }
  }
  const b = [ { title: 1 }, { title: 2 }, { title: 3 }, { title: 4 } ]
  const s = subsTest(t, { b: b, a: [ '@', 'root', 'b' ] }, subscription)

  s('initial subscription', multiple('new'))

  function multiple (type, nopath) {
    const val = []
    for (let i = 0, len = b.length; i < len; i++) {
      val.push({ type: type, path: 'b/' + i + '/title' })
    }
    return val
  }

  s(
    'remove reference',
    multiple('remove', true),
    { a: false }
  )

  t.end()
})

test('subscription - any - references - over reference', t => {
  const state = struct({
    a: {
      a1: true,
      a2: true
    },
    b: {
      b1: true
    },
    collection: [ '@', 'root', 'a' ]
  })

  const s = subsTest(
    t,
    state,
    {
      collection: {
        $any: { val: true }
      }
    }
  )

  s(
    'initial subscription',
    [
      { path: 'a/a1', type: 'new' },
      { path: 'a/a2', type: 'new' }
    ]
  )

  s(
    'update 0',
    [
      { path: 'b/b1', type: 'update' },
      { path: 'a/a2', type: 'remove' }
    ],
    {
      collection: [ '@', 'root', 'b' ]
    }
  )
  t.end()
})

test('subscription - any - references - over reference on field', t => {
  const state = struct({
    holder: {
      a: {
        a1: true,
        a2: true
      },
      b: {
        a1: true
      },
      collection: [ '@', 'parent', 'a' ]
    }
  })

  const s = subsTest(
    t,
    state,
    {
      holder: {
        collection: {
          val: 1,
          $any: { val: true }
        }
      }
    }
  )
  s(
    'initial subscription',
    [
      { path: 'holder/collection', type: 'new' },
      { path: 'holder/a/a1', type: 'new' },
      { path: 'holder/a/a2', type: 'new' }
    ]
  )

  s(
    'update 0',
    [
      { path: 'holder/b/a1', type: 'update' },
      { path: 'holder/a/a2', type: 'remove' }
    ],
    {
      holder: { collection: [ '@', 'root', 'holder', 'b' ] }
    }
  )
  t.end()
})

test('subscription - any - references - target - struct', t => {
  const subscription = {
    a: {
      $any: {
        title: { val: true }
      }
    }
  }
  const b = [ { title: 1 }, { title: 2 }, { title: 3 }, { title: 4 } ]
  const s = subsTest(t, { b: b, a: [ '@', 'root', 'b' ] }, subscription)
  s('initial subscription', multiple('new'))
  function multiple (type, nopath) {
    const val = []
    for (let i = 0, len = b.length; i < len; i++) {
      val.push({ type: type, path: 'b/' + i + '/title' })
    }
    return val
  }
  s(
    'remove reference',
     multiple('remove', true),
     { a: false }
   )
  t.end()
})
