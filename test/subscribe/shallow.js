const test = require('tape')
const subsTest = require('./util')

test('subscription - basic - nested removal', t => {
  const s = subsTest(
    t,
    {
      focus: false,
      style: {
        activeBackground: '#000a21',
        focusBorder: '#00c4dd'
      },
      order: 1,
      val: [
        '@',
        'root',
        'page',
        '2WmoP3ABQkucqSQ0IIySSE'
      ]
    },
    {
      focus: {
        val: 'shallow'
      },
      style: {
        focusBorder: {
          val: 'shallow'
        }
      }
    }
  )

  s(
    'initial subscription',
    [
      { path: 'focus', type: 'new' },
      { path: 'style/focusBorder', type: 'new' }
    ]
  )

  s(
    'update focus',
    [
      { path: 'focus', type: 'update' }
    ],
    {
      focus: true
    }
  )

  s(
    'update style',
    [
      { path: 'style/focusBorder', type: 'update' }
    ],
    {
      style: { focusBorder: 'bla' }
    }
  )

  t.end()
})
