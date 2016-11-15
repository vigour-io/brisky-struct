const test = require('tape')
const struct = require('../')

test('types ', t => {
  const a = struct({ //eslint-disable-line
    key: 'a',
    types: {
      something: {
        field: 'real'
      },
      bla: { somehting: 'wrong' }
    },
    field: { type: 'something' }
  })
  const b = a.create({
    types: {
      something: {
        type: 'something',
        bla: true
      },
      bla: 'override!'
    },
    x: {
      type: 'something'
    },
    y: { type: 'bla' }
  })
  t.same(b.get('x').keys(), [ 'field', 'bla' ], 'merged "something" type')
  t.equal(b.get('y').keys(), void 0, 'override "bla" type')
  t.equal(b.get('y').compute(), 'override!', 'type with string')
  t.same(a.get('field').keys(), [ 'field' ], '"field" on a has "field"')
  t.end()
})
