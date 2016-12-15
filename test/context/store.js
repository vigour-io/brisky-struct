const test = require('tape')
const struct = require('../../').create
test('context - apply and resolve', t => {
  const obj = struct({ a: { b: { c: true } } })
  const base2 = obj.create({ key: 'base2' })
  var a = base2.get('a')
  var b = base2.get([ 'a', 'b' ])
  var c = base2.get([ 'a', 'b', 'c' ])
  var context = base2.get([ 'a', 'b', 'c' ]).storeContext()
  t.equal(a.context, base2, 'context on "a"')
  obj.get([ 'a', 'b', 'c' ])
  t.equal(a.context, null, 'no context on "a" after reference base')
  var val = c.applyContext(context)
  t.equal(val, void 0, 'applyContext returns undefined when nothing is changed')
  t.equal(a.context, base2, 'c ontext on "a" after applying context')
  t.equal(b.context, base2, 'context on "b" after applying context')
  t.equal(c.context, base2, 'context on "c" after applying context')
  base2.get('a').set('its my own')
  t.equal(obj.a.context, null, 'no context on "a" after resolve')
  val = c.applyContext(context)
  t.equal(val, c, 'applyContext returns base when something is changed')
  t.equal(a.context, null, 'no context on "a" after applying context after resolve')
  t.equal(b.context, base2.a, 'context on "b" after applying context')
  t.equal(c.context, base2.a, 'context on "c" after applying context')
  t.equal(base2.a.context, void 0, 'no context on "base2.a" after applying context')
  const base3 = obj.create({ key: 'base3' })
  a = base3.get('a')
  b = base3.get([ 'a', 'b' ])
  c = base3.get([ 'a', 'b', 'c' ])
  context = base3.get([ 'a', 'b', 'c' ]).storeContext()
  base3.get([ 'a', 'b' ]).set('its my own')
  val = c.applyContext(context)
  t.equal(val, c, 'applyContext returns base when something is changed')
  t.equal(a.context, null, 'no context on "a" after applying context after resolve')
  t.equal(b.context, null, 'no context on "b" after applying context')
  t.equal(c.context, base3.a.b, 'context on "c" after applying context')
  t.equal(base3.a.context, void 0, 'no context on "base3.a" after applying context')
  const base4 = obj.create({ key: 'base4' })
  a = base4.get('a')
  context = base4.get('a').storeContext()
  base4.get('a').set('its my own')
  val = a.applyContext(context)
  t.ok(a !== base4.a, 'created new instance for base4.a')
  t.equal(val, base4.a, 'applyContext returns Base')
  t.equal(a.context, null, 'no context on "a" after applying context after resolve')

  const base5 = obj.create({ key: 'base5' })
  a = base5.get('a')
  b = base5.get([ 'a', 'b' ])
  context = base5.get([ 'a', 'b' ]).storeContext()
  base5.get('a').set(null)
  val = b.applyContext(context)
  t.equal(val, null, 'applyContext returns null on removal of a field leading to the target')
  t.equal(b.context, null, 'no context on "b" after applying context')

  const base6 = obj.create({ key: 'base5' })
  a = base6.get('a')
  b = base6.get([ 'a', 'b' ])
  context = base6.get([ 'a', 'b' ]).storeContext()
  base6.get([ 'a', 'b' ]).set(null)
  val = b.applyContext(context)
  t.equal(val, null, 'applyContext returns null on removal of the target')
  t.equal(b.context, null, 'no context on "b" after applying context')
  const base7 = obj.create({ key: 'base5', a: {} })
  a = base7.get('a')
  b = base7.get([ 'a', 'b' ])
  context = base7.get([ 'a', 'b' ]).storeContext()

  base7.get('a').set(null)
  val = b.applyContext(context)
  t.equal(val, null, 'applyContext returns null on removal of the toplevel of target')
  t.end()
})

// double test
test('context - apply and resolve (double) - simple resolve', t => {
  const obj = struct({
    a: {
      b: {
        c: true
      }
    }
  })
  const instance = obj.create()
  const stored = instance.get(['a', 'b', 'c']).storeContext()
  instance.get(['a', 'b', 'c']).set(false)
  instance.get(['a', 'b', 'c']).applyContext(stored)
  t.equal(instance.get(['a', 'b', 'c']).context, null, 'dont restore context on a resolved field')
  t.end()
})

test('context - apply and resolve (double)', t => {
  const b = struct({
    val: 'b',
    key: 'B',
    nestB: 'nestB'
  })
  const c = struct({
    key: 'c',
    cA: {
      props: { cB: b },
      cB: {}
    }
  })
  var obj = c.get([ 'cA', 'cB', 'nestB' ])
  var context = obj.storeContext()
  obj.context = null
  obj.contextLevel = null
  var val = obj.applyContext(context)
  t.same(val, void 0, 'val is "undefined" for "c"')
  t.same(obj.path(), [ 'c', 'cA', 'cB', 'nestB' ], 'applied correct context on "c"')

  const d = c.create({ key: 'd' })
  obj = d.get([ 'cA', 'cB', 'nestB' ])
  t.same(obj.path(), [ 'd', 'cA', 'cB', 'nestB' ], '"d" has correct context')
  context = obj.storeContext()
  obj.context = null
  obj.contextLevel = null
  val = obj.applyContext(context)
  t.same(val, void 0, 'val is "undefined" for "d"')
  t.same(obj.path(), [ 'd', 'cA', 'cB', 'nestB' ], 'applied correct context on "d"')
  c.get([ 'cA', 'cB', 'nestB' ]).set('c')
  val = obj.applyContext(context)
  t.same(
    obj.path(),
    [ 'B', 'nestB' ],
    'set "c" cleared context for "obj" (no longer a valid target)'
  )
  t.same(
    val.path(),
    [ 'd', 'cA', 'cB', 'nestB' ],
    'applied correct context on "c.cA.cB.nestB"'
  )
  t.same(val, c.get([ 'cA', 'cB', 'nestB' ]), 'val is "c.cA.cB.nestB" for "d"')
  obj = d.get([ 'cA', 'cB', 'nestB' ])
  context = obj.storeContext()
  d.get([ 'cA', 'cB', 'nestB' ]).set('d')
  val = obj.applyContext(context)
  t.same(
    obj.path(),
    [ 'c', 'cA', 'cB', 'nestB' ],
    'set "d" cleared context for "obj" (no longer a valid target)'
  )
  t.same(
    val.path(),
    [ 'd', 'cA', 'cB', 'nestB' ],
    'applied correct context on "d.cA.cB.nestB"'
  )

  const e = c.create({ key: 'e' })
  obj = e.get([ 'cA', 'cB', 'nestB' ])
  context = obj.storeContext()
  c.get([ 'cA', 'cB', 'nestB' ]).set(null)
  val = obj.applyContext(context)
  t.equal(val, null, 'applyContext returns null on removal of "c.cA.cB.nestB"')
  t.end()
})
