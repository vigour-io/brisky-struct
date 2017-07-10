const test = require('tape')
const { create: struct } = require('../../')

test('references - performance of virtual listeners', t => {
  const master = struct({
    types: {
      pointer: {
        on: {
          data: () => true
        }
      }
    },
    realThing: 'is a thing',
    pointer1: {
      type: 'pointer',
      val: ['@', 'root', 'realThing']
    },
    pointer2: {
      type: 'pointer',
      val: ['@', 'root', 'pointer1']
    }
  })

  master.key = 'master'

  let d = Date.now()

  const branch1 = master.create()

  branch1.set({
    realThing: 'override',
    pointer3: {
      type: 'pointer',
      val: ['@', 'root', 'realThing']
    },
    pointer4: {
      type: 'pointer',
      val: ['@', 'root', 'pointer2']
    }
  })

  let i = 1e3
  while (i--) {
    branch1.set({
      realThing: i % 2 ? 'not override' : 'override'
    })
  }

  const branch2 = branch1.create()

  i = 1e3
  while (i--) {
    branch2.set({
      realThing: i % 2 ? 'double override' : 'not double override'
    })
  }

  d = Date.now() - d

  t.ok(d < 200, 'reference emitters take less than 200ms')

  t.end()
})
