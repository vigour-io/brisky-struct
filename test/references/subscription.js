const test = require('tape')
const { create: struct } = require('../../')

test('references - val subscription', t => {
  t.plan(4)

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
  t.plan(4)

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

test('references - field subscription local', t => {
  t.plan(2)

  const master = struct({
    key: 'master',
    deep: {
      real: {
        field: 'is a thing'
      },
      otherReal: {
        field: 'is other thing'
      }
    },
    otherDeep: {
      pointer1: ['@', 'root', 'deep', 'real'],
      pointer2: ['@', 'parent', 'pointer1'],
      pointer3: ['@', 'parent', 'pointer2']
    }
  })

  const branch = master.create()

  branch.subscribe({ otherDeep: { pointer3: true } }, (val, type) => {
    if (type === 'new') {
      t.equals(
        val.get(['field', 'compute']), 'is a thing',
        'pointer3 fired for the original'
      )
    } else if (type === 'update') {
      t.equals(
        val.get(['field', 'compute']), 'is other override',
        'pointer3 fired for other override'
      )
    }
  })

  branch.set({
    key: 'branch',
    deep: {
      otherReal: {
        field: 'is other override'
      }
    },
    otherDeep: {
      pointer1: ['@', 'root', 'deep', 'otherReal']
    }
  })
})

test('references - deep field subscription', t => {
  t.plan(4)

  const master = struct({
    key: 'master',
    deep: {
      real: {
        deeper: {
          pointer1: ['@', 'root', 'otherDeep']
        }
      }
    },
    pointers: {
      pointer2: ['@', 'root', 'deep', 'real'],
      pointer3: ['@', 'parent', 'pointer2']
    },
    otherDeep: {
      deeper: {
        field: 'is a thing'
      }
    }
  })

  const branch = master.create()

  branch.subscribe({ pointers: { pointer2: true } }, (val, type) => {
    if (type === 'new') {
      t.equals(
        val.get(['deeper', 'pointer1', 'deeper', 'field', 'compute']), 'is a thing',
        'pointer2 fired for original'
      )
    } else if (type === 'update') {
      t.equals(
        val.get(['deeper', 'pointer1', 'deeper', 'field', 'compute']), 'override',
        'pointer2 fired for override'
      )
    }
  })

  branch.subscribe({ pointers: { pointer3: true } }, (val, type) => {
    if (type === 'new') {
      t.equals(
        val.get(['deeper', 'pointer1', 'deeper', 'field', 'compute']), 'is a thing',
        'pointer3 fired for original'
      )
    } else if (type === 'update') {
      t.equals(
        val.get(['deeper', 'pointer1', 'deeper', 'field', 'compute']), 'override',
        'pointer3 fired for override'
      )
    }
  })

  branch.set({
    key: 'branch',
    otherDeep: {
      deeper: {
        field: 'override'
      }
    }
  })
})
