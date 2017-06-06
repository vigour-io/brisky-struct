const test = require('tape')
const { create } = require('../')

test('exclude from keys', t => {
  t.plan(4)

  const master = create({
    props: {
      excludeMe: {
        nonEnumerable: true
      }
    },
    excludeMe: {
      on: {
        data (val) {
          t.deepEquals(
            val, { subKey: true },
            'event fired from nonEnumerable path'
          )
        }
      }
    },
    includeMe: {
      subKey: false
    }
  })

  t.deepEquals(
    master.keys(), ['includeMe'],
    'excludeMe should not exist in keys list'
  )

  master.create()
  master.set({ newIncludeMe: true }, void 0, true)
  master.get('excludeMe').set({ subKey: true })

  t.deepEquals(
    master.keys(), ['newIncludeMe'],
    'excludeMe still should not exist in keys list'
  )
})
