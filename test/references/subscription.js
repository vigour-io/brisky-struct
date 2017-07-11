const test = require('tape')
const { create: struct } = require('../../')

test('references - virtual subscription', t => {
  t.plan(3)

  const master = struct({
    deep: {
      realThing: 'is a thing'
    },
    otherDeep: {
      pointer1: ['@', 'root', 'deep', 'realThing']
    }
  })

  master.key = 'master'

  const branch1 = master.create()

  branch1.subscribe({ otherDeep: { pointer1: true } }, (val, type) => {
    if (type === 'update') {
      t.pass('subscription is fired for virtual reference')
    }
  })

  branch1.set({
    deep: {
      realThing: 'override'
    }
  })

  t.same(
    master.serialize(),
    {
      deep: {
        realThing: 'is a thing'
      },
      otherDeep: {
        pointer1: ['@', 'root', 'deep', 'realThing']
      }
    },
    'master has pointer1'
  )

  t.same(
    branch1.serialize(),
    {
      deep: {
        realThing: 'override'
      },
      otherDeep: {
        pointer1: ['@', 'root', 'master', 'deep', 'realThing']
      }
    },
    'branch1 has pointer1 & pointer2'
  )
})
