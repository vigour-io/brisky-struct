const test = require('tape')
const { create } = require('../../../')
// const bs = require('brisky-stamp')

test('subscription - context - switch', t => {
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
    // allready wrong!
    console.log(t.compute())
  })

  orig2.set({ a: { bla: 'w00t' } })

  console.log('\n go go go')
  orig2.set({
    bla: 'bla on instance!'
    // page: { current: [ '@', 'root', 'bla' ] } // this is the situation we want to recreate
  })

  t.end()
})
