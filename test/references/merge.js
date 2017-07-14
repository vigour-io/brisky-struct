const test = require('tape')
const { create: struct } = require('../../')

test('references - merge', t => {
  const master = struct({
    key: 'master',
    real:{
      rA: { name: 'A' },
      rB: { name: 'B' }
    },
    pointer: {
      p1: ['@', 'root', 'real', 'rA'],
      p2: ['@', 'root', 'real', 'rB']
    }
  })

  const branch1 = master.create({
    key: 'branch1',
    real: { rA: { field: 1 } },
    pointer: { p1: { pField: 11 } }
  })

  const branch2 = master.create({
    key: 'branch2',
    real: { rB: { field: 2 } },
    pointer: { p2: { pField: 22 } }
  })

  const branch3 = branch1.create({
    key: 'branch3',
    real: { rB: { deepField: 3 } },
    pointer: { p2: { deepPField: 33 } }
  })

  const branch4 = branch2.create({
    key: 'branch4',
    real: { rA: { deepField: 4 } },
    pointer: { p1: { deepPField: 44 } }
  })

  master.set({
    pointer: {
      p1: ['@', 'root', 'real', 'rB'],
      p2: ['@', 'root', 'real', 'rA']
    }
  })

  t.equals(
    branch3.get(['pointer', 'p2', 'deepPField', 'compute']), 33
  )
  /*
  t.equals(
    branch3.get(['pointer', 'p2', 'val', 'field', 'compute']), 1
  )
  */
  t.equals(
    branch4.get(['pointer', 'p1', 'deepPField', 'compute']), 44
  )
  /*
  t.equals(
    branch4.get(['pointer', 'p1', 'val', 'field', 'compute']), 2
  )
  */

  t.end()
})
