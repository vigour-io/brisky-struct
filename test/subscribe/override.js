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
  var cnt = 0
  s.set({
    page: {
      on: () => {
        cnt++
      },
      a: {
        title: {
          val: 'x',
          stamp: date
        }
      }
    }
  }, stamp.create())
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
  }, stamp.create())
  stamp.close()

  t.equal(cnt, 1)
  t.same(results, [ s.page.a.description ])

  t.end()
})
