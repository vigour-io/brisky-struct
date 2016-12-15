import test from 'tape'
import { create as struct } from '../lib/'

test('get - defaults', t => {
  const a = struct()
  t.equal(a.get('x', false).val, false, 'string')
  t.equal(a.get([ 'a', 'b', 'c' ], 'hello').val, 'hello', 'array')
  t.equal(a.get([ 'a', 'b', 'd' ], 0).val, 0, 'array - falsy')
  t.end()
})

test('get - methods', t => {
  const a = struct({ a: { b: { c: true } } })
  t.equal(a.a.b.c.get('parent'), a.a.b, 'parent')
  t.end()
})

test('get - origin', t => {
  const a = struct({ c: true })
  const b = struct({ a: { b: a } })
  const c = struct(b)
  t.equal(c.get(['a', 'b', 'c']), a.c, 'references')
  t.end()
})
