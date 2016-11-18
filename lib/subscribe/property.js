'use strict'
const { diff } = require('./diff')
const remove = require('./remove')

const property = (key, t, subs, cb, tree, force, referenced) => {
  var changed
  var treeProperty = tree[key]
  if (t && (t.val === void 0 || t.val !== null)) {
    const stamp = t.tStamp || t.stamp || 0
    if (!treeProperty) {
      treeProperty = tree[key] = { _p: tree, _key: key, $t: t }
      treeProperty.$ = stamp
      if (subs.val) { cb(t, 'new', subs, treeProperty) }
      diff(t, subs, cb, treeProperty, force, referenced)
      if (t.val && typeof t.val === 'object' && t.val.inherits) {
        property('val', t.val, subs, cb, treeProperty, force, t)
      }
      changed = true
    } else {
      if (treeProperty.$ !== stamp || force) {
        treeProperty.$ = stamp
        if (subs.val === true) { cb(t, 'update', subs, treeProperty) }
        diff(t, subs, cb, treeProperty, force, referenced)
        if (t.val && typeof t.val === 'object' && t.val.inherits) {
          if (treeProperty.val) {
            delete treeProperty.val.$
            console.log('force down the tree here - also need to fire removes probably...')
            force = true
          }
          property('val', t.val, subs, cb, treeProperty, force, t)
        }
        changed = true
      } else if (treeProperty.$c !== void 0) {
        // changed = composite(travelt, subs, update, treeKey, stamp, void 0, force)
        // if (changed) {
        //   simpleUpdate(t, subs, update, treeKey, stamp)
        // }
      }
    }
  } else if (treeProperty) {
    remove(key, treeProperty.$t, subs, cb, treeProperty, force)
    changed = true
  }

  return changed
}

module.exports = property
