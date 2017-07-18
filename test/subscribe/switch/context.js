const test = require('tape')
const { struct } = require('../../../')
const bs = require('stamp')

test('subscription - $switch in context', t => {
  t.plan(5)

  const s = struct.create({
    pages: {
      pageA: {
        titleA: 'A'
      },
      pageB: {
        titleB: 'B'
      }
    }
  })

  const c1 = s.create({
    ref: ['@', 'root', 'pages', 'pageA']
  })
  const c2 = s.create({
    ref: ['@', 'root', 'pages', 'pageB']
  })

  const sub = {
    ref: {
      $switch: t => {
        return t.origin().key === 'pageA' ? {
          titleA: { val: true }
        } : {
          titleB: { val: true }
        }
      }
    }
  }

  c1.subscribe(sub, (val, type) => {
    if (type === 'new' && val.val) {
      t.equals(
        c1.get(['ref', 'val']).key, val.parent().key,
        `c1 subscription fired correctly for ${val.key}`
      )
    }
  })
  c2.subscribe(sub, (val, type) => {
    if (type === 'new' && val.val) {
      t.equals(
        c2.get(['ref', 'val']).key, val.parent().key,
        `c2 subscription fired correctly for ${val.key}`
      )
    }
  })

  Promise.all([
    c1.get(['ref', 'titleA']).once('A'),
    c2.get(['ref', 'titleB']).once('B')
  ])
    .then(() => {
      const stamp = bs.create()
      c1.set({ ref: ['@', 'root', 'pages', 'pageB'] }, stamp)
      c2.set({ ref: ['@', 'root', 'pages', 'pageA'] }, stamp)
      bs.close()

      return Promise.all([
        c1.get(['ref', 'titleB']).once('B'),
        c2.get(['ref', 'titleA']).once('A')
      ])
    })
    .then(() => {
      t.pass('page switched for both c1 and c2')
    })
})
