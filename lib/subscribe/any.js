'use strict'
const { item } = require('./diff')
const { getKeys } = require('../keys')
// const remove = require('./remove')

// need to handle ref change here as well do it smart

module.exports = function any (t, subs, cb, tree, force) {
  var changed
  if (t && t.val !== null) {
    if (!tree.$any) {
      // may need to replace old one if something nasty changed
      // think of a perfect strategy for this
      tree.$any = { _p: tree, _key: '$any' }
    }
    const keys = getKeys(t)
    if (keys) {
      for (let i = 0, len = keys.length; i < len; i++) {
        // dont use from for now
        if (item(keys[i], t, subs, cb, tree.$any, force)) {
          changed = true
        }
      }
    }
  } else {
    // handle remove!
  }
  return changed
}
