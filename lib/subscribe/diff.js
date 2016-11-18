var property, remove
// , any

const { get } = require('../get')

const referencedCheck = (t, key) => !(key in t) || t[key] === null

const diff = (t, subs, cb, tree, referenced, removed, compare) => {
  var changed
  for (let key in subs) {
    if (key !== 'val' && key !== '$' && key !== '_' && key !== '$remove') {
      if (item(key, t, subs[key], cb, tree, referenced, removed, compare)) {
        changed = true
      }
    }
  }
  return changed
}

const item = function item (key, t, subs, cb, tree, referenced, removed, compare) {
  var changed
  if (key === '$any') {
    // also pass compare
    // maybe any does not need anything special can just go in here
    // changed = any(t, subs, cb, tree, removed)
  } else {
    if (!referenced || referencedCheck(referenced, key)) {
      if (compare) { compare = compare[key] }
      if (removed) {
        if (tree[key]) { remove(subs, cb, tree[key]) }
      } else {
        changed = property(
          key,
          t && get(t, key),
          subs,
          cb,
          tree,
          compare
        )
      }
    } else {
      if (compare) { compare = compare[key] }
      if (tree[key]) {
        changed = diff(t && get(t, key), subs, cb, tree[key], referenced[key], removed, compare)
      }
    }
  }
  return changed
}

exports.item = item
exports.diff = diff

property = require('./property')
remove = require('./remove').remove
// any = require('./any')
