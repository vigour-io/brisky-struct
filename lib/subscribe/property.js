'use strict'
const { diff } = require('./diff')
const { remove, removeReference } = require('./remove')

const composite = () => {
  // changed = composite(travelt, subs, update, treeKey, stamp, void 0, removed)
}

const isStruct = t => t.val && typeof t.val === 'object' && t.val.inherits

const updateReference = (t, subs, cb, tree) => {
  if (isStruct(t)) {
    if (tree.val && tree.val.$t !== t.val) {
      const old = tree.val
      removeReference(subs, cb, tree.val, t.val)
      reference(t.val, subs, cb, tree, t, old)
    } else {
      reference(t.val, subs, cb, tree, t)
    }
  } else if (tree.val) {
    removeReference(subs, cb, tree.val)
  }
}

const createReference = (t, subs, cb, tree) => {
  if (isStruct(t)) { reference(t.val, subs, cb, tree, t) }
}

const reference = (t, subs, cb, tree, referenced, previous) => {
  var branch = tree.val
  var changed
  if (t && (t.val === void 0 || t.val !== null)) {
    const stamp = t.tStamp || t.stamp || 0
    if (!branch) {
      branch = tree.val = { _p: tree, _key: 'val', $t: t }
      branch.$ = stamp
      diff(t, subs, cb, branch, referenced, void 0, previous)
      createReference(t, subs, cb, branch)
      changed = true
    } else if (branch.$ !== stamp) {
      branch.$ = stamp
      diff(t, subs, cb, branch, referenced, void 0, previous)
      updateReference(t, subs, cb, branch)
      changed = true
    } else if (branch.$c) {
      changed = composite()
    }
  } else if (branch) {
    remove(subs, cb, branch)
    changed = true
  }
  return changed
}

const property = (key, t, subs, cb, tree, previous) => {
  var branch = tree[key]
  var changed
  if (!t) {
    if (branch) {
      remove(subs, cb, branch)
      changed = true
    }
  } else {
    const stamp = t.tStamp || t.stamp || 0
    if (!branch) {
      branch = tree[key] = { _p: tree, _key: key, $t: t }
      branch.$ = stamp
      if (subs.val) {
        if (previous) {
          if (subs.val === true) { cb(t, 'update', subs, branch) }
        } else {
          cb(t, 'new', subs, branch)
        }
      }
      diff(t, subs, cb, branch, void 0, void 0, previous)
      createReference(t, subs, cb, branch)
      changed = true
    } else if (branch.$ !== stamp) {
      branch.$ = stamp
      if (subs.val === true) { cb(t, 'update', subs, branch) }
      diff(t, subs, cb, branch, void 0, void 0, previous)
      updateReference(t, subs, cb, branch)
      changed = true
    } else if (branch.$c) {
      changed = composite()
      if (changed && subs.val === true) { cb(t, 'update', subs, branch) }
    }
  }
  return changed
}

module.exports = property
