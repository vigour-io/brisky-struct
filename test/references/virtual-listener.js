const test = require('tape')
const { create: struct } = require('../../')

test('references - with array keys in context', t => {
  const master = struct({
    movieC: {
      year: 1998,
      imdb: 7.7,
      title: 'Run Lola Run'
    },
    movies: [
      ['@', 'root', 'movieC']
    ]
  })

  const branch1 = master.create({
    movieC: {
      favourite: true
    }
  })

  master.set({
    movieB: {
      year: 2003,
      imdb: 7.7,
      title: 'Good Bye Lenin'
    },
    movies: [
      ['@', 'root', 'movieB'],
      ['@', 'root', 'movieC']
    ]
  })

  branch1.set({
    movieC: {
      progress: 0.2
    }
  })

  t.same(
    master.get('movies').serialize(),
    [['@', 'root', 'movieB'], ['@', 'root', 'movieC']],
    'list of movies is corect on master'
  )
  t.same(
    branch1.get('movies').serialize(),
    [['@', 'root', 'movieB'], ['@', 'root', 'movieC']],
    'list of movies is corect on branch1'
  )

  const branch2 = branch1.create({
    movieC: {
      favourite: true
    }
  })

  master.set({
    movieA: {
      year: 2004,
      imdb: 7.5,
      title: 'The Edukators'
    },
    movies: [
      ['@', 'root', 'movieA'],
      ['@', 'root', 'movieB'],
      ['@', 'root', 'movieC']
    ]
  })

  branch2.set({
    movieC: {
      progress: 0.2
    }
  })

  t.same(
    master.get('movies').serialize(),
    [['@', 'root', 'movieA'], ['@', 'root', 'movieB'], ['@', 'root', 'movieC']],
    'list of movies is corect on master'
  )
  t.same(
    branch1.get('movies').serialize(),
    [['@', 'root', 'movieA'], ['@', 'root', 'movieB'], ['@', 'root', 'movieC']],
    'list of movies is corect on branch1'
  )
  t.same(
    branch2.get('movies').serialize(),
    [['@', 'root', 'movieA'], ['@', 'root', 'movieB'], ['@', 'root', 'movieC']],
    'list of movies is corect on branch2'
  )

  t.end()
})

test('references - virtual listeners', t => {
  t.plan(9)

  let master = void 0
  let branch1 = void 0
  let branch2 = void 0

  master = struct({
    types: {
      pointer: {
        on: {
          data (val, stamp, struct) {
            if (val === 'override' && struct._c === branch1) {
              if (struct.key === 'pointer1') {
                t.pass('pointer1 fired for override')
              } else if (struct.key === 'pointer2') {
                t.pass('pointer2 fired for override')
              }
            } else if (val === 'double override' && struct._c === branch2) {
              if (struct.key === 'pointer1') {
                t.pass('pointer1 fired for double override')
              } else if (struct.key === 'pointer2') {
                t.pass('pointer2 fired for double override')
              } else if (struct.key === 'pointer3') {
                t.pass('pointer3 fired for double override')
              } else if (struct.key === 'pointer4') {
                t.pass('pointer4 fired for double override')
              }
            } else if (
              ~['override', 'double override'].indexOf(val) &&
              !struct._c) {
              t.fail('master emitters should not fire')
            }
          }
        }
      }
    },
    realThing: 'is a thing',
    pointer1: {
      type: 'pointer',
      val: ['@', 'root', 'realThing']
    },
    pointer2: {
      type: 'pointer',
      val: ['@', 'root', 'pointer1']
    }
  })

  master.key = 'master'

  branch1 = master.create()

  branch1.set({
    realThing: 'override',
    pointer3: {
      type: 'pointer',
      val: ['@', 'root', 'realThing']
    },
    pointer4: {
      type: 'pointer',
      val: ['@', 'root', 'pointer2']
    }
  })

  branch2 = branch1.create()

  branch2.set({
    realThing: 'double override'
  })

  t.same(
    master.serialize(),
    {
      realThing: 'is a thing',
      pointer1: ['@', 'root', 'realThing'],
      pointer2: ['@', 'root', 'pointer1']
    },
    'master has pointer1 & pointer2'
  )

  t.same(
    branch1.serialize(),
    {
      realThing: 'override',
      pointer1: ['@', 'root', 'master', 'realThing'],
      pointer2: ['@', 'root', 'pointer1'],
      pointer3: ['@', 'root', 'realThing'],
      pointer4: ['@', 'root', 'pointer2']
    },
    'branch1 has pointer1, pointer2, pointer3 & pointer4'
  )

  t.same(
    branch2.serialize(),
    {
      realThing: 'double override',
      pointer1: ['@', 'root', 'master', 'realThing'],
      pointer2: ['@', 'root', 'pointer1'],
      pointer3: ['@', 'root', 'realThing'],
      pointer4: ['@', 'root', 'pointer2']
    },
    'branch2 has pointer1, pointer2, pointer3 & pointer4'
  )
})
