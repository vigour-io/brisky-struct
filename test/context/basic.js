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
    grandChild.parent(), instance.get(['_parent', 'child']),
    '_parent of grandChild is child'
  )

  t.equals(
    extended.get(['_parent', 'child', 'grandChild']).parent(), extended.get(['_parent', 'child']),
    'extended child is _parent of extended grandChild'
  )

  t.end()
})

// test('context - props', t => {
//   const female = create(struct, {
//     gender: 'female'
//   })

//   const male = create(struct, {
//     gender: 'male'
//   })

//   const students = create(struct, {
//     props: {
//       default: female
//     },
//     types: { female, male },
//     first: {
//       name: 'Burcu'
//     },
//     second: {
//       name: 'Mert',
//       type: 'male'
//     }
//   })

//   t.equals(compute(get(students, ['first', 'gender']).compute(), 'female', 'gender of Burcu is female')
//   t.equals(get(students, ['first', 'gender']).context, get(students, 'first'), 'gender is in context')
//   t.equals(get(students, ['first', 'gender']).contextLevel, 1, 'contextLevel is 1')
//   t.equals(parent(get(students, ['first', 'gender'])), get(students, 'first'), '_parent of gender for Burcu is first')

//   t.equals(compute(get(students, ['second', 'gender']).compute(), 'male', 'gender of Mert is male')
//   t.equals(get(students, ['second', 'gender']).context, get(students, 'second'), 'gender is in context')
//   t.equals(get(students, ['second', 'gender']).contextLevel, 1, 'contextLevel is 1')
//   t.equals(parent(get(students, ['second', 'gender'])), get(students, 'second'), '_parent of gender for Mert is second')

//   set(students, { third: { name: 'Lale', type: 'female' } })
//   t.equals(compute(get(students, ['third', 'gender'])), 'female', 'gender of Lale is female')
//   t.equals(get(students, ['third', 'gender']).context, get(students, 'third'), 'gender is in context')
//   t.equals(get(students, ['third', 'gender']).contextLevel, 1, 'contextLevel is 1')
//   t.equals(parent(get(students, ['third', 'gender'])), get(students, 'third'), '_parent of gender for Lale is third')

//   t.end()
// })
