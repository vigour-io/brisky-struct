const test = require('tape')
const { create: struct } = require('../../')

test('references - subscription', t => {
  t.plan(4)

  const master = struct({
    deep: {
      realThing: 'is a thing'
    },
    otherDeep: {
      pointer1: ['@', 'root', 'deep', 'realThing'],
      pointer2: ['@', 'parent', 'pointer1']
    }
  })

  master.key = 'master'

  const branch1 = master.create()

  branch1.subscribe({ otherDeep: { pointer2: { val: true } } }, (val, type) => {
    if (type === 'new') {
      t.equals(val.compute(), 'is a thing', 'fired for original')
    } else if (type === 'update') {
      t.equals(val.compute(), 'override', 'fired for override')
    }
  })

  branch1.set({
    deep: {
      realThing: 'override'
    }
  })

  t.equals(
    master.get(['otherDeep', 'pointer2', 'compute']), 'is a thing',
    'master pointer2 is a thing'
  )

  t.equals(
    branch1.get(['otherDeep', 'pointer1', 'compute']), 'override',
    'branch1 pointer1 is override'
  )
})
