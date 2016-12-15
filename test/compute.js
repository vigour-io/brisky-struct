import test from 'tape'
import { create as struct } from '../lib/'

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
    yes: {
      $transform: (val, passon) => {
        return passon.key
      }
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
  x.set(void 0)
  t.equal(a.compute(x), x, 'undefined when passed a value will return the struct')
  t.equal(a.yes.compute(100, a.hello), 'hello', 'passon as second argument')
  t.end()
})
