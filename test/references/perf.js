const test = require('tape')
const { create: struct } = require('../../')

test('references - performance of virtual', t => {
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

  branch1.subscribe({ deep: { pointer4: true } }, () => true)

  let d = Date.now()

  let i = 1e3
  while (i--) {
    branch1.set({
      realThing: i % 2 ? 'override' : 'not override'
    })
    branch1.get(['deep', 'pointer4', 'compute'])
  }

  const branch2 = branch1.create()

  branch2.subscribe({ pointer3: true }, () => true)

  i = 1e3
  while (i--) {
    branch2.set({
      realThing: i % 2 ? 'double override' : 'not double override'
    })
    branch2.get(['deep', 'pointer3', 'compute'])
  }

  d = Date.now() - d
  console.log('virtual references:', d, 'ms')
  t.ok(d < 200, 'virtual references take less than 200ms')

  t.end()
})
