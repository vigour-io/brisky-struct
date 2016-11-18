'use strict'
const { item } = require('./diff')
const { getKeys } = require('../keys')

// const item = function item (key, t, subs, cb, tree, referenced, removed, compare) {
// key, t, subs, cb, tree, referenced, removed, compare
module.exports = function any (t, subs, cb, tree, referenced, removed, previous) {
  var changed
  if (t && t.val !== null) {
    if (!tree.$any) {
      tree.$any = { _p: tree, _key: '$any' }
    }
    const keys = getKeys(t)
    if (keys) {
      for (let i = 0, len = keys.length; i < len; i++) {
        if (item(keys[i], t, subs, cb, tree, referenced, removed, previous)) {
          changed = true
        }
      }
    }
  } else {
    // handle remove!
  }
  return changed
}
