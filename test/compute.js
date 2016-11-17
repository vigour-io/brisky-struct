const test = require('tape')
const struct = require('../')

test('compute ', t => {
  const a = struct({
    props: {
      default: { $transform: (val) => val + '!' }
    },
    field: 'wow'
  })
  t.equal(a.get('field').compute(), 'wow!', 'inherits $transform')
  t.end()
})
