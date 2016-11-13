const test = require('tape')
const struct = require('../')

test('references - listeners', t => {
  const a = struct({ $transform: val => val * 5 })
  const b = struct({ val: a, $transform: val => val * 5 })
  const results = []
  const c = struct({
    val: b,
    on: {
      data: {
        result: (t, val) => {
          results.push(val)
        }
      }
    }
  })
  const a2 = a.create() //eslint-disable-line
  a.set(1, 'stamp')
  t.same(results, [ 1 ], 'fires only for c (does not fire for a instance)')
  t.equal(c.compute(), 25, 'compute processes transforms in the reference chain')
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
  t.end()
})
