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

  t.equals(compute(get(instance, ['parent', 'child', 'grandChild'])), 'rebel', 'instance has primitive')
  t.equals(compute(get(instance, ['parent', 'child', 'grandChild'])), 'rebel', 'extended has primitive')
  t.notOk(get(instance, ['parent', 'child', 'grandChild', 'age']), 'instance does not have age')
  t.equals(compute(get(extended, ['parent', 'child', 'grandChild', 'age'])), 17, 'age of extended grandChild is 17')
  const grandChild = get(instance, ['parent', 'child', 'grandChild'])
  set(grandChild, { name: 'Berk' })

  t.equals(compute(get(instance, ['parent', 'child', 'grandChild', 'name'])), 'Berk', 'instance has name')
  t.equals(compute(get(grandChild, 'name')), 'Berk', 'assigned sub-struct has name')
  t.equals(compute(get(extended, ['parent', 'child', 'grandChild', 'name'])), 'Berk', 'extended has name')

  t.end()
})

test('context - props', t => {
  const female = create(struct, {
    gender: 'female'
  })

  const male = create(struct, {
    gender: 'male'
  })

  const students = create(struct, {
    props: {
      default: female
    },
    types: {
      female: female,
      male: male
    },
    first: {
      name: 'Burcu'
    },
    second: {
      name: 'Mert',
      type: 'male'
    }
  })

  t.equals(compute(get(students, ['first', 'gender'])), 'female', 'gender of Burcu is female')
  t.equals(get(students, ['first', 'gender']).context, get(students, 'first'), 'gender should be in context')
  t.equals(get(students, ['first', 'gender']).contextLevel, 1, 'contextLevel should be 1')

  t.equals(compute(get(students, ['second', 'gender'])), 'male', 'gender of Mert is male')
  t.equals(get(students, ['second', 'gender']).context, get(students, 'second'), 'gender should be in context')
  t.equals(get(students, ['second', 'gender']).contextLevel, 1, 'contextLevel should be 1')

  set(students, { third: { name: 'Lale', type: 'female' } })
  t.equals(compute(get(students, ['third', 'gender'])), 'female', 'gender of Lale is female')
  t.equals(get(students, ['third', 'gender']).context, get(students, 'third'), 'gender should be in context')
  t.equals(get(students, ['third', 'gender']).contextLevel, 1, 'contextLevel should be 1')

  t.end()
})