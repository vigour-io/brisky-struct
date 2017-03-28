const test = require('tape')
const { struct, switchInheritance } = require('../')

test('switch inheritance - val', t => {
  const a = struct.create()
  const b = struct.create('b!')
  switchInheritance(a, b)
  t.equal(a.compute(), 'b!', 'correct val')
  t.end()
})

test('switch inheritance - keys', t => {
  const x = struct.create({
    x: { a: true, b: true },
    y: true,
    z: { bla: true }
  })
  const a = x.create({
    props: {
      g: () => {},
      dirt: { bye: true },
      h: { hello: true }
    },
    a: 'a!',
    z: 'z!',
    x: { b: 'yo!' },
    d: true,
    h: 'o o!'
  })
  const b = struct.create({
    b: 'b!',
    c: { d: 'd!' },
    d: 'hello',
    props: {
      x: 'myballz',
      default: {
        haha: 'fun!'
      }
    }
  })
  switchInheritance(a, b)
  t.same(x.instances.length, 0, 'removed instance')
  t.same(a.keys(), [ 'b', 'c', 'x', 'z', 'a', 'd', 'h' ], 'keys')
  t.equal(a.get('b').compute(), 'b!', 'vals')
  t.equal(a.get([ 'c', 'd' ]).compute(), 'd!', 'context')
  t.same(a.z.keys(), [ 'haha' ], 'correct keys')
  t.equal(a.get([ 'z', 'bla' ]), void 0, 'remove inherited field')
  a.set({ dirt: 'hello' })
  t.same(a.dirt.keys(), [ 'haha', 'bye' ], 'merged keys')
  t.end()
})

test('switch inheritance - instances', t => {
  const a = struct.create({
    bla: 'bla'
  })

  const a1 = a.create({
    gurt: {
      blurf: true
    }
  })

  const a11 = a1.create({
    gurt: {
      blurf: {
        blarf: true
      }
    }
  })

  const b = struct.create({
    gurt: {
      blurf: {
        blarf: {
          haha: true
        }
      }
    }
  })

  switchInheritance(a, b)

  t.same(a11.gurt.blurf.blarf.keys(), [ 'haha' ], 'correct keys')
  t.end()
})
