const test = require('tape')
const { struct } = require('../../../')
test('subscription - $switch', t => {
  const s = struct.create({
    page: {
      current: [ '@', 'root', 'page', 'bla' ],
      bla: {
        title: 'bla'
      }
    }
  })

  s.subscribe({
    $switchbranch: {
      search: { val: 'shallow' },
      val: (struct, subs, tree, key) => {
        console.log('\nswitch it')
        const val = struct.get([ 'search', 'compute' ]) !== true
        if (val) {
          return {
            page: {
              current: {
                title: {
                  val: 'shallow'
                }
              }
            }
          }
        } else {
          return {
            navbarBgColor: { val: 'shallow' }
          }
        }
      }
    }
  }, (t, type) => {
    console.log('fire', type, t.path())
  })

  console.log(1)
  s.set({ search: true })

  console.log(2)
  s.set({ search: false })

  t.end()
})
