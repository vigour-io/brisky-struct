const test = require('tape')
const { create: struct } = require('../')

test('serialize ', t => {
  const a = struct({
    a: {
      b: {
        c: 'hello'
      },
      x: { val: 'what', y: true }
    },
    hello: 'what?',
    greetings: {
      val: [ '@', 'parent', 'hello' ],
      bye: 'bye!'
    }
  })
  t.same(a.serialize(), {
    a: {
      b: { c: 'hello' },
      x: { y: true, val: 'what' }
    },
    hello: 'what?',
    greetings: { bye: 'bye!', val: [ '@', 'hello' ] }
  }, 'correct result')

  t.same(a.serialize((t, result) => t.key !== 'a' ? result : void 0), {
    hello: 'what?',
    greetings: { bye: 'bye!', val: [ '@', 'hello' ] }
  }, 'correct result')
  t.end()
})
