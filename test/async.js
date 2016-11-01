const test = require('tape')
const { create, set, struct, once } = require('../')
const stamp = require('brisky-stamp')

test('async', t => {
  const defer = (val, time = 5, err) =>
    new Promise((resolve, reject) =>
      setTimeout(() => err ? reject(err) : resolve(val), time)
    )

  const results = []
  const errors = []

  const a = create(struct, {
    on: {
      data: {
        log: (t, val, stamp) => results.push(stamp)
      },
      error: {
        log: (t, err, stamp) => errors.push(err.message)
      }
    }
  })

  const s = stamp.create('click')

  const later = async val => {
    val = await defer(val, 10) + '!'
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
      yield defer('gen-' + i, 10)
    }
  }, s)

  set(a, defer('defer-3', 25), s)

  set(a, defer('defer-4'), s)

  set(a, defer('defer-5'), s)

  set(a, once(a, 'gen-1').then(() => defer('defer-6', 25)), s)

  set(a, { val: defer('defer-7'), hello: true }, s)

  set({
    xxx: true,
    y: true,
    x: true
  })

  once(a, 'defer-7').then(() => {
    t.pass('defer-7 is set')
    const s = stamp.create('move')
    set(a, function* logGenerator () {
      for (var i = 0; i < 3; i++) {
        yield defer('gen-2-' + i, 100)
      }
    }, s)
    set(a, defer('defer-8', 1e3), s)
    set(a, defer('defer-9', 1e3), s)
    set(a, defer('defer-10', 1e3), s)
    set(a, defer('defer-11', 1e3), s)
    set(a, { async: null, val: defer('defer-12') }, s)
    once(a, 'defer-12', () => {
      t.same(errors, [ 'haha' ], 'fired correct errors')
      t.same(results, [
        'click-1',
        'click-2',
        'click-3',
        'click-4',
        'click-5',
        'click-6',
        'click-7',
        'click-8',
        'click-9',
        'click-10',
        'click-11',
        'click-12',
        'click-13',
        'click-14',
        'click-15',
        'move-17'
      ], 'fired correct results')
      t.end()
    })
    stamp.close(s)
  })

  // context tests

  stamp.close(s)
})
