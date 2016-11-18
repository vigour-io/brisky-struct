'use strict'
const { item } = require('./diff')
const { getKeys } = require('../keys')

// do perf checks can just create an array

module.exports = function any (t, subs, cb, tree, referenced, removed, previous) {
  var changed
  if (removed) {
    if (tree.$any) {
      for (let key in tree.$any) {
        if (key !== '_p' && key !== '_key') {
          if (item(key, t, subs, cb, tree.$any, referenced, removed, previous)) {
            changed = true
          }
        }
      }
    }
  } else {
    const keys = getKeys(t)
    if (keys) {
      if (!tree.$any) {
        tree.$any = { _p: tree, _key: '$any' }
        for (let i = 0, len = keys.length; i < len; i++) {
          if (item(keys[i], t, subs, cb, tree.$any, referenced, removed, previous)) {
            changed = true
          }
        }
      } else {
        // much slower loop but can be optmized
        for (let key in tree.$any) {
          if (key !== '_p' && key !== '_key') {
            if (item(key, t, subs, cb, tree.$any, referenced, removed, previous)) {
              changed = true
            }
          }
        }
        for (let i = 0, len = keys.length; i < len; i++) {
          if (!(keys[i] in tree.$any) && item(keys[i], t, subs, cb, tree.$any, referenced, removed, previous)) {
            changed = true
          }
        }
      }
    }
  }

  return changed
}
