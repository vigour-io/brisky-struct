const test = require('tape')
const struct = require('../')

test('compute ', t => {
  const a = struct({
    props: {
      default: { $transform: (val) => val + '!' }
    },
    field: 'wow',
    hello: {
      val: 'hello',
      $transform: null
    }
  })
  t.equal(a.get('field').compute(), 'wow!', 'inherits $transform')
  t.equal(a.get('hello').compute(), 'hello', 'remove transform')
  t.end()
})
