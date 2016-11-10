'use strict'
const test = require('tape')
const struct = require('../../')

test('context - basic', t => {
  const instance = struct({
    _parent: {
      child: {
        grandChild: 'rebel'
      }
    }
  })

  const extended = instance.create({
    _parent: {
      child: {
        grandChild: {
          age: 17
        }
      }
    }
  })

  t.equals(
    instance.get(['_parent', 'child', 'grandChild']).compute(), 'rebel',
    'instance has primitive'
  )

  t.equals(
    instance.get(['_parent', 'child', 'grandChild']).compute(), 'rebel',
    'extended has primitive'
  )

  t.notOk(
    instance.get(['_parent', 'child', 'grandChild', 'age']),
    'instance does not have age'
  )

  t.equals(
    extended.get(['_parent', 'child', 'grandChild', 'age']).compute(), 17,
    'age of extended grandChild is 17'
  )

  const grandChild = instance.get(['_parent', 'child', 'grandChild'])
  grandChild.set({ name: 'Berk' })

  t.equals(
    instance.get(['_parent', 'child', 'grandChild', 'name']).compute(), 'Berk',
    'instance has name'
  )

  t.equals(
    grandChild.get('name').compute(), 'Berk',
    'assigned sub-struct has name'
  )

  t.equals(
    extended.get(['_parent', 'child', 'grandChild', 'name']).compute(), 'Berk',
    'extended has name'
  )

  t.equals(
    grandChild.get('parent'), instance.get(['_parent', 'child']),
    'parent of grandChild is child'
  )

  t.equals(
    extended.get(['_parent', 'child', 'grandChild', 'parent']), extended.get(['_parent', 'child']),
    'extended child is parent of extended grandChild'
  )

  t.end()
})

test('context - props', t => {
  const female = struct({ gender: 'female' })

  const male = struct({ gender: 'male' })

  const students = struct({
    props: { default: female },
    types: { female, male },
    first: { name: 'Burcu' },
    second: {
      name: 'Mert',
      type: 'male'
    }
  })

  t.equals(
    students.get(['first', 'gender']).compute(), 'female',
    'gender of Burcu is female'
  )

  t.equals(
    students.get(['first', 'gender']).context, students.get('first'),
    'gender is in context'
  )

  t.equals(
    students.get(['first', 'gender']).contextLevel, 1,
    'contextLevel is 1'
  )

  t.equals(
    students.get(['first', 'gender', 'parent']), students.get('first'),
    'parent of gender for Burcu is first'
  )

  t.equals(
    students.get(['second', 'gender']).compute(), 'male',
    'gender of Mert is male'
  )

  t.equals(
    students.get(['second', 'gender']).context, students.get('second'),
    'gender is in context'
  )

  t.equals(
    students.get(['second', 'gender']).contextLevel, 1,
    'contextLevel is 1'
  )

  t.equals(
    students.get(['second', 'gender', 'parent']), students.get('second'),
    'parent of gender for Mert is second'
  )

  students.set({ third: { name: 'Lale', type: 'female' } })

  t.equals(
    students.get(['third', 'gender']).compute(), 'female',
    'gender of Lale is female'
  )

  t.equals(
    students.get(['third', 'gender']).context, students.get('third'),
    'gender is in context'
  )

  t.equals(
    students.get(['third', 'gender']).contextLevel, 1,
    'contextLevel is 1'
  )

  t.equals(
    students.get(['third', 'gender', 'parent']), students.get('third'),
    'parent of gender for Lale is third'
  )

  t.end()
})
