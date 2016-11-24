const test = require('tape')
const struct = require('../')

test('compute ', t => {
  const a = struct({
    props: {
      default: { $transform: val => val + '!' }
    },
    field: 'wow',
    hello: {
      val: 'hello',
      $transform: null
    },
    bye: {
      val: 'bye',
      $transform: val => val + '?'
    },
    generate () {
      return 100
    }
  })
  t.equal(a.get('field').compute(), 'wow!', 'inherits $transform')
  t.equal(a.get('hello').compute(), 'hello', 'remove $transform')
  t.equal(a.get('bye').compute(), 'bye?', 'override $transform')
  t.equal(a.get('generate').compute(), '100!', 'execute function')
  const x = struct(100)
  t.equal(a.get('bye').compute(x), '100?', 'chain to compute')
  t.end()
})
