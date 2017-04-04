const test = require('tape')
const { struct } = require('../')

test('reset - basic ', t => {
  const a = struct.create({
    a: {
      b: {
        c : true
      },
      x: true
    },
    b: {
      c: true,
      d: true
    },
    c: 'bla'
  })
  a.set({
    a: {
      b: 'ha!'
    },
    b: {
      d: {
        e: true
      }
    },
    b: {
      d: 'smurf'
    }
  }, void 0, true)
  t.same(a.keys(), [ 'a', 'b' ])
  t.same(a.a.keys(), [ 'b' ])
  t.same(a.a.b.keys(), [])
  t.same(a.b.keys(), [ 'd' ])
  t.end()
})

test('reset - listeners ', t => {
  var results = {
    a: 0,
    b: 0,
    c: 0
  }

  const a = struct.create({
    a: {
      on: () => results.a++,
      b: {
        on: () => results.b++,
        c: { on: () => results.c++ }
      }
    }
  })

  results = {
    a: 0,
    b: 0,
    c: 0
  }

  a.set({
    a: {
      b: {
        bla: true
      }
    }
  }, void 0, true)

  t.same(results, { a: 0, b: 1, c: 1 })

  t.end()
})
