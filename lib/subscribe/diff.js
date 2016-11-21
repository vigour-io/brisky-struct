const { get } = require('../get')
var property, remove, any, root

const diff = (t, subs, cb, tree, removed, referenced, previous) => {
  var changed
  for (let key in subs) {
    if (key !== 'val' && key !== '$' && key !== '_' && key !== '$remove') {
      if (key === 'root') {
        // if removed
        changed = root(t, subs.root, cb, tree, removed)
      } else if (key === '$any') {
        changed = any(t, subs.$any, cb, tree, removed, referenced, previous)
      } else {
        changed = item(key, t, subs[key], cb, tree, removed, referenced, previous)
      }
    }
  }
  return changed
}

/*
  // if (key[0] === '$')
  // make these checks special prob better to do them in diff
  if (key === '$root') {

  } else if (key === '$any') {
    // similair things in here (really really similair)
    any(t, subs, cb, tree, removed, referenced, previous)
  } else {

*/

const exclude = (t, key, origin) => (!(key in t) || t[key] === null) &&
  (
    typeof t.val !== 'object' || !t.val.inherits || origin === t.val ||
    exclude(t.val, key, origin || t)
  )

const match = (t, referenced, branch) => {
  let key = branch._key
  while (referenced) {
    if (referenced === t) {
      return true
    } else if (key in referenced && referenced[key] !== null) {
      return false
    }
    referenced = referenced.val
  }
}

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

const item = (key, t, subs, cb, tree, removed, referenced, previous) => {
  var changed
  if (!referenced || removed || exclude(referenced, key, t)) {
    if (removed) {
      const branch = tree[key]
      if (branch) {
        if (!referenced || !match(tree.$t, referenced, branch)) {
          remove(subs, cb, branch)
          changed = true
        }
      }
    } else {
      changed = property(
        key,
        get(t, key),
        subs,
        cb,
        tree,
        previous && prev(t, previous, key)
      )
    }
  }
  return changed
}

exports.item = item
exports.diff = diff

property = require('./property')
remove = require('./remove').remove
any = require('./any')
root = require('./root')
