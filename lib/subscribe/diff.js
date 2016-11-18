var property
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
    console.log('   ', referenced, key)
    if (!referenced || referencedCheck(referenced, key)) {
      changed = property(
        key,
        t && get(t, key),
        subs,
        cb,
        tree,
        removed,
        compare
      )
    }
  }
  return changed
}

exports.item = item
exports.diff = diff
// exports.tree = tree

property = require('./property')
// any = require('./any')
