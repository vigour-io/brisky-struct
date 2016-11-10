'use strict'
const test = require('tape')
const struct = require('../../')

test('context - nested', t => {
  const feline = struct({
    flies: false,
    runs: true,
    swims: false
  })

  const cat = feline.create()

  var slow = {}

  const bird = struct({
    flies: true,
    runs: {
      val: false,
      on: {
        data: {
          slow (t) {
            const p = t.path().join('.')
            slow[p] = slow[p] || { val: t.compute(), count: 0 }
            slow[p].count++
          }
        }
      }
    },
    swims: false
  })
  bird._k = 'bird'

  const pigeon = bird.create()
  pigeon._k = 'pigeon' // maybe make a key property

  const seagull = bird.create({
    speed: 11,
    swims: true,
    likes: {
      props: { woundedPigeon: pigeon },
      woundedPigeon: { flies: false }
    }
  })
  seagull._k = 'seagull'

  const animals = struct({ types: { pigeon, seagull, cat } })
  animals._k = 'animals'

  animals.set({
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

  t.equals(
    animals.get(['mySeagull', 'speed']).compute(), 11,
    'my seagull has 11 speed'
  )

  t.ok(animals.get(['mySeagull', 'flies']).compute(), 'my seagull flies')

  t.equals(
    animals.get(['mySeagull', 'flies']).context, animals.get('mySeagull'),
    'my seagull flies in context'
  )

  t.equals(
    animals.get(['mySeagull', 'flies']).contextLevel, 1,
    'contextLevel is 1'
  )

  t.ok(animals.get(['mySeagull', 'swims']).compute(), 'my seagull swims')

  t.equals(
    animals.get(['mySeagull', 'swims']).context, animals.get('mySeagull'),
    'my seagull swims in context'
  )

  t.equals(
    animals.get(['mySeagull', 'swims']).contextLevel, 1,
    'contextLevel is 1'
  )

  t.ok(animals.get(['mySeagull', 'runs']).compute(), 'my seagull runs')

  t.notOk(animals.get(['mySeagull', 'runs']).context, 'my seagull runs out of context')

  t.equals(
    animals.get(['mySeagull', 'hunts', 'kitten', 'runs']).compute(), false,
    'my seagull hunts kitten which can not run'
  )

  t.notOk(
    animals.get(['mySeagull', 'hunts', 'kitten', 'runs']).context,
    'hunted kitten can not run out of context'
  )

  t.equals(
    animals.get(['mySeagull', 'hunts', 'kitten', 'swims']).context,
    animals.get(['mySeagull', 'hunts', 'kitten']),
    'hunted kitten can not swim in context'
  )

  t.equals(
    animals.get(['mySeagull', 'hunts', 'kitten', 'swims']).contextLevel, 1,
    'contextLevel is 1'
  )

  // t.equals(compute(get(animals, ['mySeagull', 'likes', 'woundedPigeon', 'flies'])), false, 'my seagull likes wounded pigeon which can not fly')
  // t.equals(get(animals, ['mySeagull', 'likes', 'woundedPigeon', 'swims']).context, get(animals, ['mySeagull', 'likes', 'woundedPigeon']), 'wounded pigeon can not swim in context')
  // t.equals(get(animals, ['mySeagull', 'likes', 'woundedPigeon', 'swims']).contextLevel, 1, 'contextLevel is 1')
  // t.equals(get(animals, ['mySeagull', 'likes', 'woundedPigeon', 'swims']).context.context, get(animals, ['mySeagull']), 'wounded pigeon can not swim in context of context')
  // t.equals(get(animals, ['mySeagull', 'likes', 'woundedPigeon', 'swims']).context.contextLevel, 2, 'contextLevel of context is 2')
  // t.equals(parent(get(animals, ['mySeagull', 'hunts', 'kitten', 'swims'])), get(animals, ['mySeagull', 'hunts', 'kitten']), 'parent of swims is kitten')
  // t.equals(parent(get(animals, ['mySeagull', 'likes', 'woundedPigeon', 'runs'])), get(animals, ['mySeagull', 'likes', 'woundedPigeon']), 'parent of runs is woundedPigeon')

  // slow = {}

  // console.log(' \n OK HERE--------------------')
  // set(bird, { runs: { slow: true } }, 'stamp1')
  // t.deepEqual(slow, {
  //   'bird.runs': { val: false, count: 1 },
  //   'seagull.runs': { val: false, count: 1 },
  //   'pigeon.runs': { val: false, count: 1 },
  //   // why does this fire twice? -- once for pigeon and once for bird
  //   'animals.mySeagull.likes.woundedPigeon.runs': { val: false, count: 1 },
  //   'animals.mySeagull.runs': { val: true, count: 1 }
  // }, 'first slow event fired as expected')

  // slow = {}
  // set(animals, { mySeagull: { likes: { woundedPigeon: { runs: { slow: false } } } } }, 'stamp2')
  // t.deepEqual(slow, {
  //   'animals.mySeagull.likes.woundedPigeon.runs': { val: false, count: 1 },
  // }, 'second slow event fired as expected')

  t.end()
})
