const test = require('tape')
const { struct, switchInheritance, getVal } = require('../')

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
  const a = struct.create({ bla: 'bla' })
  const a1 = a.create({
    gurt: { blurf: true }
  })
  const a11 = a1.create({
    gurt: {
      blurf: { blarf: true }
    }
  })
  const b = struct.create({
    gurt: {
      blurf: {
        blarf: { haha: true }
      }
    }
  })
  switchInheritance(a, b)
  t.same(a11.gurt.blurf.blarf.keys(), [ 'haha' ], 'correct keys')
  t.end()
})

test('switch inheritance - emitters', t => {
  var result = { a: 0, a1b: 0, a11: 0, gurf: 0, smurx: 0 }
  const a = struct.create({ bla: 'bla',
    on: {
      data: () => {
        result.a++
      }
    }
  })
  const a1 = a.create({
    b: {
      on: {
        data: () => {
          result.a1b++
        }
      }
    }
  })
  const a11 = a1.create({ //eslint-disable-line
    on: {
      data: {
        bla: () => result.a11++
      }
    }
  })
  const b = struct.create({
    on: {
      data: {
        gurf: () => result.gurf++
      }
    },
    b: {
      on: {
        data: {
          smurx: () => result.smurx++
        }
      }
    }
  })
  switchInheritance(a, b)
  result = { a: 0, a1b: 0, a11: 0, gurf: 0, smurx: 0 }
  b.set('jurfff')
  t.same(result, { a: 3, a11: 1, a1b: 0, gurf: 3, smurx: 0 })
  result = { a: 0, a1b: 0, a11: 0, gurf: 0, smurx: 0 }
  b.b.set('jurfff')
  t.same(result, { a: 0, a1b: 2, a11: 0, gurf: 0, smurx: 4 })
  t.end()
})

test('switch inheritance - instances - fields', t => {
  const hub = struct.create()
  const hubInstance = hub.create({ b: {} })
  hub.set({ b: 'bla' })
  t.equal(hubInstance.b.compute(), 'bla', 'resolves')
  t.end()
})

test('references - resolve from listeners', t => {
  const hub = struct.create({ x: true, y: true })
  const hubInstance = hub.create({ x: 'hello' })
  hub.set({ y: [ '@', 'root', 'x' ] })
  t.equal(hubInstance.y.val, hubInstance.x, 'resolve refs')
  t.end()
})

test('references - resolve from instance', t => {
  const hub = struct.create()
  const hubInstance = hub.create({ b: { glurf: true }, x: 'x!' })
  hub.set({ b: [ '@', 'root', 'x' ] })
  t.equal(hubInstance.b.val, hubInstance.x, 'resolve refs')
  t.end()
})

test('references - resolve from instance (one field)', t => {
  const hub = struct.create()
  const hubInstance = hub.create({ x: true })
  hub.set({ b: [ '@', 'root', 'x' ] })
  t.equal(hubInstance.b.val, hubInstance.x, 'resolve refs')
  t.end()
})

test('references - references resolve from switch', t => {
  const hub = struct.create()
  const hubInstance = hub.create({ b: {}, x: true })
  hub.set({ b: [ '@', 'root', 'x' ] })
  t.equal(hubInstance.b.val, hubInstance.x, 'resolve refs')
  t.end()
})

test('switch inheritance - references - reverse', t => {
  const hub = struct.create()
  const hubInstance = hub.create({
    page: {
      current: [ '@', 'root', 'page', 'glurf' ]
    }
  })
  hub.set({
    page: {
      current: [ '@', 'root', 'page', 'blurk' ],
      glurf: { smurk: 'ha!' }
    }
  })
  t.equal(hubInstance.get([ 'page', 'glurf', 'smurk' ]).compute(), 'ha!')
  t.end()
})

test('switch inheritance - references', t => {
  const hub = struct.create({
    x: 'hello'
  })
  const hubInstance = hub.create({
    b: {
      hello: true
    },
    c: {
      gurk: true
    },
    x: 'bye'
  })
  hub.set({
    b: [ '@', 'root', 'x' ],
    c: [ '@', 'root', 'y' ]
  })
  t.equal(hubInstance.b.val, hubInstance.x)
  t.equal(getVal(hubInstance.c), hub.y)
  t.end()
})

test('switch inheritance - gaurds', t => {
  const hub = struct.create({
    x: 'hello'
  })
  const hubInstance = hub.create({
    b: {
      hello: true
    },
    c: {
      gurk: true
    },
    x: 'bye'
  })
  hub.set({
    b: [ '@', 'root', 'x' ],
    c: [ '@', 'root', 'y' ]
  })
  t.equal(hubInstance.b.val, hubInstance.x)
  t.equal(getVal(hubInstance.c), hub.y)
  t.end()
})

test('switch inheritance - gaurds', t => {
  const a = struct.create('hello')
  const a1 = a.create()
  switchInheritance(a1, struct)
  t.equal(a1.compute(), void 0)
  t.end()
})
