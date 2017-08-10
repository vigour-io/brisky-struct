const test = require('tape')
const { create: struct } = require('../../')

test('references - serialized', t => {
  const a = struct({
    hello: true,
    bye: [ '@', 'root', 'hello' ],
    greeting: {
      val: [ '@', 'dutch' ],
      dutch: 'goede morgen'
    },
    vocabulary: [ '@', 'parent', 'greeting' ]
  })
  t.equal(a.bye.val, a.hello, 'create reference to root')
  t.equal(a.greeting.val, a.greeting.dutch, 'create reference to self')
  t.equal(a.vocabulary.val, a.greeting, 'create reference to parent')
  const b = struct({
    bla: {
      on: {
        data: {
          x () {
            t.pass('fires listener when making a new reference')
            t.end()
          }
        }
      }
    }
  })
  b.set({ x: [ '@', 'parent', 'bla', 'newthing' ] })
})

test('references - origin', t => {
  const master = struct({
    deep: {
      real: {
        field: 'is a thing'
      }
    },
    pointers: {
      pointer1: ['@', 'root', 'deep']
    }
  })

  const branch = master.create()

  branch.set({
    deep: {
      real: {
        field: 'override'
      }
    }
  })

  branch.get(['pointers', 'pointer1']).origin().set({ real: { other: 5 } })

  t.equals(
    branch.get(['pointers', 'pointer1']).origin().get(['real', 'field', 'compute']),
    'override',
    '.origin() returns correct result'
  )

  t.equals(
    branch.get(['pointers', 'pointer1', 'origin', 'real', 'field']).compute(),
    'override',
    'origin in get api returns correct result'
  )

  t.same(
    master.get('deep').serialize(),
    { real: { field: 'is a thing' } },
    'master deep is correct'
  )

  t.same(
    branch.get('deep').serialize(),
    { real: { field: 'override', other: 5 } },
    'branch deep is correct'
  )

  t.end()
})

test('references - multi branch origin', t => {
  const master = struct({
    deep: {
      real: {
        field: 'is a thing'
      }
    },
    pointers: {
      pointer1: ['@', 'root', 'deep']
    }
  })

  const branch1 = master.create()
  const branch2 = master.create()
  const branch3 = master.create()

  branch1.set({
    deep: {
      real: {
        field: 'override 1'
      }
    },
    pointers: {
      pointer2: ['@', 'parent', 'pointer1']
    }
  })

  branch2.set({
    deep: {
      real: {
        field: 'override 2'
      }
    },
    pointers: {
      pointer2: ['@', 'root', 'deep', 'real']
    }
  })

  branch3.set({
    deep: {
      real: {
        field: 'override 3'
      }
    },
    pointers: {
      pointer2: ['@', 'parent', 'pointer1']
    }
  })

  const b2p2 = branch2.get(['pointers', 'pointer2'])
  const b3p2 = branch3.get(['pointers', 'pointer2'])
  const b1p2 = branch1.get(['pointers', 'pointer2'])

  b3p2.origin().set({ real: { other: 3 } })
  b2p2.origin().set({ other: 2 })
  b1p2.origin().set({ real: { other: 1 } })

  t.equals(
    branch1.get(['pointers', 'pointer2']).get(['real', 'field', 'compute']),
    'override 1',
    'branch1 .origin() returns correct result'
  )

  t.equals(
    branch1.get(['pointers', 'pointer2', 'real', 'field']).compute(),
    'override 1',
    'branch1 origin in get api returns correct result'
  )

  t.equals(
    branch2.get(['pointers', 'pointer1', 'real', 'other', 'compute']),
    2,
    'branch2 pointer1 other is 2'
  )

  t.equals(
    branch2.get(['pointers', 'pointer2', 'field', 'compute']),
    'override 2',
    'branch2 pointer2 filed is override 2'
  )

  t.equals(
    branch3.get(['pointers', 'pointer2', 'real', 'field', 'compute']),
    'override 3',
    'branch2 pointer2 filed is override 3'
  )

  t.same(
    master.get('deep').serialize(),
    { real: { field: 'is a thing' } },
    'master deep is correct'
  )

  t.same(
    branch1.get('deep').serialize(),
    { real: { field: 'override 1', other: 1 } },
    'branch1 deep is correct'
  )

  t.same(
    branch2.get('deep').serialize(),
    { real: { field: 'override 2', other: 2 } },
    'branch2 deep is correct'
  )

  t.same(
    branch3.get('deep').serialize(),
    { real: { field: 'override 3', other: 3 } },
    'branch3 deep is correct'
  )

  t.end()
})
