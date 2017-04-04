const test = require('tape')
const { struct } = require('../../')
const stamp = require('stamp')

test('subscription - multiple subscriptions', t => {
  var results = []

  const s = struct.create()

  s.subscribe({
    page: {
      $any: {
        bla: {
          title: true,
          description: true
        }
      }
    }
  }, t => {
    console.log('yo yo yo yo', t.path())
    results.push(t)
  })

  const date = stamp.create()

  s.set({
    page: {
      a: {
        bla: {
          title: {
            val: 'x',
            stamp: date
          }
        }
      }
    }
  }, false)
  stamp.close()

  console.log('\n\n\nyo gimme some change right hur!!!')

  results = []
  s.set({
    page: {
      a: {
        bla: {
          description: {
            val: 'bla',
            stamp: date
          }
        }
      }
    }
  }, false)
  stamp.close()

  console.log(results)

  t.end()
})
