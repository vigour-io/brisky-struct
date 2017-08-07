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
        'branch2 pointer1 fired for other override'
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
        'branch2 pointer2 fired for other override'
      )
    }
  })

  branch1.set({
    key: 'branch1',
    deep: {
      real: 'override'
    }
  })

  branch2.set({
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

test('references - circular subscription', t => {
  t.plan(9)

  const master = struct({
    key: 'master',
    list: {
      i1: {
        items: {
          type: 'list',
          sub1: ['@', 'root', 'list', 'i1'],
          sub2: ['@', 'root', 'list', 'i2'],
          sub3: ['@', 'root', 'list', 'i3']
        }
      },
      i2: {
        items: {
          type: 'list',
          sub2: ['@', 'root', 'list', 'i2'],
          sub4: ['@', 'root', 'list', 'i4']
        },
        other: 'master'
      },
      i3: {
        items: {
          type: 'list',
          sub2: ['@', 'root', 'list', 'i2'],
          sub4: ['@', 'root', 'list', 'i4']
        }
      },
      i4: {
        f1: 'v1'
      }
    }
  })

  master.subscribe({ items: { val: true } }, (val, type) => {
    if (type === 'update') {
      t.fail('should not fire for master')
    }
  })

  const branch1 = master.create()
  const branch2 = master.create()

  branch1.subscribe({ ref: { $switch: () => ({ items: { val: true } }) } }, (val, type) => {
    console.log('branch1', val.parent().key, val, type)
    if (val.parent().key === 'i1' && type === 'new') {
      t.equals(
        val.get(['sub1', 'bf1', 'compute']), false,
        'branch1 i1 bf1 fired for false'
      )
      t.equals(
        val.get(['sub2', 'bf2', 'compute']), false,
        'branch1 i1 sub2 bf2 fired for false'
      )
    } else if (val.parent().key === 'i3' && type === 'new') {
      t.equals(
        val.get(['sub2', 'bf2', 'compute']), false,
        'branch1 i3 sub2 bf2 fired for false'
      )
      t.equals(
        val.get(['sub4', 'sub', 'bf4', 'compute']), true,
        'branch1 i3 sub4 sub bf4 fired for false'
      )
      t.equals(
        val.get(['sub4', 'f1', 'compute']), 'v1',
        'branch1 i3 sub4 f1 fired for v1'
      )
    }
  })

  branch2.subscribe({ ref: { $switch: () => ({ items: { val: true } }) } }, (val, type) => {
    console.log('branch2', val.parent().key, val, type)
    if (val.parent().key === 'i2' && type === 'new') {
      t.equals(
        val.get(['sub3', 'bf3', 'compute']), false,
        'branch2 i2 sub3 bf3 fired for false'
      )
      t.equals(
        val.get(['sub4', 'f1', 'compute']), true,
        'branch2 i2 sub4 f1 fired for true'
      )
    } else if (val.parent().key === 'i3' && type === 'new') {
      t.equals(
        val.get(['sub2', 'items', 'sub3', 'bf3', 'compute']), false,
        'branch1 i3 sub2 items sub3 bf3 fired for false'
      )
      t.equals(
        val.get(['sub4', 'f1', 'compute']), true,
        'branch2 i3 sub4 f1 fired for true'
      )
    }
  })

  branch1.set({
    key: 'branch1',
    list: {
      i1: { items: { sub1: { bf1: false } }, bf1: false },
      i2: { bf2: false },
      i4: { sub: { bf4: true } }
    },
    ref: ['@', 'root', 'list', 'i1'],
  })

  branch2.set({
    key: 'branch2',
    list: {
      i2: { items: { sub3: ['@', 'root', 'list', 'i3'] } },
      i3: { items: { sub2: { bf3: false } }, bf3: false },
      i4: { f1: true }
    },
    ref: ['@', 'root', 'list', 'i2']
  })

  branch1.set({
    ref: ['@', 'root', 'list', 'i3']
  })

  branch2.set({
    ref: ['@', 'root', 'list', 'i3']
  })
})

test('references - deep field subscription', t => {
  // eventually must be 4
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
