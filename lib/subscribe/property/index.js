const { diff } = require('../diff')
const remove = require('./remove')
const { getOrigin } = require('../../get')

const update = (key, t, subs, cb, tree, c) => {
  var branch = tree[key]
  var changed
  if (t) {
    const stamp = t.tStamp || 0 // needs to use stamp as well (if dstamp is gone)
    if (!branch) {
      branch = tree[key] = { _p: tree, _key: key, $t: t }
      branch.$ = stamp
      if (subs.val) { cb(t, 'new', subs, branch) }
      diff(t, subs, cb, branch, void 0, c)
      changed = true
    } else if (branch.$ !== stamp || branch.$t !== t) {
      branch.$t = t
      branch.$ = stamp
      if (subs.val === true) { cb(t, 'update', subs, branch) }
      diff(t, subs, cb, branch, void 0, c)
      changed = true
    } else if (branch.$c) {
      if (diff(t, subs, cb, branch, void 0, branch.$c)) {
        changed = true // cover this
      }
      if (changed && subs.val === true) { cb(t, 'update', subs, branch) }
    }
  } else if (branch) {
    remove(subs, cb, branch)
    changed = true
  }
  return changed
}

const property = (key, t, subs, cb, tree, removed, composite) => {
  var changed
  if (removed) {
    const branch = tree[key]
    if (branch) {
      remove(subs, cb, branch)
      changed = true
    }
  } else {
    t = getOrigin(t, key)
    if (t) {
      changed = update(
        key,
        t,
        subs,
        cb,
        tree,
        composite
      )
    }
  }
  return changed
}

exports.property = property
exports.update = update
