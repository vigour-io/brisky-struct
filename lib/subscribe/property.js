'use strict'
const { update, create } = require('./update')
// const simpleUpdate = val.simpleUpdate
// const remove = require('./remove')
// const composite = require('./composite')

module.exports = (key, t, subs, cb, tree, property) => {
  var changed
  if (t && (!('val' in t) || t.val !== null)) {
    const stamp = t.tStamp || t.stamp
    if (!property) {
      property = tree[key] = { _p: tree, _key: key }
      property.$ = stamp
      create(t, subs, cb, property)
      changed = true
    } else {
      if (property.$ !== stamp) {
        property.$ = stamp
        update(t, subs, cb, property)
        changed = true
      } else if ('$c' in property) {
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
