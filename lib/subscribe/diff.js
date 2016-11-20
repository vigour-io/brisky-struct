var property, remove, any

const { get } = require('../get')

const exclude = (t, key, origin) => (!(key in t) || t[key] === null) &&
  (
    typeof t.val !== 'object' || !t.val.inherits || origin === t.val ||
    exclude(t.val, key, origin || t)
  )

const diff = (t, subs, cb, tree, removed, referenced, previous) => {
  var changed
  for (let key in subs) {
    if (key !== 'val' && key !== '$' && key !== '_' && key !== '$remove') {
      if (item(key, t, subs[key], cb, tree, removed, referenced, previous)) {
        changed = true
      }
    }
  }
  return changed
}

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
    }
    previous = previous.val
  }
}

const item = (key, t, subs, cb, tree, removed, referenced, previous) => {
  var changed
  if (key === '$any') {
    // similair things in here (really really similair)
    any(t, subs, cb, tree, removed, referenced, previous)
  } else {
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
  }
  return changed
}

exports.item = item
exports.diff = diff

property = require('./property')
remove = require('./remove').remove
any = require('./any')
