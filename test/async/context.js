const test = require('tape')
const { create } = require('../../')
// const stamp = require('brisky-stamp')

const timeout = (val, time = 5, err) =>
  new Promise((resolve, reject) =>
    setTimeout(() => err ? reject(err) : resolve(val), time)
  )

test('async - context', t => {
  const a = create({
    b: {
      c: 'hello'
    }
  })
  const a1 = a.create()
  a.b.c.set(timeout('bye'))
  a1.get([ 'b', 'c' ])
  setTimeout(() => {
    t.equal(a.b.c.val, 'bye')
    t.end()
  }, 100)
})
