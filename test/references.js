const test = require('tape')
const struct = require('../')

test('references - listeners', t => {
  const a = struct({ $transform: val => val * 5 })
  const b = struct({ val: a, $transform: val => val * 5 })
  var results = []
  const c = struct({
    key: 'c',
    val: b,
    on: {
      data: {
        result: (t, val) => {
          results.push(t.path())
        }
      }
    }
  })
  const a2 = a.create() //eslint-disable-line
  const c2 = c.create({ key: 'c2' })
  a.set(1, 'stamp-1')

  t.same(
    results, [ [ 'c' ], [ 'c2' ] ],
    'fires for "c" and "c2" (does not fire for "a" instance)'
  )

  t.equal(c.compute(), 25, 'compute processes transforms in the reference chain')

  const d = struct({
    key: 'd',
    val: c2,
    on: {
      data: {
        result: (t, val) => {
          results.push(t.path())
        }
      }
    }
  })

  t.equal(d.origin(), c2, 'correct origin for "d"')

  const d2 = d.create({ //eslint-disable-line
    key: 'd2',
    val: 'clear!'
  })

  const e = struct({
    x: {
      y: {
        props: {
          default: d
        },
        z: {}
      }
    }
  })

  const e2 = e.create({ key: 'e2' }) //eslint-disable-line

  results = []
  a.set(2, 'stamp-2')
  t.same(results, [
      [ 'c' ],
      [ 'c2' ],
      [ 'd' ],
      [ 'e2', 'x', 'y', 'z' ],
      [ 'x', 'y', 'z' ]
  ], 'fires only for c (does not fire for a instance)')

  results = []
  a.emit('data', 10)

  t.same(results, [
      [ 'c' ],
      [ 'c2' ],
      [ 'd' ],
      [ 'e2', 'x', 'y', 'z' ],
      [ 'x', 'y', 'z' ]
  ], 'fires from a data emit')
  t.end()
})

test('references - serialized', t => {
  const a = struct({
    hello: true,
    bye: [ '@', 'root', 'hello' ],
    greeting: {
      val: [ '@', 'dutch' ],
      dutch: 'goede morgen'
    },
    vocabulary: [ '@', 'parent', 'greeting' ]
  })
  t.equal(a.bye.val, a.hello, 'create reference to root')
  t.equal(a.greeting.val, a.greeting.dutch, 'create reference to self')
  t.equal(a.vocabulary.val, a.greeting, 'create reference to parent')
  const b = struct({
    bla: {
      on: {
        data: {
          x () {
            t.pass('fires listener when making a new reference')
            t.end()
          }
        }
      }
    }
  })
  b.set({ x: [ '@', 'parent', 'bla', 'newthing' ] }, 'stamp')
})
