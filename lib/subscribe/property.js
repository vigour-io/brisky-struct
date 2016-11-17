'use strict'
const { diff } = require('./diff')

module.exports = (key, t, subs, cb, tree, property) => {
  var changed
  if (t && (t.val === void 0 || t.val !== null)) {
    const stamp = t.tStamp || t.stamp
    if (!property) {
      property = tree[key] = { _p: tree, _key: key }
      property.$ = stamp
      if (subs.val) { cb(t, 'new', subs, property) }
      diff(t, subs, cb, property)
      changed = true
    } else {
      if (property.$ !== stamp) {
        property.$ = stamp
        if (subs.val === true) { cb(t, 'update', subs, property) }
        diff(t, subs, cb, property)
        changed = true
      } else if (property.$c !== void 0) {
        // changed = composite(travelt, subs, update, treeKey, stamp, void 0, force)
        // if (changed) {
        //   simpleUpdate(t, subs, update, treeKey, stamp)
        // }
      }
    }
  } else if (property) {
    // remove(key, t, t, subs, update, tree, treeKey, stamp)
    changed = true
  }

  return changed
}
