'use strict'
const { diff } = require('./diff')
const { remove, removeReference } = require('./remove')

const composite = () => {
  // changed = composite(travelt, subs, update, treeKey, stamp, void 0, removed)
}

const isStruct = t => t.val && typeof t.val === 'object' && t.val.inherits

const updateReference = (t, subs, cb, tree, referenced) => {
  if (isStruct(t)) {
    if (tree.val && tree.val.$t !== t.val) {
      const previous = tree.val.$t
      removeReference(subs, cb, tree.val, referenced)
      reference(t.val, subs, cb, tree, referenced, previous)
    } else {
      reference(t.val, subs, cb, tree, referenced)
    }
  } else if (tree.val) {
    removeReference(subs, cb, tree.val)
  }
}

const createReference = (t, subs, cb, tree, referenced, previous) => {
  if (isStruct(t)) {
    reference(t.val, subs, cb, tree, referenced, previous)
  }
}

const reference = (t, subs, cb, tree, referenced, previous) => {
  var branch = tree.val
  var changed
  const stamp = t.tStamp || t.stamp || 0
  if (!branch) {
    branch = tree.val = { _p: tree, _key: 'val', $t: t }
    branch.$ = stamp
    diff(t, subs, cb, branch, void 0, referenced, previous)
    createReference(t, subs, cb, branch, referenced, previous)
    changed = true
  } else if (branch.$ !== stamp) {
    branch.$ = stamp
    diff(t, subs, cb, branch, void 0, referenced)
    updateReference(t, subs, cb, branch, referenced)
    changed = true
  } else if (branch.$c) {
    changed = composite()
  }
  return changed
}

// ... 51,52,80,81

const property = (key, t, subs, cb, tree, previous) => {
  var branch = tree[key]
  var changed
  if (t) {
    const stamp = t.tStamp || 0
    if (!branch) {
      branch = tree[key] = { _p: tree, _key: key, $t: t }
      branch.$ = stamp
      if (tree.val) { exclude(tree.val, key, subs, cb) }
      if (subs.val && (!previous || previous !== t)) {
        cb(t, 'new', subs, branch)
      }
      diff(t, subs, cb, branch, void 0, void 0, previous)
      createReference(t, subs, cb, branch, t, previous)
      changed = true
    } else if (branch.$ !== stamp) {
      // never previous in here
      branch.$ = stamp
      if (subs.val === true) { cb(t, 'update', subs, branch) }
      diff(t, subs, cb, branch)
      updateReference(t, subs, cb, branch, t)
      changed = true
    } else if (branch.$c) {
      changed = composite()
      if (changed && subs.val === true) { cb(t, 'update', subs, branch) }
    }
  } else if (branch) {
    remove(subs, cb, branch)
    if (tree.val) { include(tree.val, key, subs, cb) }
    changed = true
  }
  return changed
}

module.exports = property

const include = (tree, key, subs, cb) => {
  const t = tree.$t.get(key)
  if (t) {
    // can it be that this need be excluded?
    property(key, t, subs, cb, tree)
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
