'use strict'
var property

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
  return property(
    key,
    t && key in t && t[key],
    subs,
    cb,
    tree,
    key in tree && tree[key]
  )
}

module.exports = diff

property = require('./property')
