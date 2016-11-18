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
      console.log('yo yo yo', t, tree.val.$t, Object.keys(tree.val))
      removeReference(subs, cb, tree.val, t.val)
      console.log('remove! dirty bitch')

      reference(t.val, subs, cb, tree, t, old)
    } else {
      reference(t.val, subs, cb, tree, t)
    }
  } else {
    if (tree.val) {
      // console.log('has branch.val BUT -- wil do this later')
    }
  }
}

const createReference = (t, subs, cb, tree) => {
  if (isStruct(t)) { reference(t.val, subs, cb, tree, t) }
}

const reference = (t, subs, cb, tree, referenced, compare) => {
  var branch = tree.val
  var changed
  if (t && (t.val === void 0 || t.val !== null)) {
    const stamp = t.tStamp || t.stamp || 0
    if (!branch) {
      branch = tree.val = { _p: tree, _key: 'val', $t: t }
      branch.$ = stamp
      diff(t, subs, cb, branch, referenced, void 0, compare)
      createReference(t, subs, cb, branch)
      changed = true
    } else if (branch.$ !== stamp) {
      branch.$ = stamp
      diff(t, subs, cb, branch, referenced, void 0, compare)
      updateReference(t, subs, cb, branch)
      changed = true
    } else if (branch.$c) {
      changed = composite()
    }
  } else if (branch) {
    // compare ?
    remove(subs, cb, branch) // may want remove reference here
    changed = true
  }
  return changed
}

const property = (key, t, subs, cb, tree, removed, compare) => {
  var branch = tree[key] // difference
  var changed
  if (t && (t.val === void 0 || t.val !== null) && !removed) {
    const stamp = t.tStamp || t.stamp || 0
    if (!branch) {
      branch = tree[key] = { _p: tree, _key: key, $t: t } // difference

      branch.$ = stamp

      // difference *
      if (subs.val) {
        if (compare) {
          if (subs.val === true) { cb(t, 'update', subs, branch) }
        } else {
          cb(t, 'new', subs, branch)
        }
      }
      // * difference

      diff(t, subs, cb, branch, void 0, void 0, compare)
      createReference(t, subs, cb, branch)
      changed = true
    } else if (branch.$ !== stamp) {
      branch.$ = stamp

      if (subs.val === true) { cb(t, 'update', subs, branch) } // difference

      diff(t, subs, cb, branch, void 0, void 0, compare)
      updateReference(t, subs, cb, branch)
      changed = true
    } else if (branch.$c) {
      changed = composite() // also need to handle over the reference

      if (changed && subs.val === true) { cb(t, 'update', subs, branch) } // difference
    }
  } else if (branch) {
    console.log('REMOVE')
    remove(subs, cb, branch)
    changed = true
  }
  return changed
}

module.exports = property
