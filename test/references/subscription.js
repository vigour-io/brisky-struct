const test = require('tape')
const { create: struct } = require('../../')

test('references - val subscription', t => {
  t.plan(8)

  const master = struct({
    key: 'master',
    deep: {
      real: 'is a thing'
    },
    otherDeep: {
      pointer1: ['@', 'root', 'deep', 'real'],
      pointer2: ['@', 'parent', 'pointer1']
    }
  })

  const branch = master.create()

  branch.subscribe({ otherDeep: { pointer1: true } }, (val, type) => {
    if (type === 'new') {
      t.equals(
        val.compute(), 'is a thing',
        'pointer1 fired for original'
      )
    } else if (type === 'update') {
      t.equals(
        val.compute(), 'override',
        'pointer1 fired for override'
      )
    }
  })

  branch.subscribe({ otherDeep: { pointer2: true } }, (val, type) => {
    if (type === 'new') {
      t.equals(
        val.compute(), 'is a thing',
        'pointer2 fired for original'
      )
    } else if (type === 'update') {
      t.equals(
        val.compute(), 'override',
        'pointer2 fired for override'
      )
    }
  })

  branch.set({
    key: 'branch',
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
    branch.get(['otherDeep', 'pointer1', 'compute']), 'override',
    'branch pointer1 is override'
  )

  t.equals(
    branch.get(['otherDeep', 'pointer2', 'compute']), 'override',
    'branch pointer2 is override'
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

  const branch = master.create()

  branch.subscribe({ otherDeep: { pointer1: true } }, (val, type) => {
    if (type === 'new') {
      t.equals(
        val.get(['field', 'compute']), 'is a thing',
        'pointer1 fired for original'
      )
    } else if (type === 'update') {
      // this one should also fire
      t.equals(
        val.get(['field', 'compute']), 'override',
        'pointer1 fired for override'
      )
    }
  })

  branch.subscribe({ otherDeep: { pointer2: true } }, (val, type) => {
    if (type === 'new') {
      t.equals(
        val.get(['field', 'compute']), 'is a thing',
        'pointer2 fired for original'
      )
    } else if (type === 'update') {
      // this one should also fire
      t.equals(
        val.get(['field', 'compute']), 'override',
        'pointer2 fired for override'
      )
    }
  })

  branch.set({
    key: 'branch',
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
    branch.get(['otherDeep', 'pointer1', 'field', 'compute']), 'override',
    'branch pointer1 is override'
  )

  t.equals(
    branch.get(['otherDeep', 'pointer2', 'field', 'compute']), 'override',
    'branch pointer2 is override'
  )
})

test('references - merge subscription', t => {
  t.plan(9)

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

  const branch = master.create()

  branch.subscribe({ otherDeep: { pointer2: true } }, (val, type) => {
    if (type === 'new') {
      t.equals(
        val.get(['field', 'compute']), 'is a thing',
        'branch pointer2 fired for original'
      )
    } else if (type === 'update') {
      t.equals(
        val.get(['other', 'compute']), 'add',
        'pointer2 other fired for add'
      )
      t.equals(
        val.get(['extra', 'compute']), 'add',
        'pointer2 extra fired for add'
      )
    }
  })

  branch.set({
    key: 'branch',
    otherDeep: {
      pointer1: {
        other: 'add'
      }
    },
    deep: {
      real: {
        extra: 'add'
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
    branch.get(['otherDeep', 'pointer1', 'extra', 'compute']), 'add',
    'branch pointer1 has extra'
  )

  t.equals(
    branch.get(['otherDeep', 'pointer2', 'extra', 'compute']), 'add',
    'branch pointer2 has extra'
  )

  t.equals(
    branch.get(['otherDeep', 'pointer1', 'other', 'compute']), 'add',
    'branch pointer1 has other'
  )

  t.equals(
    branch.get(['otherDeep', 'pointer2', 'other', 'compute']), 'add',
    'branch pointer2 has other'
  )
})
