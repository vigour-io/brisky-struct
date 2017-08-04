const test = require('tape')
const { create: struct } = require('../../')

const a = []
a[5e6] = void 0
var base = Date.now()
a.forEach(() => true)
base = Date.now() - base

test('references - get performance', t => {
  const master = struct({
    key: 'master',
    pointers: {
      pointer2: {
        val: ['@', 'root', 'deep', 'real'],
        field: 'is a thing'
      },
      pointer3: {
        val: ['@', 'parent', 'pointer2'],
        field: 'merge override'
      }
    },
    deep: {
      real: {
        val: 42,
        deeper: {
          pointer1: {
            val: ['@', 'root', 'otherDeep'],
            extra: 'is a value'
          }
        }
      }
    },
    otherDeep: {
      deeper: {
        field: 'is a thing'
      }
    }
  })

  t.equals(
    master.get(['pointers', 'pointer3', 'compute']),
    42,
    'pointer3 is 42'
  )
  t.equals(
    master.get(['pointers', 'pointer2', 'compute']),
    42,
    'pointer2 is a 42'
  )
  t.equals(
    master.get(['pointers', 'pointer3', 'field', 'compute']),
    'merge override',
    'pointer3 field is merge override'
  )
  t.equals(
    master.get(['pointers', 'pointer2', 'field', 'compute']),
    'is a thing',
    'pointer2 field is a thing'
  )
  t.equals(
    master.get(['pointers', 'pointer3', 'deeper', 'pointer1', 'extra', 'compute']),
    'is a value',
    'pointer3 deeper pointer1 extra is a value'
  )
  t.equals(
    master.get(['pointers', 'pointer2', 'deeper', 'pointer1', 'extra', 'compute']),
    'is a value',
    'pointer2 deeper pointer1 extra is a value'
  )
  t.equals(
    master.get(['pointers', 'pointer3', 'deeper', 'pointer1', 'deeper', 'field', 'compute']),
    'is a thing',
    'pointer3 deeper pointer1 deeper field extra is a thing'
  )
  t.equals(
    master.get(['pointers', 'pointer2', 'deeper', 'pointer1', 'deeper', 'field', 'compute']),
    'is a thing',
    'pointer2 deeper pointer1 deeper field extra is a thing'
  )

  var d = Date.now()

  var i = 1e3
  while (i--) {
    master.get(['pointers', 'pointer3', 'compute'])
    master.get(['pointers', 'pointer2', 'compute'])
    master.get(['pointers', 'pointer3', 'field', 'compute'])
    master.get(['pointers', 'pointer2', 'field', 'compute'])
    master.get(['pointers', 'pointer3', 'deeper', 'pointer1', 'extra', 'compute'])
    master.get(['pointers', 'pointer2', 'deeper', 'pointer1', 'extra', 'compute'])
    master.get(['pointers', 'pointer3', 'deeper', 'pointer1', 'deeper', 'field', 'compute'])
    master.get(['pointers', 'pointer2', 'deeper', 'pointer1', 'deeper', 'field', 'compute'])
  }

  d = Date.now() - d

  console.log('get through references:', d, 'ms')
  t.ok(d < base, `get through references take less than ${base}ms`)

  const branch = master.create({
    pointers: {
      pointer2: {
        field: 'override'
      },
      pointer3: {
        field: 'merge double override'
      }
    },
    deep: {
      real: {
        val: 24,
        deeper: {
          pointer1: {
            extra: 'value override'
          }
        }
      }
    },
    otherDeep: {
      deeper: {
        field: 'override'
      }
    }
  })

  t.equals(
    branch.get(['pointers', 'pointer3', 'compute']),
    24,
    'pointer3 is 24'
  )
  t.equals(
    branch.get(['pointers', 'pointer2', 'compute']),
    24,
    'pointer2 is a 24'
  )
  t.equals(
    branch.get(['pointers', 'pointer3', 'field', 'compute']),
    'merge double override',
    'pointer3 field is merge double override'
  )
  t.equals(
    branch.get(['pointers', 'pointer2', 'field', 'compute']),
    'override',
    'pointer2 field is override'
  )
  t.equals(
    branch.get(['pointers', 'pointer3', 'deeper', 'pointer1', 'extra', 'compute']),
    'value override',
    'pointer3 deeper pointer1 extra is a value override'
  )
  t.equals(
    branch.get(['pointers', 'pointer2', 'deeper', 'pointer1', 'extra', 'compute']),
    'value override',
    'pointer2 deeper pointer1 extra is a value override'
  )
  t.equals(
    branch.get(['pointers', 'pointer3', 'deeper', 'pointer1', 'deeper', 'field', 'compute']),
    'override',
    'pointer3 deeper pointer1 deeper field extra is override'
  )
  t.equals(
    branch.get(['pointers', 'pointer2', 'deeper', 'pointer1', 'deeper', 'field', 'compute']),
    'override',
    'pointer2 deeper pointer1 deeper field extra is override'
  )

  d = Date.now()

  i = 1e3
  while (i--) {
    branch.get(['pointers', 'pointer3', 'compute'])
    branch.get(['pointers', 'pointer2', 'compute'])
    branch.get(['pointers', 'pointer3', 'field', 'compute'])
    branch.get(['pointers', 'pointer2', 'field', 'compute'])
    branch.get(['pointers', 'pointer3', 'deeper', 'pointer1', 'extra', 'compute'])
    branch.get(['pointers', 'pointer2', 'deeper', 'pointer1', 'extra', 'compute'])
    branch.get(['pointers', 'pointer3', 'deeper', 'pointer1', 'deeper', 'field', 'compute'])
    branch.get(['pointers', 'pointer2', 'deeper', 'pointer1', 'deeper', 'field', 'compute'])
  }

  d = Date.now() - d

  console.log('get through virtual references:', d, 'ms')
  t.ok(d < base * 2, `get through virtual references take less than ${Math.round(base * 2)}ms`)

  t.end()
})

test('references - emitter and subscription performance', t => {
  const master = struct({
    types: {
      pointer: {
        on: {
          data: () => true
        }
      }
    },
    deep: {
      real: {
        field: 'is a thing',
        list: ['@', 'root', 'otherDeep']
      }
    },
    otherDeep: {
      pointer1: {
        type: 'pointer',
        val: ['@', 'root', 'deep', 'real']
      },
      pointer2: {
        type: 'pointer',
        val: ['@', 'parent', 'pointer1']
      }
    }
  })

  const branch1 = master.create()

  branch1.set({
    otherDeep: {
      pointer3: {
        type: 'pointer',
        val: ['@', 'parent', 'pointer2']
      }
    }
  })

  branch1.subscribe({ otherDeep: { pointer2: true } }, () => true)

  let d = Date.now()

  let i = 1e3
  while (i--) {
    branch1.set({
      deep: {
        real: {
          field: i % 2 ? 'override' : 'not override'
        }
      }
    })
  }

  const branch2 = branch1.create()

  branch2.subscribe({ otherDeep: { pointer3: true } }, () => true)

  i = 1e3
  while (i--) {
    branch2.set({
      deep: {
        real: {
          val: i % 2 ? 'override' : 'not override'
        }
      }
    })
  }

  d = Date.now() - d
  console.log('virtual reference emitters and subscriptions:', d, 'ms')
  t.ok(d < base * 3, `virtual reference emitters and subscriptions take less than ${Math.round(base * 3)}ms`)

  t.end()
})
