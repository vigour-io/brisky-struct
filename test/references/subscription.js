const test = require('tape')
const { create: struct } = require('../../')

test('references - subscription', t => {
  t.plan(3)

  const master = struct({
    deep: {
      realThing: 'is a thing'
    },
    otherDeep: {
      pointer: ['@', 'root', 'deep', 'realThing']
    }
  })

  master.key = 'master'

  const branch1 = master.create()

  branch1.subscribe({ otherDeep: { pointer: true } }, (val, type) => {
    if (type === 'update') {
      t.pass('subscription is fired for branch')
    }
  })

  branch1.set({
    deep: {
      realThing: 'override'
    }
  })

  t.equals(
    master.get(['otherDeep', 'pointer', 'compute']), 'is a thing',
    'master pointer is a thing'
  )

  t.equals(
    branch1.get(['otherDeep', 'pointer', 'compute']), 'override',
    'branch1 pointer is override'
  )
})
