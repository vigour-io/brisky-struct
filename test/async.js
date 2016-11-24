const test = require('tape')
const struct = require('../')
const stamp = require('brisky-stamp')

test('async', t => {
  const defer = (val, time = 5, err) =>
    new Promise((resolve, reject) =>
      setTimeout(() => err ? reject(err) : resolve(val), time)
    )

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

  const scnt = global.briskystamp.cnt
  const s = stamp.create('click')

  // before coveralls support async/await need a solution for this
  // const later = async val => {
  //   val = await defer(val, 10) + '!'
  //   return val
  // }

  a.set(defer('later-1'), s)

  a.set(defer('defer-1'), s)

  a.set(defer('defer-2'), s)

  a.set(function* (t, stamp) {
    for (var i = 0; i < 3; i++) {
      yield defer('await-gen-' + i)
    }
  }, s)

  a.set(defer('defer-error', 0, new Error('haha')), s)

  a.set(function* logGenerator () {
    for (var i = 0; i < 3; i++) {
      yield defer('gen-' + i, 10)
    }
  }, s)

  a.set(defer({ val: 'defer-3', bla: { bla: defer() } }, 25), s)

  a.set(defer('defer-4'), s)

  a.set(defer('defer-5'), s)

  a.set(a.once('gen-1').then(() => defer('defer-6', 25)), s)

  a.set({ val: defer('defer-7'), hello: true }, s)

  a.once('defer-7').then(() => {
    t.pass('defer-7 is set')
    const s = stamp.create('move')
    a.set(function* logGenerator () {
      for (var i = 0; i < 3; i++) {
        yield defer('gen-2-' + i, 100)
      }
    }, s)
    a.set(defer('defer-8', 1e3), s)
    a.set(defer('defer-9', 1e3), s)
    a.set(defer('defer-10', 1e3), s)
    a.set(defer('defer-11', 1e3), s)
    a.set({ async: null, val: defer('defer-12') }, s)
    a.once('defer-12', () => {
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

      a.set(defer('no stamp!'), false)
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
              yield defer('ha!')
            }
            yield 'gen-' + i
          }
        }, s)

        const arr = [
          defer('iterator-1'),
          'iterator-2',
          defer('iterator-3')
        ]

        a.set({ val: arr[Symbol.iterator]() }, s)

        const arr2 = [
          defer('iterator-1-1'),
          'iterator-2-2',
          defer('iterator-3-3')
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
