const test = require('tape')
const { create, set, struct, compute } = require('../')
const stamp = require('brisky-stamp')

test('async', t => {
  const defer = (val, time = 100) => new Promise(resolve => setTimeout(() => resolve(val), time))

  const a = create(struct, {
    on: {
      data: {
        log: (t, val, stamp) => console.log('yo!', stamp, compute(t))
      }
    }
  })

  const s = stamp.create('click')

  const later = async sayWhat => {
    await defer(1, 500)
    return sayWhat
  }

  set(a, later('later-1'), s)
  set(a, defer('defer-1'), s)
  set(a, defer('defer-2'), s)

  set(a, function* (t, stamp) {
    for (var i = 0; i < 3; i++) {
      yield later('await-gen-' + i, 1e3)
    }
  }, s)

  set(a, function* logGenerator () {
    for (var i = 0; i < 3; i++) {
      yield defer('gen-' + i, 1e3)
    }
  }, s)

  set(a, defer('defer-3', 500), s)
  set(a, defer('defer-4'), s)

  set({
    xxx: true,
    y: true,
    x: true
  })

  stamp.close(s)
})
