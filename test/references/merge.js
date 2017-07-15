const test = require('tape')
const { create: struct } = require('../../')

/*
test('inheritance', t => {
  const master = struct({
    a: { b: 'value' }
  })

  const branch1 = master.create()

  const branch2 = branch1.create({
    a: { b: 'value2' }
  })

  branch1.set({ a: { b: 'value1' } })

  console.log(branch2.a.inherits.b)
  t.end()
})
*/

test('references - merge', t => {
  const master = struct({
    key: 'master',
    real: {
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
    real: { rB: { field: 3 } },
    pointer: { p2: { pField: 33 } }
  })

  const branch4 = branch2.create({
    key: 'branch4',
    real: { rA: { field: 4 } },
    pointer: { p1: { pField: 44 } }
  })

  master.set({
    pointer: {
      p1: ['@', 'root', 'real', 'rB'],
      p2: ['@', 'root', 'real', 'rA']
    }
  })

  t.equals(
    branch3.get(['pointer', 'p2', 'pField', 'compute']), 33
  )
  t.equals(
    branch3.get(['pointer', 'p2', 'name', 'compute']), 'A'
  )
  t.equals(
    branch4.get(['pointer', 'p1', 'pField', 'compute']), 44
  )
  t.equals(
    branch4.get(['pointer', 'p1', 'name', 'compute']), 'B'
  )

  console.log(branch2.pointer.p1.inherits.root(true).key)

  t.end()
})
