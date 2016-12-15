const test = require('tape')
const struct = require('../').create

test('define ', t => {
  var cnt = 0
  const a = struct({
    define: {
      hello () {
        return ++cnt
      }
    }
  })

  const b = a.create({
    define: {
      hello () {
        return --cnt
      }
    }
  })

  t.not(b.Constructor, a.Constructor, 'create new constructor for b')

  t.equal(a.hello(), 1, 'defined hello on a')

  t.equal(b.hello(), 0, 'defined hello on b')

  t.end()
})
