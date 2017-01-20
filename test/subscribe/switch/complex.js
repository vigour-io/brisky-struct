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
    // style: {
    //   color: 'red',
    //   blur: 'blue'
    // },
    page: {
      current: [ '@', 'parent', 'things' ],
      things: {
        // x: 'x',
        // type: 'form'
        // title: 'gurt'
        // random: {
        //   items: {
        //     a: { x: 'x' },
        //     b: { x: 'x' }
        //   }
        // }
      }
    }
  })


  console.log(s.page.current === s.page.things)
  console.log('SECOND', s.page.current.get('title').compute())
  // console.log(s.page.current.get('title'))

  // const s2 = s.create({ key: 's2' })

  // s2.subscribe({
  //   page: {
  //     current: {
  //       val: 'switch',
  //       $switch: () => ({
  //         val: 1,
  //         $any: {
  //           $switch: {
  //             x: { val: true },
  //             val: state => {
  //               // ---------------------------------
  //               return state.origin().key === 'title'
  //                 // title
  //                 ? { val: true }
  //                 // form
  //                 : {
  //                   val: 'switch',
  //                   root: {
  //                     style: { blur: { val: true } }
  //                   },
  //                   title: { val: true },
  //                   items: {
  //                     val: 1,
  //                     $any: {
  //                       val: true,
  //                       root: {
  //                         style: {
  //                           color: { val: true }
  //                         }
  //                       }
  //                     }
  //                   }
  //                 }
  //               // ---------------------------------
  //             }
  //           }
  //         }
  //       })
  //     }
  //   }
  // }, state => {
  //   console.log('🗡  update', state.path().join('/'))
  // })

  // console.log('\n---------------------------')
  // // s2.set({ page: { current: [ '@', 'root', 'page', 'things' ] } })
  // // console.log(s.page.things)
  // s2.set({ page: { current: s.page.things } })

  // console.log('\n 1--------------------------------')
  // s2.set({ page: { things: { title: 'xhello!' } } })

  // console.log('\n 2--------------------------------')
  // s2.set({ page: { things: { title: 'hello!x' } } })

  t.end()
})
