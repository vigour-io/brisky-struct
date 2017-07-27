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
})
