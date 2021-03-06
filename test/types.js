const test = require('tape')
const { create: struct, uid } = require('../')
const bs = require('stamp')

test('types ', t => {
  const a = struct({
    key: 'a',
    types: {
      something: {
        field: 'real'
      },
      bla: { somehting: 'wrong' }
    },
    field: { type: 'something' }
  })

  const b = a.create({
    types: {
      something: {
        type: 'something',
        bla: true
      },
      bla: { somehting: null, val: 'override!' }
    },
    x: { type: 'something' },
    y: { type: 'bla' }
  })

  t.same(b.get('x').keys(), [ 'field', 'bla' ], 'merged something type')
  t.same(b.get('y').keys(), [], 'override bla type')
  t.equal(b.get('y').compute(), 'override!', 'type with string')
  t.same(a.get('field').keys(), [ 'field' ], 'field on a has field')
  // const c = struct({
  //   types: { a: true },
  //   a: {
  //     b: {
  //       c: true
  //     }
  //   }
  // })
  // const c2 = c.create({ a: { type: 'a' } })
  // t.same(c2.get('a').keys(), [], 'override inheritance')
  t.end()
})

test('types - simple ', t => {
  const a = struct({
    key: 'a',
    types: {
      a: 'self'
    },
    define: {
      haha: true
    },
    bla: { type: 'a' }
  })
  t.equal(a.bla.inherits, a, 'use self in types')
  t.end()
})

test('types - switch - keys', t => {
  const a = struct({
    key: 'a',
    types: {
      gurky: {
        hello: true
      },
      b: {
        XXXXXXXX: true,
        YYYYYYYY: true
      },
      a: {
        props: {
          default: { b: {} }
        },
        a: true
      }
    },
    bla: {
      type: 'a',
      hello: {},
      gurky: { type: 'gurky' },
      val: 'smurt'
    }
  })

  const a1 = a.bla.create()
  const a2 = a.bla.create({ MYOWN: true })
  const a3 = a.bla.create({ hello: null })
  const a32 = a3.create({ HA: true })
  const fieldInstance = a.bla.hello.create()

  a.bla.set({ type: 'b' })

  t.same(a.bla.keys(), [ 'XXXXXXXX', 'YYYYYYYY', 'hello', 'gurky' ], 'correct keys on a.bla')
  t.same(a1.keys(), [ 'XXXXXXXX', 'YYYYYYYY', 'hello', 'gurky' ], 'correct keys on a1')
  t.same(a2.keys(), [ 'XXXXXXXX', 'YYYYYYYY', 'hello', 'gurky', 'MYOWN' ], 'correct keys on a2')
  t.same(a3.keys(), [ 'XXXXXXXX', 'YYYYYYYY', 'gurky' ], 'correct keys on a3')
  t.same(a32.keys(), [ 'XXXXXXXX', 'YYYYYYYY', 'gurky', 'HA' ], 'correct keys on a3-2')
  t.same(fieldInstance.keys(), [], 'correct keys on fieldInstance')

  // reset does not work anymore ofcourse...
  // a.bla.set({ type: 'a',  })
  // t.same(a.bla.keys(), [], 'correct keys on a.bla') // need to update instances
  // t.same(a1.keys(), [], 'correct keys on a1')
  // t.same(a2.keys(), [ 'a', 'MYOWN' ], 'correct keys on a2')
  // t.same(a3.keys(), [ 'a' ], 'correct keys on a3')
  // t.same(a32.keys(), [ 'a', 'HA' ], 'correct keys on a3-2')

  t.end()
})

test('types - switch - subscriptions', t => {
  var cnt = 0
  const a = struct({
    key: 'a',
    types: {
      gurky: {
        hello: true
      },
      b: {
        XXXXXXXX: true,
        YYYYYYYY: true
      },
      a: {
        props: {
          default: { b: {} }
        },
        a: true
      }
    },
    bla: {
      type: 'a',
      hello: {},
      gurky: { type: 'gurky' },
      val: 'smurt'
    }
  })
  a.subscribe({ bla: { hello: true } }, () => { cnt++ })
  cnt = 0
  a.bla.set({ type: 'b' })
  t.equal(cnt, 1, 'fires subscription on type change')
  t.end()
})

test('types - switch - creation / context', t => {
  const x = struct({ hello: true })
  const b = struct({
    types: { what: { a: true } },
    props: { x: x },
    x: { type: 'what' }
  })
  t.same(b.x.keys(), [ 'a' ], 'correct keys on b.x removes inherited')
  const b2 = struct({
    types: { what: { a: true } },
    props: { x: x },
    x: { bla: true }
  })
  const b3 = b2.create({ x: { type: 'what' } })
  t.same(b3.x.keys(), [ 'a', 'bla' ], 'correct keys on b.x removes inherited')
  t.end()
})

test('types - switch - existing', t => {
  const b = struct({
    types: { what: { a: true }, dirt: {} },
    x: { type: 'what' }
  })
  b.set({ x: { type: 'dirt' } })
  t.same(b.x.keys(), [], 'correct keys')
  b.set({ type: 'b' })
  b.set({ type: 'gurk' })
  t.end()
})

