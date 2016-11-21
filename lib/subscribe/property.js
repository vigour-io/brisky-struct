'use strict'
const { diff, parse, item } = require('./diff')
const { remove, removeReference } = require('./remove')

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

// ...  47,77,78

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

const include = (tree, key, subs, cb) => {
  const t = tree.$t.get(key)
  if (t) {
    // can it be that this needs be excluded?
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

const composite = (t, subs, cb, branch, tree) => {
  var changed
  const c = branch.$c
  if (tree._key === '$any') {
    for (let key in c) {
      if (key === 'val') {
        // maybe just get branch.$t
        if (composite(t.val, subs, cb, branch.val, tree)) {
          changed = true
        }
      } else {
        // item is basicly property....
        if (key in branch && item(key, t, subs[key], cb, branch)) {
          changed = true
        }
      }
    }
  } else {
    for (let key in c) {
      if (key === 'val') {
        if (composite(t.val, subs, cb, branch.val, tree)) {
          changed = true
        }
      } else {
        if (key in branch && key in subs && parse(key, t, subs, cb, branch)) {
          changed = true
        }
      }
    }
  }

  return changed
}

module.exports = property
