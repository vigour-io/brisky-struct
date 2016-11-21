'use strict'
const { diff, parse } = require('./diff')
const { remove, removeReference } = require('./remove')
const { get } = require('../get')

const isStruct = t => t.val && typeof t.val === 'object' && t.val.inherits

const prev = (t, previous, key) => {
  while (previous) {
    if (previous === t) {
      return get(previous, key)
    } else if (get(previous, key)) { // oposite of removed
      return false
    }
    previous = previous.val
  }
}

const prevspesh = (previous, key) => {
  while (previous) {
    let x = get(previous, key)
    if (x) {
      return x
    }
    previous = previous.val
  }
}

const updateReference = (t, subs, cb, tree, referenced) => {
  if (isStruct(t)) {
    if (tree.val && tree.val.$t !== t.val) {
      const previous = tree.val.$t
      // console.log(' \nSTART remove')
      removeReference(subs, cb, tree.val, referenced)
      // console.log('DONE removing')
      // console.log(' \n')
      // console.log(' \nSTART create')
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
  const stamp = t.tStamp || t.stamp || 0
  if (!branch) {
    branch = tree.val = { _p: tree, _key: 'val', $t: t }
    branch.$ = stamp
    if (previous) {
      diff(t, subs, cb, branch, void 0, referenced, previous)
      createReference(t, subs, cb, branch, referenced, previous)
    } else {
      diff(t, subs, cb, branch, void 0, referenced)
      createReference(t, subs, cb, branch, referenced)
    }
    return true
  } else if (branch.$ !== stamp) {
    branch.$ = stamp
    diff(t, subs, cb, branch, void 0, referenced)
    updateReference(t, subs, cb, branch, referenced)
    return true
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
        let parseit = prev(tree.$t, previous, key)
        if (subs.val && parseit !== t) { cb(t, 'new', subs, branch) }
        parseit = prevspesh(previous, key)
        diff(t, subs, cb, branch, void 0, void 0, parseit)
        createReference(t, subs, cb, branch, t, parseit)
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

const include = (tree, key, subs, cb) => {
  const t = tree.$t.get(key)
  if (t) {
    // can it be that this needs be excluded?
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

const composite = (t, subs, cb, branch, tree) => {
  var changed
  const c = branch.$c
  if (tree._key === '$any') {
    for (let key in c) {
      if (key === 'val') {
        if (composite(t.val, subs, cb, branch.val, tree)) {
          changed = true
        }
      } else {
        if (key in branch && property(key, t, subs[key], cb, branch)) {
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

const excludeCheck = (t, key, origin) => (!(key in t) || t[key] === null) &&
  (
    typeof t.val !== 'object' || !t.val.inherits || origin === t.val ||
    excludeCheck(t.val, key, origin || t)
  )

const match = (key, t, referenced, branch) => {
  while (referenced) {
    if (referenced === t) {
      return true
    } else if (key in referenced && referenced[key] !== null) {
      return false
    }
    referenced = referenced.val
  }
}

const getReferencedKey = (key, t, referenced, branch) => {
  while (referenced) {
    let x = get(referenced, key)
    if (x) { return x }
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
          // console.log('REMOVE', key, referenced && referenced)
          remove(subs, cb, branch, referenced && getReferencedKey(key, branch.$t, referenced, branch))
          changed = true
        } else {
          // console.log('BLOCKED', key)
        }
      }
    } else {
      // console.log(key, ':', referenced && referenced.path(), previous && previous.path())
      // need to send deeper referenced unfortunately
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
