'use strict'
const test = require('tape')
const { create, set, get, struct, compute } = require('../../')

test('context - basic', t => {
  const instance = create(struct, {
    parent: {
      child: {
        grandChild: 'rebel'
      }
    }
  })

  const extended = create(instance, {
    parent: {
      child: {
        grandChild: {
          age: 17
        }
      }
    }
  })

  t.equals(compute(instance.parent.child.grandChild), 'rebel', 'instance has primitive')
  t.equals(compute(instance.parent.child.grandChild), 'rebel', 'extended has primitive')
  t.notOk(instance.parent.child.grandChild.age, 'instance does not have age')
  t.equals(compute(extended.parent.child.grandChild.age), 17, 'extended has age')

  const grandChild = get(instance, ['parent', 'child', 'grandChild'])
  set(grandChild, { name: 'Berk' })

  t.equals(compute(instance.parent.child.grandChild.name), 'Berk', 'instance has name')
  t.equals(compute(grandChild.name), 'Berk', 'assigned sub-struct has name')
  t.notOk(extended.parent.child.grandChild.name, 'extended does not have name')

  t.end()
})

test('context - props', t => {
  const students = create(struct, {
    props: {
      default: {
        gender: 'female'
      }
    },
    first: {
      name: 'Burcu'
    },
    second: {
      name: 'Mert',
      gender: 'male'
    }
  })

  t.end()
})

