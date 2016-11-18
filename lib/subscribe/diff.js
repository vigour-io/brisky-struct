'use strict'
const { get } = require('../get')

var property, any

const diff = (t, subs, cb, tree, force, from) => {
  var changed
  for (let key in subs) {
    if (key !== 'val' && key !== '$' && key !== '_' && key !== '$remove') {
      if (item(key, t, subs[key], cb, tree, force, from)) {
        changed = true
      }
    }
  }
  return changed
}

const item = function item (key, t, subs, cb, tree, force, from) {
  var changed
  if (key === '$any') {
    changed = any(t, subs, cb, tree, force)
  } else {
    if (!from || refCheck(from, key)) {
      changed = property(
        key,
        t && get(t, key),
        subs,
        cb,
        tree,
        force
      )
    }
  }
  return changed
}

// null?
// also hard with removal this one
const refCheck = (t, key) => !(key in t) || t[key] === null

exports.item = item
exports.diff = diff

property = require('./property')
any = require('./any')
