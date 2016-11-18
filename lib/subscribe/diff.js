var property, remove, any

const { get } = require('../get')

const referencedCheck = (t, key) => !(key in t) || t[key] === null

const diff = (t, subs, cb, tree, referenced, removed, previous) => {
  var changed
  for (let key in subs) {
    if (key !== 'val' && key !== '$' && key !== '_' && key !== '$remove') {
      if (item(key, t, subs[key], cb, tree, referenced, removed, previous)) {
        changed = true
      }
    }
  }
  return changed
}

const item = (key, t, subs, cb, tree, referenced, removed, previous) => {
  var changed
  if (key === '$any') {
    any(t, subs, cb, tree, referenced, removed, previous)
  } else {
    if (!referenced || referencedCheck(referenced, key)) {
      if (previous) { previous = previous[key] }
      if (removed) {
        if (tree[key]) {
          remove(subs, cb, tree[key])
          changed = true
        }
      } else {
        changed = property(key, t && get(t, key), subs, cb, tree, previous)
      }
    } else if (tree[key]) {
      if (previous) { previous = previous[key] }
      changed = diff(t && get(t, key), subs, cb, tree[key], referenced[key], removed, previous)
    }
  }
  return changed
}

exports.item = item
exports.diff = diff

property = require('./property')
remove = require('./remove').remove
any = require('./any')
