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

  master.subscribe({ otherDeep: { pointer1: true } }, (val, type) => {
    if (type === 'update') {
      t.fail('should not fire for master')
    }
  })

  master.subscribe({ otherDeep: { pointer2: true } }, (val, type) => {
    if (type === 'update') {
      t.fail('should not fire for master')
    }
  })

  const branch1 = master.create()
  const branch2 = master.create()

  branch1.subscribe({ otherDeep: { pointer1: true } }, (val, type) => {
    if (type === 'new') {
      t.equals(
        val.compute(), 'is a thing',
        'branch1 pointer1 fired for original'
      )
    } else if (type === 'update') {
      t.equals(
        val.compute(), 'override',
        'branch1 pointer1 fired for override'
      )
    }
  })

  branch1.subscribe({ otherDeep: { pointer2: true } }, (val, type) => {
    if (type === 'new') {
      t.equals(
        val.compute(), 'is a thing',
        'branch1 pointer2 fired for original'
      )
    } else if (type === 'update') {
      t.equals(
        val.compute(), 'override',
        'branch1 pointer2 fired for override'
      )
    }
  })

  branch2.subscribe({ otherDeep: { pointer1: true } }, (val, type) => {
    if (type === 'new') {
      t.equals(
        val.compute(), 'is a thing',
        'branch2 pointer1 fired for original'
      )
    } else if (type === 'update') {
      t.equals(
        val.compute(), 'other override',
        'branch2 pointer1 fired for override'
      )
    }
  })

  branch2.subscribe({ otherDeep: { pointer2: true } }, (val, type) => {
    if (type === 'new') {
      t.equals(
        val.compute(), 'is a thing',
        'branch2 pointer2 fired for original'
      )
    } else if (type === 'update') {
      t.equals(
        val.compute(), 'other override',
        'branch2 pointer2 fired for override'
      )
    }
  })

  branch1.set({
    key: 'branch1',
    deep: {
      real: 'override'
    }
  })

  branch1.set({
    key: 'branch2',
    deep: {
      real: 'other override'
    }
  })
})

test('references - field subscription', t => {
  t.plan(8)

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

  master.subscribe({ otherDeep: { pointer1: true } }, (val, type) => {
    if (type === 'update') {
      t.fail('should not fire for master')
    }
  })

  master.subscribe({ otherDeep: { pointer2: true } }, (val, type) => {
    if (type === 'update') {
      t.fail('should not fire for master')
    }
  })

  const branch1 = master.create()
  const branch2 = master.create()

  branch1.subscribe({ otherDeep: { pointer1: true } }, (val, type) => {
    if (type === 'new') {
      t.equals(
        val.get(['field', 'compute']), 'is a thing',
        'branch1 pointer1 fired for original'
      )
    } else if (type === 'update') {
      t.equals(
        val.get(['field', 'compute']), 'override',
        'branch1 pointer1 fired for override'
      )
    }
  })

  branch1.subscribe({ otherDeep: { pointer2: true } }, (val, type) => {
    if (type === 'new') {
      t.equals(
        val.get(['field', 'compute']), 'is a thing',
        'branch1 pointer2 fired for original'
      )
    } else if (type === 'update') {
      t.equals(
        val.get(['field', 'compute']), 'override',
        'branch1 pointer2 fired for override'
      )
    }
  })

  branch2.subscribe({ otherDeep: { pointer1: true } }, (val, type) => {
    if (type === 'new') {
      t.equals(
        val.get(['field', 'compute']), 'is a thing',
        'branch2 pointer1 fired for original'
      )
    } else if (type === 'update') {
      t.equals(
        val.get(['field', 'compute']), 'other override',
        'branch2 pointer1 fired for other override'
      )
    }
  })

  branch2.subscribe({ otherDeep: { pointer2: true } }, (val, type) => {
    if (type === 'new') {
      t.equals(
        val.get(['field', 'compute']), 'is a thing',
        'branch2 pointer2 fired for original'
      )
    } else if (type === 'update') {
      t.equals(
        val.get(['field', 'compute']), 'other override',
        'branch2 pointer2 fired for other override'
      )
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

  branch2.set({
    key: 'branch2',
    deep: {
      real: {
        field: 'other override'
      }
    }
  })
})

test('references - field subscription local', t => {
  t.plan(4)

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

  master.subscribe({ otherDeep: { pointer3: true } }, (val, type) => {
    if (type === 'update') {
      t.fail('should not fire for master')
    }
  })

  const branch1 = master.create()
  const branch2 = master.create()

  branch1.subscribe({ otherDeep: { pointer3: true } }, (val, type) => {
    if (type === 'new') {
      t.equals(
        val.get(['field', 'compute']), 'is a thing',
        'branch1 pointer3 fired for the original'
      )
    } else if (type === 'update') {
      t.equals(
        val.get(['field', 'compute']), 'is other override',
        'branch1 pointer3 fired for other override'
      )
    }
  })

  branch2.subscribe({ otherDeep: { pointer3: true } }, (val, type) => {
    if (type === 'new') {
      t.equals(
        val.get(['field', 'compute']), 'is a thing',
        'branch2 pointer3 fired for the original'
      )
    } else if (type === 'update') {
      t.equals(
        val.get(['field', 'compute']), 'is double other override',
        'branch2 pointer3 fired for double other override'
      )
    }
  })

  branch1.set({
    key: 'branch1',
    deep: {
      otherReal: {
        field: 'is other override'
      }
    },
    otherDeep: {
      pointer1: ['@', 'root', 'deep', 'otherReal']
    }
  })

  branch2.set({
    key: 'branch1',
    deep: {
      otherReal: {
        field: 'is double other override'
      }
    },
    otherDeep: {
      pointer1: ['@', 'root', 'deep', 'otherReal']
    }
  })
})

test('references - deep field subscription', t => {
  t.plan(2)

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

  master.subscribe({ pointers: { pointer2: true } }, (val, type) => {
    if (type === 'update') {
      t.fail('should not fire for master')
    }
  })

  master.subscribe({ pointers: { pointer3: true } }, (val, type) => {
    if (type === 'update') {
      t.fail('should not fire for master')
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
      // will pass this later
      // t.equals(
      //   val.get(['deeper', 'pointer1', 'deeper', 'field', 'compute']), 'override',
      //   'pointer2 fired for override'
      // )
    }
  })

  branch.subscribe({ pointers: { pointer3: true } }, (val, type) => {
    if (type === 'new') {
      t.equals(
        val.get(['deeper', 'pointer1', 'deeper', 'field', 'compute']), 'is a thing',
        'pointer3 fired for original'
      )
    } else if (type === 'update') {
      // will pass this later
      // t.equals(
      //   val.get(['deeper', 'pointer1', 'deeper', 'field', 'compute']), 'override',
      //   'pointer3 fired for override'
      // )
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
