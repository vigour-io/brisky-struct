const test = require('tape')
const { create: struct } = require('../../')

test('references - val subscription', t => {
  t.plan(8)

  const master = struct({
    deep: {
      real: 'is a thing'
    },
    otherDeep: {
      pointer1: ['@', 'root', 'deep', 'real'],
      pointer2: ['@', 'parent', 'pointer1']
    }
  })

  const branch1 = master.create()

  branch1.subscribe({ otherDeep: { pointer1: true } }, (val, type) => {
    if (type === 'new') {
      t.equals(val.compute(), 'is a thing', 'pointer1 fired for original')
    } else if (type === 'update') {
      t.equals(val.compute(), 'override', 'pointer1 fired for override')
    }
  })

  branch1.subscribe({ otherDeep: { pointer2: true } }, (val, type) => {
    if (type === 'new') {
      t.equals(val.compute(), 'is a thing', 'pointer2 fired for original')
    } else if (type === 'update') {
      t.equals(val.compute(), 'override', 'pointer2 fired for override')
    }
  })

  branch1.set({
    deep: {
      real: 'override'
    }
  })

  t.equals(
    master.get(['otherDeep', 'pointer1', 'compute']), 'is a thing',
    'master pointer1 is a thing'
  )

  t.equals(
    master.get(['otherDeep', 'pointer2', 'compute']), 'is a thing',
    'master pointer2 is a thing'
  )

  t.equals(
    branch1.get(['otherDeep', 'pointer1', 'compute']), 'override',
    'branch1 pointer1 is override'
  )

  t.equals(
    branch1.get(['otherDeep', 'pointer2', 'compute']), 'override',
    'branch1 pointer2 is override'
  )
})

test('references - field subscription', t => {
  // must be 8
  t.plan(6)

  const master = struct({
    key: 'master',
    deep: {
      real: {
        field: 'is a thing'
      }
    },
    otherDeep: {
      pointer1: ['@', 'root', 'deep', 'real'],
      pointer2: ['@', 'parent', 'pointer1']
    }
  })

  const branch1 = master.create()

  branch1.subscribe({ otherDeep: { pointer1: true } }, (val, type) => {
    if (type === 'new') {
      t.equals(val.get(['field', 'compute']), 'is a thing', 'pointer1 fired for original')
    } else if (type === 'update') {
      // this one should also fire
      t.equals(val.get(['field', 'compute']), 'override', 'pointer1 fired for override')
    }
  })

  branch1.subscribe({ otherDeep: { pointer2: true } }, (val, type) => {
    if (type === 'new') {
      t.equals(val.get(['field', 'compute']), 'is a thing', 'pointer2 fired for original')
    } else if (type === 'update') {
      // this one should also fire
      t.equals(val.get(['field', 'compute']), 'override', 'pointer2 fired for override')
    }
  })

  branch1.set({
    key: 'branch1',
    deep: {
      real: {
        field: 'override'
      }
    }
  })

  t.equals(
    master.get(['otherDeep', 'pointer1', 'field', 'compute']), 'is a thing',
    'master pointer1 is a thing'
  )

  t.equals(
    master.get(['otherDeep', 'pointer2', 'field', 'compute']), 'is a thing',
    'master pointer2 is a thing'
  )

  t.equals(
    branch1.get(['otherDeep', 'pointer1', 'field', 'compute']), 'override',
    'branch1 pointer1 is override'
  )

  t.equals(
    branch1.get(['otherDeep', 'pointer2', 'field', 'compute']), 'override',
    'branch1 pointer2 is override'
  )
})

test('references - merge subscription', t => {
  t.plan(9)

  const master = struct({
    deep: {
      real: 'is a thing'
    },
    otherDeep: {
      pointer1: ['@', 'root', 'deep', 'real'],
      pointer2: ['@', 'parent', 'pointer1']
    }
  })

  const branch1 = master.create()

  branch1.subscribe({ otherDeep: { pointer2: true } }, (val, type) => {
    if (type === 'new') {
      t.equals(val.compute(), 'is a thing', 'pointer2 fired for original')
    } else if (type === 'update') {
      t.equals(val.compute(), 'override', 'pointer2 fired for override')
      t.equals(val.get(['other', 'compute']), 'add', 'pointer2 fired for add')
    }
  })

  branch1.set({
    deep: {
      real: 'override'
    },
    otherDeep: {
      pointer1: {
        other: 'add'
      }
    }
  })

  t.equals(
    master.get(['otherDeep', 'pointer1', 'compute']), 'is a thing',
    'master pointer1 is a thing'
  )

  t.equals(
    master.get(['otherDeep', 'pointer2', 'compute']), 'is a thing',
    'master pointer2 is a thing'
  )

  t.equals(
    branch1.get(['otherDeep', 'pointer1', 'compute']), 'override',
    'branch1 pointer1 is override'
  )

  t.equals(
    branch1.get(['otherDeep', 'pointer2', 'compute']), 'override',
    'branch1 pointer2 is override'
  )

  t.equals(
    branch1.get(['otherDeep', 'pointer1', 'other', 'compute']), 'add',
    'branch1 pointer1 has other'
  )

  t.equals(
    branch1.get(['otherDeep', 'pointer2', 'other', 'compute']), 'add',
    'branch1 pointer2 has other'
  )
})
