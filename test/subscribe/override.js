const test = require('tape')
const { struct } = require('../../')
const stamp = require('stamp')

test('subscription - multiple subscriptions', t => {
  var results = []

  const s = struct.create()

  s.subscribe({
    page: {
      $any: {
        title: true,
        description: true
      }
    }
  }, t => {
    results.push(t)
  })

  const date = stamp.create()

  s.set({
    page: {
      a: {
        title: {
          val: 'x',
          stamp: date
        }
      }
    }
  }, false)
  stamp.close()

  t.same(results, [ s.page.a.title ])

  results = []
  s.set({
    page: {
      a: {
        description: {
          val: 'bla',
          stamp: date
        }
      }
    }
  }, false)
  stamp.close()

  t.same(results, [ s.page.a.description ])

  console.log(results)

  t.end()
})
