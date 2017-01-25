const test = require('tape')
const { create: struct } = require('../')
const stamp = require('brisky-stamp')

const timeout = (val, time = 5, err) =>
  new Promise((resolve, reject) =>
    setTimeout(() => err ? reject(err) : resolve(val), time)
  )

test('async', t => {
  var results = []
  var errors = []

  const a = struct({
    on: {
      data: {
        log: (val, stamp, t) => {
          results.push(val)
        }
      },
      error: {
        log: (err) => errors.push(err.message)
      }
    }
  })

  const s = stamp.create('click')

  // before coveralls support async/await need a solution for this
  // const later = async val => {
  //   val = await timeout(val, 10) + '!'
  //   return val
  // }

  a.set(timeout('later-1'), s)

  a.set(timeout('timeout-1'), s)

  a.set(timeout('timeout-2'), s)

  a.set(function* (t, stamp) {
    for (var i = 0; i < 3; i++) {
      yield timeout('await-gen-' + i)
    }
  }, s)

  a.set(timeout('timeout-error', 0, new Error('haha')), s)

  a.set(function* logGenerator () {
    for (var i = 0; i < 3; i++) {
      yield timeout('gen-' + i, 10)
    }
  }, s)

  a.set(timeout({ val: 'timeout-3', bla: { bla: timeout() } }, 25), s)

  a.set(timeout('timeout-4'), s)

  a.set(timeout('timeout-5'), s)

  a.set(a.once('gen-1').then(() => timeout('timeout-6', 25)), s)

  a.set({ val: timeout('timeout-7'), hello: true }, s)
  a.once('timeout-7').then(() => {
    t.pass('timeout-7 is set')
    const s = stamp.create('move')
    a.set(function* logGenerator () {
      for (var i = 0; i < 3; i++) {
        yield timeout('gen-2-' + i, 100)
      }
    }, s)
    a.set(timeout('timeout-8', 1e3), s)
    a.set(timeout('timeout-9', 1e3), s)
    a.set(timeout('timeout-10', 1e3), s)
    a.set(timeout('timeout-11', 1e3), s)
    a.set({ async: null, val: timeout('timeout-12') }, s)
    a.once('timeout-12', () => {
      t.same(errors, [ 'haha' ], 'fired correct errors')
      t.same(results, [
        { hello: true, val: {} },
        'later-1',
        'timeout-1',
        'timeout-2',
        'await-gen-0',
        'await-gen-1',
        'await-gen-2',
        'gen-0',
        'gen-1',
        'gen-2',
        { bla: { bla: {} }, val: 'timeout-3' },
        'timeout-4',
        'timeout-5',
        'timeout-6',
        'timeout-7',
        'timeout-12'
      ], 'fired correct results')

      a.set(timeout('no stamp!'), false)
      setTimeout(() => {
        t.equal(a.compute(), 'no stamp!', 'async input without stamp')
        const s = stamp.create('special')
        results = []
        errors = []

        a.set(function* () {
          var i = 10
          while (i--) {
            if (i === 5) {
              throw new Error('lullllz')
            }
            yield 'gen-' + i
          }
        }, s)

        a.set(function* () {
          var i = 3
          while (i--) {
            if (i === 2) {
              yield timeout('ha!')
            }
            yield 'gen-' + i
          }
        }, s)

        const arr = [
          timeout('iterator-1'),
          'iterator-2',
          timeout('iterator-3')
        ]

        a.set({ val: arr[Symbol.iterator]() }, s)

        const arr2 = [
          timeout('iterator-1-1'),
          'iterator-2-2',
          timeout('iterator-3-3')
        ]

        a.set(arr2[Symbol.iterator](), s)

        a.once('iterator-3-3').then(() => {
          t.same(errors, [ 'lullllz' ], 'catches iterator errors')
          t.same(results, [
            'gen-9',
            'gen-8',
            'gen-7',
            'gen-6',
            'ha!',
            'gen-2',
            'gen-1',
            'gen-0',
            'iterator-1',
            'iterator-2',
            'iterator-3',
            'iterator-1-1',
            'iterator-2-2',
            'iterator-3-3'
          ], 'correct results')
          t.equal(a.async, void 0, 'removed async queue')
          t.end()
        })
        stamp.close()
      }, 25)
    })
    stamp.close()
  })

  stamp.close()
})

test('async - promise all', t => {
  const a = struct()

  a.set(Promise.all([
    timeout({ val: 'later-1', 1: true }, 0),
    timeout({ val: 'later-2', 2: true }, 10),
    timeout({ val: 'later-3', 3: true }, 5)
  ]))

  a.set(a.once('later-3').then(() => {
    t.same(a.keys(), [ '1', '2', '3' ], 'correct keys')
    t.same(a.val, 'later-3', 'correct val')
    return 'lulllz'
  }))

  a.once('lulllz', () => {
    var cnt = 0
    a.on('error', () => ++cnt)

    a.set(new Promise((resolve, reject) => {
      reject()
    }))

    setTimeout(() => {
      t.equal(cnt, 0, 'does not fire error event')
      t.end()
    }, 25)
  })
})

test('async - async generator error handeling', t => {
  const a = struct()

  const gen = function * () {
    var i = 6
    while (i--) {
      yield new Promise((resolve, reject) => {
        if (i === 4) {
          reject(i)
        } else {
          resolve(i)
        }
      })
    }
  }

  const iterator = gen()
  const results = []
  const errors = []

  a.on('error', err => errors.push(err))
  a.on(val => results.push(val))

  a.once(0).then(() => {
    t.same(results, [ 5, 3, 2, 1, 0 ])
    t.same(errors, [ 4 ])
    t.end()
  })

  a.set(iterator)
})

test('async - advanced', t => {
  var cnt = 0
  const a = struct()

  const done = () => {
    var total = 0
    const walk = (p) => {
      p.forEach(p => {
        total++
        walk(p)
      })
    }
    walk(a)
    t.equal(total, 433, 'added all episodes and comments')
    t.end()
  }

  const episodes = function * () {
    cnt++
    var episode = 5
    while (episode--) {
      yield new Promise(resolve => {
        setTimeout(() => {
          resolve({
            episodes: {
              [episode]: {
                title: 'ha!' + episode,
                comments: Promise.resolve(resolve => {
                  setTimeout(() => resolve([ 1, 2, 3 ]), 1)
                })
              }
            }
          })
        }, 10)
      })
    }
    if (--cnt === 0) { done() }
  }

  const seasons = function * () {
    var season = 5
    while (season--) { yield { seasons: { [season]: episodes } } }
  }

  const scrape = function * () {
    var page = 5
    while (page--) { yield { shows: { [page]: seasons } } }
  }

  a.set(scrape)
})
