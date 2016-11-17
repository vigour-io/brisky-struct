'use strict'
var property, any

const diff = (t, subs, cb, tree) => {
  var changed
  for (let key in subs) {
    if (key !== 'val' && key !== '$' && key !== '_' && key !== '$remove') {
      if (item(key, t, subs[key], cb, tree)) {
        changed = true
      }
    }
  }
  return changed
}

const item = function item (key, t, subs, cb, tree) {
  var changed
  if (key === '$any') {
    changed = any(t, subs, cb, tree)
  } else {
    changed = property(
      key,
      t && key in t && t[key],
      subs,
      cb,
      tree,
      key in tree && tree[key]
    )
  }
  return changed
}

exports.item = item
exports.diff = diff

property = require('./property')
any = require('./any')
