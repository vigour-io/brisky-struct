'use strict'
const { get } = require('../get')

var property, any

const diff = (t, subs, cb, tree, referenced, removed) => {
  var changed
  for (let key in subs) {
    if (key !== 'val' && key !== '$' && key !== '_' && key !== '$removed') {
      if (item(key, t, subs[key], cb, tree, referenced, removed)) {
        changed = true
      }
    }
  }
  return changed
}

// const tree = (t, subs, cb, tree, referenced, removed) => {
//   var changed
//   for (let key in subs) {
//     if (key !== 'val' && key !== '$' && key !== '_' && key !== '$removed') {
//       if ()
//       if (item(key, t, subs[key], cb, tree, referenced, removed)) {
//         changed = true
//       }
//     }
//   }
//   return changed
// }

const item = function item (key, t, subs, cb, tree, referenced, removed) {
  var changed
  if (key === '$any') {
    changed = any(t, subs, cb, tree, removed)
  } else {
    if (!referenced || referencedCheck(referenced, key)) {
      changed = property(
        key,
        t && get(t, key),
        subs,
        cb,
        tree,
        void 0,
        removed
      )
    }
  }
  return changed
}

const referencedCheck = (t, key) => !(key in t) || t[key] === null

exports.item = item
exports.diff = diff
// exports.tree = tree

property = require('./property')
any = require('./any')
