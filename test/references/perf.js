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

  const branch1 = master.create()

  branch1.set({
    realThing: 'override',
    pointer3: {
      type: 'pointer',
      val: ['@', 'root', 'realThing']
    },
    deep: {
      pointer4: {
        type: 'pointer',
        val: ['@', 'root', 'pointer2']
      }
    }
  })

  let d = Date.now()

  let i = 3e3
  while (i--) {
    branch1.set({
      realThing: i % 2 ? 'not override' : 'override'
    })
  }

  const branch2 = branch1.create()

  i = 3e3
  while (i--) {
    branch2.set({
      realThing: i % 2 ? 'double override' : 'not double override'
    })
  }

  d = Date.now() - d
  console.log('virtual reference emitters:', d + 'ms')
  t.ok(d < 150, 'virtual reference emitters take less than 150ms')

  t.end()
})
