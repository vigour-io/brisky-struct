const test = require('tape')
const { create, set, struct, once } = require('../')
const stamp = require('brisky-stamp')

test('async', t => {
  const defer = (val, time = 5, err) =>
    new Promise((resolve, reject) =>
      setTimeout(() => err ? reject(err) : resolve(val), time)
    )

  const results = []

  const a = create(struct, {
    on: {
      data: {
        log: (t, val, stamp) => {
          results.push(val)
          console.log(stamp, val)
        }
      },
      error: {
        log: (t, err, stamp) => console.log('ERROR', err.message, stamp)
      }
    }
  })

  const s = stamp.create('click')

  const later = async val => {
    val = val + await defer(val, 100)
    return val
  }

  set(a, later('later-1'), s)

  set(a, defer('defer-1'), s)

  set(a, defer('defer-2'), s)

  set(a, function* (t, stamp) {
    for (var i = 0; i < 3; i++) {
      yield later('await-gen-' + i)
    }
  }, s)

  set(a, defer('defer-error', 0, new Error('haha')), s)

  set(a, function* logGenerator () {
    for (var i = 0; i < 3; i++) {
      yield defer('gen-' + i, 100)
    }
  }, s)

  set(a, defer('defer-3', 500), s)

  set(a, defer('defer-4'), s)

  set(a, defer('defer-5'), s)

  set(a, once(a, 'gen-1').then(() => defer('defer-6', 5e2)), s)

  set({
    xxx: true,
    y: true,
    x: true
  })

  once(a, 'defer-5', () => { console.log('callback') })

  once(a, 'defer-6').then(() => t.end())

  // context tests

  stamp.close(s)
})
