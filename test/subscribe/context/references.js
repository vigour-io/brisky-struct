const test = require('tape')
const { create } = require('../../../')
// const bs = require('stamp')

test('subscription - context - references', t => {
  var results = []
  const orig = create({
    types: {
      ha: { bla: 'hello' }
    },
    a: { type: 'ha' },
    bla: 'bla on original',
    page: { current: [ '@', 'root', 'bla' ] }
  })

  const orig2 = orig.create({ '🦄': true })

  orig2.subscribe({
    a: { bla: true },
    page: { current: true }
  }, t => {
    results.push(t.compute())
  })

  orig2.set({ a: { bla: 'w00t' } })

  orig2.set({ bla: 'bla on instance!' })

  t.ok(!!orig2.page.current)
  t.same(results, [ 'hello', 'bla on original', 'w00t', 'bla on instance!' ])

  results = []
  orig2.set({ bla: 'blurf!' })
  t.same(results, [ 'blurf!' ])

  // deeper refs
  // switches

  t.end()
})
