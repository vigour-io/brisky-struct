const test = require('tape')
const { create: struct } = require('../../')

test('references - with array keys in context', t => {
  const master = struct({
    key: 'master',
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
    key: 'branch1',
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
    key: 'branch2',
    movieB: {
      favourite: true
    }
  })

  const branch3 = branch1.create({
    key: 'branch3',
    movieC: {
      progress: 0.3
    }
  })

  const branch4 = branch3.create({
    key: 'branch4',
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
      progress: 0.1
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

  t.equals(
    branch1.get(['movies', '0', 'favourite', 'compute']), void 0,
    'branch1 movieA favourite undefined'
  )
  t.equals(
    branch1.get(['movies', '1', 'progress', 'compute']), 0.1,
    'branch1 movieB progress 0.1'
  )
  t.equals(
    branch1.get(['movies', '2', 'progress', 'compute']), 0.2,
    'branch1 movieC progress 0.2'
  )
  t.equals(
    branch2.get(['movies', '0', 'favourite', 'compute']), void 0,
    'branch2 movieA favourite undefined'
  )
  t.equals(
    branch2.get(['movies', '1', 'favourite', 'compute']), true,
    'branch2 movieB favourite true'
  )
  t.equals(
    branch2.get(['movies', '2', 'favourite', 'compute']), true,
    'branch2 movieC favourite true'
  )
  t.equals(
    branch2.get(['movies', '2', 'progress', 'compute']), 0.4,
    'branch2 movieC progress 0.4'
  )
  t.equals(
    branch3.get(['movies', '0', 'favourite', 'compute']), true,
    'branch3 movieA favourite true'
  )
  t.equals(
    branch3.get(['movies', '1', 'progress', 'compute']), 0.1,
    'branch3 movieB progress 0.1'
  )
  t.equals(
    branch3.get(['movies', '1', 'favourite', 'compute']), void 0,
    'branch3 movieB favourite undefined'
  )
  t.equals(
    branch3.get(['movies', '2', 'progress', 'compute']), 0.3,
    'branch3 movieC progress 0.3'
  )
  t.equals(
    branch3.get(['movies', '2', 'favourite', 'compute']), true,
    'branch3 movieC favourite true'
  )
  t.equals(
    branch4.get(['movies', '0', 'favourite', 'compute']), true,
    'branch4 movieA favourite true'
  )
  t.equals(
    branch4.get(['movies', '1', 'favourite', 'compute']), false,
    'branch4 movieB favourite false'
  )
  t.equals(
    branch4.get(['movies', '2', 'progress', 'compute']), 0.3,
    'branch4 movieC progress 0.3'
  )

  t.end()
})
