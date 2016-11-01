'use strict'
const test = require('tape')
const { create, set, get, struct, compute, path } = require('../../')

test('context - extend', t => {
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
    types: { female, male },
    first: {
      name: 'Burcu'
    },
    second: {
      name: 'Mert',
      type: 'male'
    }
  })

  t.equals(compute(get(students, ['first', 'gender'])), 'female', 'gender of Burcu is female')
  t.equals(get(students, ['first', 'gender']).context, get(students, 'first'), 'gender is in context')
  t.equals(get(students, ['first', 'gender']).contextLevel, 1, 'contextLevel is 1')

  t.equals(compute(get(students, ['second', 'gender'])), 'male', 'gender of Mert is male')
  t.equals(get(students, ['second', 'gender']).context, get(students, 'second'), 'gender is in context')
  t.equals(get(students, ['second', 'gender']).contextLevel, 1, 'contextLevel is 1')

  set(students, { third: { name: 'Lale', type: 'female' } })
  t.equals(compute(get(students, ['third', 'gender'])), 'female', 'gender of Lale is female')
  t.equals(get(students, ['third', 'gender']).context, get(students, 'third'), 'gender is in context')
  t.equals(get(students, ['third', 'gender']).contextLevel, 1, 'contextLevel is 1')

  t.end()
})

test('context - nested', t => {
  const feline = create(struct, {
    flies: false,
    runs: true,
    swims: false
  })

  const cat = create(feline)

  var slow = {}

  const bird = create(struct, {
    flies: true,
    runs: {
      val: false,
      on: {
        data: {
          slow (t) {
            if (slow[path(t).join('.')]) {
              slow[path(t).join('.')].count++
            } else {
              slow[path(t).join('.')] = { val: compute(t), count: 1 }
            }
          }
        }
      }
    },
    swims: false
  })
  bird.key = 'bird'

  const pigeon = create(bird)
  pigeon.key = 'pigeon'

  const seagull = create(bird, {
    speed: 11,
    swims: true,
    likes: {
      props: { woundedPigeon: pigeon },
      woundedPigeon: {
        flies: false,
      }
    }
  })
  seagull.key = 'seagull'

  const animals = create(struct, {
    types: {pigeon, seagull, cat}
  })
  animals.key = 'animals'

  set(animals, {
    mySeagull: {
      type: 'seagull',
      runs: true,
      hunts: {
        kitten: {
          type: 'cat',
          runs: false
        }
      }
    }
  })

  t.equals(compute(get(animals, ['mySeagull', 'speed'])), 11, 'my seagull has 11 speed')
  t.ok(compute(get(animals, ['mySeagull', 'flies'])), 'my seagull flies')
  t.equals(get(animals, ['mySeagull', 'flies']).context, get(animals, 'mySeagull'), 'my seagull flies in context')
  t.equals(get(animals, ['mySeagull', 'flies']).contextLevel, 1, 'contextLevel is 1')
  t.ok(compute(get(animals, ['mySeagull', 'swims'])), 'my seagull swims')
  t.equals(get(animals, ['mySeagull', 'swims']).context, get(animals, 'mySeagull'), 'my seagull swims in context')
  t.equals(get(animals, ['mySeagull', 'swims']).contextLevel, 1, 'contextLevel is 1')
  t.ok(compute(get(animals, ['mySeagull', 'runs'])), 'my seagull runs')
  t.notOk(get(animals, ['mySeagull', 'runs']).context, 'my seagull runs out of context')

  t.equals(compute(get(animals, ['mySeagull', 'hunts', 'kitten', 'runs'])), false, 'my seagull hunts kitten which can not run')
  t.notOk(get(animals, ['mySeagull', 'hunts', 'kitten', 'runs']).context, 'hunted kitten can not run out of context')
  t.equals(get(animals, ['mySeagull', 'hunts', 'kitten', 'swims']).context, get(animals, ['mySeagull', 'hunts', 'kitten']), 'hunted kitten can not swim in context')
  t.equals(get(animals, ['mySeagull', 'hunts', 'kitten', 'swims']).contextLevel, 1, 'contextLevel is 1')

  t.equals(compute(get(animals, ['mySeagull', 'likes', 'woundedPigeon', 'flies'])), false, 'my seagull likes wounded pigeon which can not fly')
  t.equals(get(animals, ['mySeagull', 'likes', 'woundedPigeon', 'swims']).context, get(animals, ['mySeagull', 'likes', 'woundedPigeon']), 'wounded pigeon can not swim in context')
  t.equals(get(animals, ['mySeagull', 'likes', 'woundedPigeon', 'swims']).contextLevel, 1, 'contextLevel is 1')
  t.equals(get(animals, ['mySeagull', 'likes', 'woundedPigeon', 'swims']).context.context, get(animals, ['mySeagull']), 'wounded pigeon can not swim in context of context')
  t.equals(get(animals, ['mySeagull', 'likes', 'woundedPigeon', 'swims']).context.contextLevel, 2, 'contextLevel of context is 2')

  set(bird, {runs: { slow: true}}, 'a')

  t.deepEqual(slow, {
    'seagull.runs': { val: false, count: 1 },
    'pigeon.runs': { val: false, count: 1 },
    'animals.mySeagull.likes.woundedPigeon.runs': { val: false, count: 1 },
    'bird.runs': { val: false, count: 1 },
    'animals.mySeagull.runs': { val: true, count: 1 }
  }, 'slow event fired as expected')

  t.end()
})
