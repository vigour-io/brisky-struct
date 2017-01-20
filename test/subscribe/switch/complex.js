const test = require('tape')
const { create } = require('../../../')
/*
state.upstreamSubscriptions[Object.keys(state.upstreamSubscriptions)[0]].page.current.props.$switch1237098935
// .column.$any.props.$switch2338797674.form.items.$any
*/

test('subscription - $switch - complex', t => {
  const s = create({
    types: {
      form: {
        title: 'hello'
      }
    },
    style: {
      color: 'red',
      blur: 'blue'
    },
    page: {
      current: [ '@', 'parent', 'things' ],
      things: {
        type: 'form',
        random: {
          items: {
            a: { x: 'x' },
            b: { x: 'x' }
          }
        }
      }
    }
  })

  // console.log(s.page.current === s.page.things)
  // console.log('✨ SECOND ✨', s.page.current.get('title').compute())
  // console.log(s.page.current.get('title'))

  const s2 = s.create({ key: 's2' })
  const result = []

  s2.subscribe({
    page: {
      current: {
        val: 'switch',
        $switch: () => ({
          // val: 1,
          $any: {
            $switch: {
              // type: { val: true }, -- breaks completely
              val: state => {
                // ---------------------------------
                return state.origin().key === 'title'
                  // title
                  ? { val: true }
                  // form
                  : {
                    val: 'switch',
                    root: {
                      style: { blur: { val: true } }
                    },
                    title: { val: true },
                    items: {
                      val: 1,
                      $any: {
                        val: true,
                        root: {
                          style: {
                            color: { val: true }
                          }
                        }
                      }
                    }
                  }
                // ---------------------------------
              }
            }
          }
        })
      }
    }
  }, state => {
    result.push(state.path())
  })

  s2.set({ page: { current: [ '@', 'root', 'page', 'things' ] } }) // messes things up...
  t.ok(s2.page.current.val === s.page.things, 's2 refs original')

  s2.set({ page: { things: { title: 'xhello!' } } })

  t.ok(s2.page.current.val === s2.page.things, 's2 refs resolved after set on page')

  s2.set({ page: { things: { title: 'shurrrrf' } } })

  // totaly incorrect context...

  t.same(result, [
    [ 's2', 'page', 'current' ],
    [ 's2', 'page', 'things', 'title' ],
    [ 's2', 'page', 'current' ],
    [ 's2', 'page', 'things', 'title' ],
    [ 's2', 'page', 'things', 'title' ]
  ], 'correct updates')

  t.end()
})
