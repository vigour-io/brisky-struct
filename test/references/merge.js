const test = require('tape')
const { create: struct } = require('../../')

test('references - merge', t => {
  const master = struct({
    deep: {
      realThing: 'is a thing'
    },
    otherDeep: {
      pointer1: ['@', 'root', 'deep'],
      pointer2: ['@', 'root', 'deep']
    }
  })

  master.key = 'master'

  const branch1 = master.create()

  branch1.set({
    deep: {
      realThing: 'override'
    },
    otherDeep: {
      pointer1: {
        deeper: 'merge extra'
      }
    }
  })

  const branch2 = branch1.create()

  branch2.set({
    deep: {
      realThing: 'double override'
    },
    otherDeep: {
      pointer2: {
        deeper: 'merge extra'
      }
    }
  })

  t.same(
    master.get(['otherDeep', 'pointer1', 'realThing', 'compute']),
    'is a thing',
    'master pointer1 references to master realThing'
  )
  t.same(
    branch1.get(['otherDeep', 'pointer1', 'realThing', 'compute']),
    'override',
    'branch1 pointer1 references to override'
  )
  t.same(
    branch2.get(['otherDeep', 'pointer2', 'realThing', 'compute']),
    'double override',
    'branch2 pointer2 references to double override'
  )
  t.same(
    branch2.get('otherDeep').serialize(),
    {
      pointer1: {
        val: ['@', 'root', 'deep'],
        deeper: 'merge extra'
      },
      pointer2: {
        val: ['@', 'root', 'deep'],
        deeper: 'merge extra'
      }
    },
    'branch2 has all merged'
  )
  t.end()
})
