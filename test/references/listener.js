const test = require('tape')
const { create: struct } = require('../../')

test('references - with array keys in context', t => {
  const master = struct({
    k: 'master',
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
    k: 'branch1',
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
    k: 'branch2',
    movieB: {
      favourite: true
    }
  })

  const branch3 = branch1.create({
    k: 'branch3',
    movieC: {
      progress: 0.3
    }
  })

  const branch4 = branch3.create({
    k: 'branch4',
    movieB: {
      favourite: false
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

  branch1.set({
    movieB: {
      progress: 0.3
    }
  })

  branch2.set({
    movieC: {
      progress: 0.4
    }
  })

  branch3.set({
    movieA: {
      favourite: true
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
  t.same(
    branch3.get('movies').serialize(),
    [['@', 'root', 'movieA'], ['@', 'root', 'movieB'], ['@', 'root', 'movieC']],
    'list of movies is corect on branch3'
  )
  t.same(
    branch4.get('movies').serialize(),
    [['@', 'root', 'movieA'], ['@', 'root', 'movieB'], ['@', 'root', 'movieC']],
    'list of movies is corect on branch4'
  )

  /*
  t.equals(
    branch1.get(['movies', '0', 'val', 'root']), branch1, // branch3 - wrong
    'branch1 movie0 is correct'
  )
  */

  console.log('branch1 movieA', branch1.get(['movies', '0', 'val', 'root', 'k', 'compute'])) // wrong master
  console.log('branch1 movieB', branch1.get(['movies', '1', 'val', 'root', 'k', 'compute']))
  console.log('branch1 movieC', branch1.get(['movies', '2', 'val', 'root', 'k', 'compute'])) // wrong branch1

  console.log('branch2 moiveA', branch2.get(['movies', '0', 'val', 'root', 'k', 'compute'])) // wrong master
  console.log('branch2 movieB', branch2.get(['movies', '1', 'val', 'root', 'k', 'compute'])) // wrong branch2
  console.log('branch2 movieC', branch2.get(['movies', '2', 'val', 'root', 'k', 'compute']))

  console.log('branch3 moiveA', branch3.get(['movies', '0', 'val', 'root', 'k', 'compute']))
  console.log('branch3 movieB', branch3.get(['movies', '1', 'val', 'root', 'k', 'compute']))
  console.log('branch3 movieC', branch3.get(['movies', '2', 'val', 'root', 'k', 'compute']))

  console.log('branch4 moiveA', branch4.get(['movies', '0', 'val', 'root', 'k', 'compute']))
  console.log('branch4 movieB', branch4.get(['movies', '1', 'val', 'root', 'k', 'compute'])) // wrong branch4
  console.log('branch4 movieC', branch4.get(['movies', '2', 'val', 'root', 'k', 'compute']))

  t.same(
    branch1.get(['movies', '1', 'progress', 'compute']), 0.3,
    'second movie on branch1 has correct progress'
  )
  t.same(
    branch1.get(['movies', '2', 'progress', 'compute']), 0.2,
    'third movie on branch1 has correct progress'
  )
  t.same(
    branch2.get(['movies', '1', 'favourite', 'compute']), true,
    'second movie on branch2 is favourited'
  )
  t.same(
    branch2.get(['movies', '2', 'favourite', 'compute']), true,
    'third movie on branch2 is favourited'
  )
  t.same(
    branch2.get(['movies', '2', 'progress', 'compute']), 0.4,
    'third movie on branch2 has correct progress'
  )
  t.same(
    branch3.get(['movies', '2', 'progress', 'compute']), 0.3,
    'third movie on branch3 has correct progress'
  )
  t.same(
    branch3.get(['movies', '0', 'favourite', 'compute']), true,
    'first movie on branch3 is favourited'
  )
  t.same(
    branch4.get(['movies', '1', 'favourite', 'compute']), false,
    'second movie on branch4 is unfavourited'
  )

  t.end()
})

test('references - listeners', t => {
  t.plan(9)

  let master = void 0
  let branch1 = void 0
  let branch2 = void 0

  master = struct({
    types: {
      pointer: {
        on: {
          data (val, stamp, struct) {
            if (val.compute) {
              val = val.compute()
            }
            if (val === 'override' && struct.root(true) === branch1) {
              if (struct.key === 'pointer1') {
                t.pass('pointer1 fired for override')
              } else if (struct.key === 'pointer2') {
                t.pass('pointer2 fired for override')
              }
            } else if (val === 'double override' && struct.root(true) === branch2) {
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
              struct.root(true) === master
            ) {
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
    deep: {
      pointer4: {
        type: 'pointer',
        val: ['@', 'root', 'pointer2']
      }
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
      pointer1: ['@', 'root', 'realThing'],
      pointer2: ['@', 'root', 'pointer1'],
      pointer3: ['@', 'root', 'realThing'],
      deep: {
        pointer4: ['@', 'root', 'pointer2']
      }
    },
    'branch1 has pointer1, pointer2, pointer3 & pointer4'
  )

  t.same(
    branch2.serialize(),
    {
      realThing: 'double override',
      pointer1: ['@', 'root', 'realThing'],
      pointer2: ['@', 'root', 'pointer1'],
      pointer3: ['@', 'root', 'realThing'],
      deep: {
        pointer4: ['@', 'root', 'pointer2']
      }
    },
    'branch2 has pointer1, pointer2, pointer3 & pointer4'
  )
})
