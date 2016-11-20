'use strict'
const { diff } = require('./diff')
const { remove, removeReference } = require('./remove')

const composite = () => {
  // changed = composite(travelt, subs, update, treeKey, stamp, void 0, removed)
}

const isStruct = t => t.val && typeof t.val === 'object' && t.val.inherits

const copy = (a) => {
  var r = {}
  for (var i in a) {
    if (i !== '_' && i !== '_p') {
      if (typeof a[i] === 'object' && i !== '$t') {
        r[i] = copy(a[i])
      } else {
        r[i] = a[i]
      }
    }
  }
  return r
}

const updateReference = (t, subs, cb, tree, referenced, previous) => {
  if (isStruct(t)) {
    if (tree.val && tree.val.$t !== t.val) {
      previous = tree.val
      // bit strange...
      removeReference(subs, cb, tree.val, t.val)
      reference(t.val, subs, cb, tree, referenced, previous)
    } else {
      reference(t.val, subs, cb, tree, referenced, previous)
    }
  } else if (tree.val) {
    removeReference(subs, cb, tree.val)
  }
}

const createReference = (t, subs, cb, tree, referenced, previous) => {
  if (isStruct(t)) {
    console.log('create ref', t.path())
    reference(t.val, subs, cb, tree, referenced, previous)
  }
}

const reference = (t, subs, cb, tree, referenced, previous) => {
  var branch = tree.val
  var changed
  if (t) {
    const stamp = t.tStamp || t.stamp || 0
    if (!branch) {
      branch = tree.val = { _p: tree, _key: 'val', $t: t }
      branch.$ = stamp
      diff(t, subs, cb, branch, referenced, void 0, previous)
      createReference(t, subs, cb, branch, referenced, previous)
      changed = true
    } else if (branch.$ !== stamp) {
      branch.$ = stamp
      diff(t, subs, cb, branch, referenced, void 0, previous)
      updateReference(t, subs, cb, branch, referenced, previous)
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
  if (t) {
    const stamp = t.tStamp || 0
    if (!branch) {
      branch = tree[key] = { _p: tree, _key: key, $t: t }
      branch.$ = stamp
      if (subs.val) {
        if (previous) {
          if (subs.val === true && (previous.$ !== stamp || previous.$t !== t)) {
            cb(t, 'update', subs, branch)
          }
        } else {
          cb(t, 'new', subs, branch)
        }
      }
      if (tree.val) { refCreateFieldFinder(tree.val, key, subs, cb) }
      diff(t, subs, cb, branch, void 0, void 0, previous)
      createReference(t, subs, cb, branch, t)
      changed = true
    } else if (branch.$ !== stamp) {
      branch.$ = stamp
      if (subs.val === true) { cb(t, 'update', subs, branch) }
      diff(t, subs, cb, branch, void 0, void 0, previous)
      updateReference(t, subs, cb, branch, t, previous)
      changed = true
    } else if (branch.$c) {
      changed = composite()
      if (changed && subs.val === true) { cb(t, 'update', subs, branch) }
    }
  } else if (branch) {
    remove(subs, cb, branch)
    if (tree.val) {
      refRemoveFieldFinder(tree.val, key, subs, cb)
    }
    changed = true
  }
  return changed
}

module.exports = property

const refRemoveFieldFinder = (branch, key, subs, cb) => {
  const t = branch.$t.get(key)
  if (t) {
    property(key, t, subs, cb, branch)
  } else if (branch.val) {
    refRemoveFieldFinder(branch.val, key, subs, cb)
  }
}

const refCreateFieldFinder = (tree, key, subs, cb) => {
  const branch = tree[key]
  if (branch) {
    remove(subs, cb, branch)
  } else if (tree.val) {
    refCreateFieldFinder(tree.val, key, subs, cb)
  }
}
