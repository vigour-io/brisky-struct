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
    branch.get('deep').serialize(),
    { real: { field: 'override', other: 5 } },
    'branch deep is correct'
  )

  t.end()
})