test('types - switch - existing - override', t => {
  const b = struct({
    types: { what: { a: true }, dirt: {} },
    x: { type: 'what' }
  })
  b.set({ x: { type: { val: 'dirt', stamp: bs.create(false, false, 1) } } }, false)
  t.same(b.x.keys(), [], 'correct keys')
  t.end()
})

test('types - context', t => {
  const b = struct({
    types: { what: { a: true }, dirt: {} },
    x: { type: 'what' }
  })

  const b1 = b.create({
    types: { what: { b: true } },
    z: { type: 'what' }
  })

  t.same(b1.z.keys(), [ 'a', 'b' ])

  t.end()
})

test('types - subscription', t => {
  const results = []
  const a = struct({ types: { what: { a: true } } })
  a.subscribe({ types: { $any: true } }, t => {
    results.push(t.path())
  })
  a.types.set({ rick: { fun: true } })
  t.same(results, [ [ 'types', 'what' ], [ 'types', 'rick' ] ])
  t.end()
})

test('types - non existing', t => {
  const a = struct({ bla: { type: 'james' } })
  t.same(a.types.keys(), [ 'james' ])
  t.end()
})

test('types - merge and listeners', t => {
  var cnt = 0
  const a = struct({
    types: {
      derp: {
        on: { data: { bla: () => cnt++, blurf: () => cnt++ } }
      },
      x: { hello: true }
    },
    bla: { type: 'derp', on: { data: { gur: () => cnt++, blurf: null } } }
  })
  cnt = 0
  a.set({ bla: { type: 'x' } })
  t.equal(cnt, 1, 'listeners fire when merging type')
  cnt = 0
  a.bla.set('hello')
  t.equal(cnt, 1, 'listeners fire when merging type')
  t.end()
})

test('types - listeners on types', t => {
  var cnt = 0
  const a = struct({ types: {} })
  a.types.on(() => { cnt++ })
  a.set({ types: { hello: true } })
  t.equal(cnt, 1, 'fires correct amount of listeners')
  t.end()
})

test('types - listeners on types override', t => {
  var cnt = 0
  const a = struct({ types: {} })
  a.types.on(() => { cnt++ })
  a.set({ types: { hello: true, stamp: bs.create(false, false, 1) } }, false)
  t.equal(cnt, 1, 'fires correct amount of listeners')
  t.end()
})

test('types - prop type null', t => {
  const a = struct({
    type: {
      hello: '???'
    },
    props: {
      default: { hello: true },
      type: null
    },
    x: {}
  })
  a.set({ type: 'jurps' })
  t.same(a.x.keys(), [ 'hello' ])
  t.same(a.type.keys(), [ 'hello' ])
  const b = struct({
    types: {
      hello: { x: true }
    },
    props: {
      a: a
    },
    a: {
      type: 'hello'
    }
  })
  t.same(b.a.type.keys(), [ 'hello' ])
  t.end()
})

test('types - references', t => {
  const s = struct({
    types: {
      form: {
        title: 'hello'
      }
    },
    page: {
      current: [ '@', 'parent', 'things' ],
      things: { type: 'form' }
    }
  })
  t.equal(uid(s.page.things), uid(s.page.current.origin()))
  t.end()
})

test('types - nested references', t => {
  const s = struct({
    types: {
      form: {
        title: 'hello'
      }
    },
    page: {
      current: [ '@', 'parent', 'things', 'ballz' ],
      things: { type: 'form' }
    }
  })
  t.equal(uid(s.page.things.ballz), uid(s.page.current.origin()))
  t.end()
})

test('types - nested instances', t => {
  const s = struct({
    types: {
      form: {
        title: 'hello'
      },
      blurf: {
        title: 'blurf',
        x: { title: 'blurf' }
      }
    },
    page: {
      things: { type: 'form', x: {} }
    }
  })
  const i = s.page.things.x.create()
  s.set({ page: { things: { type: 'blurf' } } })
  t.equal(i.get([ 'title' ]).compute(), 'blurf')
  t.end()
})

// add once issue here
test('types - once', t => {
  const s = struct()
  s.get([ 'blurf' ], {}).once('james').then(() => {
    t.pass('page things has hello value')
    t.end()
  })
  s.set({
    types: {
      james: {
        stamp: [
          949406183464,
          'scraper'
        ],
        val: 'james',
        a: {
          b: {
            c: {
              stamp: [
                949406183464,
                'scraper'
              ],
              val: 'c!'
            }
          }
        }
      }
    },
    blurf: {
      stamp: [
        949406183464,
        'scraper'
      ],
      // val: 'james', // this is wrong...
      type: {
        stamp: [
          949406183464,
          'scraper'
        ],
        val: 'james'
      }
    }
  })
})

// step one -- def an issue
// step 2 clean up the hub

