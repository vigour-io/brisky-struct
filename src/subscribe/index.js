import { diff } from './diff'

const listen = (t, fn) => t.subscriptions.push(fn)

// add ref supports here -- use references field in prop or even simpler
const subscribe = (t, subs, cb, tree) => {
  if (!t.subscriptions) t.subscriptions = []
  if (!tree) tree = {}
  t._c = null
  t._cLevel = null
  tree.$t = t
  if (subs.val) {
    if (subs.val === true || subs.val === 'shallow') {
      listen(t, () => {
        cb(t, 'update', subs, tree)
        diff(t, subs, cb, tree, void 0, void 0, t)
      })
    } else {
      listen(t, () => diff(t, subs, cb, tree, void 0, void 0, t))
    }
    cb(t, 'new', subs, tree)
  } else {
    listen(t, () => diff(t, subs, cb, tree, void 0, void 0, t))
  }
  diff(t, subs, cb, tree, void 0, void 0, t)
  return tree
}

const parse = (subs) => {
  if (subs) {
    if (subs === true) return { val: true }
    const result = {}
    for (let key in subs) {
      let sub = subs[key]
      if (key === 'val' || key === '_' || key === '$blockRemove') {
        result[key] = sub
      } else {
        let type = typeof sub
        if (type === 'object') {
          result[key] = parse(sub)
        } else if (type === 'function') {
          result[key] = sub
        } else {
          result[key] = { val: sub }
        }
      }
    }
    return result
  }
}

export { subscribe, parse }
