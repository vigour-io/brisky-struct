const test = require('tape')
const struct = require('../')

test('types ', t => {
  const a = struct({ //eslint-disable-line
    key: 'a',
    types: {
      something: {
        field: 'real'
      }
    }
  })

  t.end()
})
