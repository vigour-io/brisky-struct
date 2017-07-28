const test = require('tape')
const { create: struct } = require('../../')

test('references - virtual listeners', t => {
  t.plan(12)

  let branch1, branch2, master

  master = struct({
    key: 'master',
    types: {
      pointer: {
        on: {
          data (val, stamp, struct) {
            if (val === 'override' && struct.root() === branch1) {
              if (struct.key === 'pointer1') {
                t.pass('pointer1 fired for override')
              } else if (struct.key === 'pointer2') {
                t.pass('pointer2 fired for override')
              }
            } else if (val === 'double override' && struct.root() === branch2) {
              if (struct.key === 'pointer1') {
                t.pass('pointer1 fired for double override')
              } else if (struct.key === 'pointer2') {
                t.pass('pointer2 fired for double override')
              } else if (struct.key === 'pointer3') {
                t.pass('pointer3 fired for double override')
              } else if (struct.key === 'pointer4') {
                t.pass('pointer4 fired for double override')
              }
            } else if (
              ~['override', 'double override'].indexOf(val) &&
              struct.root() === master
            ) {
              t.fail('master emitters should not fire')
            }
          }
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

  branch1 = master.create()

  branch1.set({
    key: 'branch1',
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

  branch2 = branch1.create()

  branch2.set({
    key: 'branch2',
    realThing: 'double override'
  })

  t.equals(
    master.get(['pointer2', 'compute']), 'is a thing',
    'master pointer2 is a thing'
  )

  t.equals(
    branch1.get(['pointer3', 'compute']), 'override',
    'branch1 pointer3 is override'
  )

  t.equals(
    branch1.get(['deep', 'pointer4', 'compute']), 'override',
    'branch1 pointer4 is override'
  )

  t.equals(
    branch2.get(['pointer2', 'compute']), 'double override',
    'branch2 pointer2 is double override'
  )

  t.equals(
    branch2.get(['pointer3', 'compute']), 'double override',
    'branch2 pointer3 is double override'
  )

  t.equals(
    branch2.get(['deep', 'pointer4', 'compute']), 'double override',
    'branch2 pointer4 is double override'
  )
})

test('references - deep virtual listeners', t => {
  t.plan(6)

  let master, branch1, branch2

  master = struct({
    types: {
      pointer: {
        on: {
          data (val, stamp, struct) {
            if (val === 'override' && struct.root() === branch1) {
              if (struct.key === 'pointer1') {
                t.pass('pointer1 fired for override')
              }
            } else if (val === 'double override' && struct.root() === branch2) {
              if (struct.key === 'pointer1') {
                t.pass('pointer1 fired for double override')
              } else if (struct.key === 'pointer2') {
                t.pass('pointer2 fired for double override')
              }
            } else if (
              ~['override', 'double override'].indexOf(val) &&
              struct.root() === master) {
              t.fail('master emitters should not fire')
            }
          }
        }
      }
    },
    deep: {
      realThing: 'is a thing'
    },
    otherDeep: {
      pointer1: {
        type: 'pointer',
        val: ['@', 'root', 'deep', 'realThing']
      }
    }
  })

  master.key = 'master'

  branch1 = master.create()

  branch1.set({
    deep: {
      realThing: 'override'
    },
    otherDeep: {
      pointer2: {
        type: 'pointer',
        val: ['@', 'parent', 'pointer1']
      }
    }
  })

  branch2 = branch1.get('deep').create()

  branch2.set({
    otherDeep: 'confusion',
    realThing: 'double override'
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

  t.equals(
    branch1.get(['otherDeep', 'pointer2', 'compute']), 'override',
    'branch1 pointer2 is override'
  )

  t.same(
    branch2.serialize(),
    {
      realThing: 'double override',
      otherDeep: 'confusion'
    },
    'branch2 has confusion'
  )
})