test('types - nested references', t => {
  const s = struct({
    type: 'hub',
    define: {
      id: 100
    },
    props: {
      default: 'self'
    },
    types: {
      hub: 'self'
    }
  })

  const s2 = s.create({
    types: {
      list: {},
      item: {},
      title: { style: 'red' }
    },
    menu: {
      link: [ '@', 'parent', 'things', 'list' ]
    },
    page: {
      current: [ '@', 'parent', 'things', 'list' ],
      things: {
        list: {
          type: 'list',
          _noInspect_: true,
          items: []
        }
      }
    }
  })

  t.same(s2.page.current.val.keys(), [ 'items' ], 'correct keys')
  t.equal(s2.page.things.list, s2.page.current.val, 'reference is updated')
  t.end()
})

test('types - set the same - same don\'t change stamps', t => {
  var cnt = 0
  const a = struct({
    a: {
      b: { title: { val: 'hello', type: 'title' } }
    }
  })

  a.subscribe({
    a: { b: { title: true } }
  }, () => {
    cnt++
  })

  a.set({
    a: {
      b: { title: { val: 'hello', type: 'title' } }
    }
  })

  t.equal(cnt, 1)
  t.end()
})

test('types - nested sets', t => {
  const s = struct({
    types: {
      title: {
        a: true,
        b: {
          c: [ 1, 2, 3, 4 ],
          d: true
        }
      },
      grid: {
        title: {
          type: 'title'
        }
      }
    },
    bla: {
      props: {
        grid: {
          type: 'grid',
          title: { b: { c: 'bla!' } }
        }
      },
      grid: {
        title: { b: { c: 'X!' } }
      }
    }
  })

  t.same(s.bla.grid.get([ 'title', 'b', 'c' ]).keys(), [ '0', '1', '2', '3' ])

  t.end()
})

test('types - nested references over instances', t => {
  // more context
  const s = struct({
    page: {
      current: [ '@', 'parent', 'things' ],
      things: {
        list: { } // type: 'list' -- here it goes wrong...
      }
    }
  })

  // s2.get() get is nto good for this

  const s2 = s.create({
    page: {
      current: [ '@', 'root', 'page', 'things', 'list', 'items', 'hello', 'img' ]
    }
  })

  t.equal(s2.page.current.val.key, 'img', 'correct keys')
  t.equal(s2.page.things.list.items.hello.img, s2.page.current.val, 'reference is updated')
  t.end()
})

test('types - use struct as type', t => {
  const bla = struct({
    text: 'its some text'
  })
  const s = struct({ type: bla })
  t.equal(s.inherits, bla, 'correct inheritance')
  t.same(s.keys(), [ 'text' ], 'correct keys')
  t.end()
})

test('types - use object as type', t => {
  const bla = { text: 'its some text' }
  const s = struct({ type: bla })
  t.same(s.keys(), [ 'text' ], 'correct keys')
  t.end()
})

test('types - use struct as type with parent', t => {
  const bla = struct({
    text: 'its some text'
  })
  const s = struct({ x: { type: bla } })
  t.equal(s.x.inherits, bla, 'correct inheritance')
  t.same(s.x.keys(), [ 'text' ], 'correct keys')
  t.end()
})

test('types - use struct as type with parent (object)', t => {
  const bla = { text: 'its some text' }
  const s = struct({ x: { type: bla } })
  t.same(s.x.keys(), [ 'text' ], 'correct keys')
  t.end()
})

test('types - set the same', { timeout: 3000 }, t => {
  const scraper = struct({
    page: {
      a: { type: 'foo' },
      b: [ '@', 'root', 'page', 'a' ]
    }
  })

  const scraperInstance = scraper.create()
  scraperInstance.subscribe(true, () => {})

  setTimeout(() => {
    scraper.set({
      page: {
        a: { type: 'foo' },
        b: [ '@', 'root', 'page', 'a' ]
      }
    })
    setTimeout(() => {
      scraper.set({
        page: {
          a: { type: 'foo' },
          b: [ '@', 'root', 'page', 'a' ]
        }
      })
      t.end()
    }, 100)
  }, 100)
})

// test('types - use object type creates correct types', t => {
//   const a = struct({
//     types: {
//       x: 'hello!',
//       y: {
//         type: {
//           thing: {
//             type: 'x'
//           }
//         }
//       }
//     }
//   })
//   t.same(a.types.y.get('types').keys(), [], 'types y doesnt have own types')
//   t.same(a.types.y.get('thing').compute(), 'hello!')
//   t.end()
// })

test('types - use object type creates correct types', t => {
  const x = {
    a: 'a',
    b: 'b',
    c: 'c',
    d: 'd',
    e: 'e'
  }

  const z = {
    bla: true
  }

  const y = {
    props: {
      default: {
        type: x,
        field: {
          props: {
            bla: {
              type: z
            }
          }
        }
      }
    },
    a: 'ay',
    b: 'by',
    xx: {
      field: {
        bla: {
          x: true
        }
      }
    }
  }

  var i = 1e3

  const arr = []
  while (i--) {
    arr.push({
      x: {
        val: i,
        type: x
      },
      y: {
        val: i,
        type: y,
        xxx: {
          type: z
        }
      }
    })
  }

  var d = Date.now()
  const elem = struct({ // eslint-disable-line
    fields: arr
  })

  t.ok(Date.now() - d < 1000, 'creating 1k deep object types is faster then 1000ms')

  t.end()
})
