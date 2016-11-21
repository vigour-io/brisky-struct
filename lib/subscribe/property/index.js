const { diff } = require('../diff')
const { remove } = require('./remove')
const { get, getOrigin } = require('../../get')
const { createReference, updateReference } = require('./references')
const composite = require('./composite')

const prev = (t, previous, key) => {
  while (previous && typeof previous === 'object' && previous.inherits) {
    if (previous === t) {
      return get(previous, key)
    } else if (get(previous, key)) {
      return false
    }
    previous = previous.val
  }
}

const include = (tree, key, subs, cb) => {
  const t = tree.$t.get(key)
  if (t) {
    update(key, t, subs, cb, tree)
  } else if (tree.val) {
    include(tree.val, key, subs, cb)
  }
}

const exclude = (tree, key, subs, cb) => {
  const branch = tree[key]
  if (branch) {
    remove(subs, cb, branch)
  } else if (tree.val) {
    exclude(tree.val, key, subs, cb)
  }
}

const update = (key, t, subs, cb, tree, previous, referenced) => {
  var branch = tree[key]
  var changed
  if (t) {
    const stamp = t.tStamp || 0
    if (!branch) {
      branch = tree[key] = { _p: tree, _key: key, $t: t }
      branch.$ = stamp
      if (tree.val) { exclude(tree.val, key, subs, cb) }
      if (previous) {
        let prevKey = prev(tree.$t, previous, key)
        if (subs.val && prevKey !== t) { cb(t, 'new', subs, branch) }
        prevKey = getOrigin(previous, key)
        diff(t, subs, cb, branch, void 0, void 0, prevKey)
        createReference(t, subs, cb, branch, t, prevKey)
      } else {
        if (subs.val) { cb(t, 'new', subs, branch) }
        diff(t, subs, cb, branch)
        createReference(t, subs, cb, branch, t)
      }
      changed = true
    } else if (branch.$ !== stamp) {
      branch.$ = stamp
      if (subs.val === true) { cb(t, 'update', subs, branch) }
      diff(t, subs, cb, branch)
      updateReference(t, subs, cb, branch, t)
      changed = true
    } else if (branch.$c) {
      if (composite(t, subs, cb, branch, tree)) {
        changed = true
      }
      if (changed && subs.val === true) { cb(t, 'update', subs, branch) }
    }
  } else if (branch) {
    remove(subs, cb, branch)
    if (tree.val) { include(tree.val, key, subs, cb) }
    changed = true
  }
  return changed
}

const excludeCheck = (t, key, origin) => (!(key in t) || t[key] === null) &&
  (
    typeof t.val !== 'object' || !t.val.inherits || origin === t.val ||
    excludeCheck(t.val, key, origin || t)
  )

const match = (key, t, referenced, branch) => {
  while (typeof referenced === 'object' && referenced.inherits) {
    if (referenced === t) {
      return true
    } else if (key in referenced && referenced[key] !== null) {
      return false
    }
    referenced = referenced.val
  }
}

const property = (key, t, subs, cb, tree, removed, referenced, previous) => {
  var changed
  if (!referenced || removed || excludeCheck(referenced, key, t)) {
    if (removed) {
      const branch = tree[key]
      if (branch) {
        if (!referenced || !match(key, tree.$t, referenced, branch)) {
          remove(subs, cb, branch, referenced && getOrigin(referenced, key))
          changed = true
        }
      }
    } else {
      changed = update(
        key,
        get(t, key),
        subs,
        cb,
        tree,
        previous
      )
    }
  }
  return changed
}

module.exports = property
