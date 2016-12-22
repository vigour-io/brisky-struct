const test = require('tape')
const subsTest = require('../util')

test('subsciption - composite - root - any', function (t) {
  const subscription = {
    a: {
      $any: {
        root: {
          b: { val: true }
        }
      }
    }
  }
  const a = [ 1, 2, 3, 4 ]
  const s = subsTest(t, { a: a, b: 'hello b!' }, subscription)
  s('initial subscription', multiple('new'))
  s('set b', multiple('update'), { b: 'hello b2!' })
  t.end()
  function multiple (type) {
    const val = []
    for (let i = 0, len = a.length; i < len; i++) {
      val.push({ type: type, path: 'b' })
    }
    return val
  }
})
