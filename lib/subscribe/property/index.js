const { diff, parse } = require('../diff')
const remove = require('./remove')
const { getOrigin } = require('../../get')

const update = (key, t, subs, cb, tree) => {
  var branch = tree[key]
  var changed
  if (t) {
    const stamp = t.tStamp || 0 // needs to use stamp as well (if dstamp is gone)
    if (!branch) {
      branch = tree[key] = { _p: tree, _key: key, $t: t }
      branch.$ = stamp
      if (subs.val) { cb(t, 'new', subs, branch) }
      diff(t, subs, cb, branch)
      changed = true
    } else if (branch.$ !== stamp || branch.$t !== t) {
      branch.$t = t
      branch.$ = stamp
      if (subs.val === true) { cb(t, 'update', subs, branch) }
      diff(t, subs, cb, branch)
      changed = true
    } else if (branch.$c) {
      if (composite(t, subs, cb, branch, tree)) {
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

const composite = (t, subs, cb, branch, tree) => {
  var changed
  const c = branch.$c
  if (tree._key === '$any') {
    for (let key in c) {
      // in this parse it can only do root / parent and composite nothing else
      // extra argument that says trough composite makes it a lot more solid
      // or key is also a possiblity
      if (key in branch && parse(key, t, subs, cb, branch)) {
        changed = true // cover this
      }
    }
  } else {
    for (let key in c) {
      if (key in branch && key in subs && parse(key, t, subs, cb, branch)) {
        changed = true // cover it!
      }
    }
  }
  return changed
}

const property = (key, t, subs, cb, tree, removed) => {
  var changed
  if (removed) {
    const branch = tree[key]
    if (branch) {
      remove(subs, cb, branch)
      changed = true
    }
  } else {
    changed = update(
      key,
      getOrigin(t, key),
      subs,
      cb,
      tree
    )
  }
  return changed
}

exports.property = property
exports.update = update
