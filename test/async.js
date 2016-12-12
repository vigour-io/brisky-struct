const test = require('tape')
const struct = require('../')
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
          results.push(stamp)
        }
      },
      error: {
        log: (err) => errors.push(err.message)
      }
    }
  })

  const scnt = stamp.cnt
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
        `click-${scnt + 1}`,
        `click-${scnt + 2}`,
        `click-${scnt + 3}`,
        `click-${scnt + 4}`,
        `click-${scnt + 5}`,
        `click-${scnt + 6}`,
        `click-${scnt + 7}`,
        `click-${scnt + 8}`,
        `click-${scnt + 9}`,
        `click-${scnt + 10}`,
        `click-${scnt + 11}`,
        `click-${scnt + 12}`,
        `click-${scnt + 13}`,
        `click-${scnt + 14}`,
        `click-${scnt + 15}`,
        `move-${scnt + 17}`
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
            `special-${scnt + 19}`,
            `special-${scnt + 20}`,
            `special-${scnt + 21}`,
            `special-${scnt + 22}`,
            `special-${scnt + 23}`,
            `special-${scnt + 24}`,
            `special-${scnt + 25}`,
            `special-${scnt + 26}`,
            `special-${scnt + 27}`,
            `special-${scnt + 28}`,
            `special-${scnt + 29}`,
            `special-${scnt + 30}`,
            `special-${scnt + 31}`,
            `special-${scnt + 32}`
          ], 'correct results')
          t.equal(a.async, void 0, 'removed async queue')
          t.end()
        })
        stamp.close(s)
      }, 25)
    })
    stamp.close(s)
  })

  stamp.close(s)
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

    process.nextTick(() => {
      t.equal(cnt, 0, 'does not fire error event')
      t.end()
    })
  })
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
    t.equal(total, 436, 'added all episodes and comments')
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
