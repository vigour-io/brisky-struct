const test = require('tape')
const { struct } = require('../../')
const stamp = require('stamp')

test('subscription - multiple subscriptions', t => {
  const results = []

  const s = struct.create()

  s.subscribe({
    page: {
      $any: {
        title: true,
        description: true
      }
    }
  }, (t) => {
    console.log(t.path())
  })

  const date = stamp.create()

  console.log('yo gimme some change right hur!!!')

  s.set({
    page: {
      a: {
        title: {
          stamp: date
        }
      }
    }
  })

  t.end()
})
