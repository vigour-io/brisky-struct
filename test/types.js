import test from 'tape'
import { create as struct } from '../'

test('types ', t => {
  const a = struct({
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
  const c = struct({
    types: {
      a: true
    },
    a: {
      b: {
        c: true
      }
    }
  })
  const c2 = c.create({ a: { type: 'a' } })
  t.same(c2.get('a').keys(), void 0, 'override inheritance')
  t.end()
})
