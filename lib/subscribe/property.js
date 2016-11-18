'use strict'
const { diff } = require('./diff')
const { remove, removeReference } = require('./remove')

const property = (key, t, subs, cb, tree, referenced, removed) => {
  var changed
  var treeProperty = tree[key]
  if (t && (t.val === void 0 || t.val !== null) && !removed) {
    const stamp = t.tStamp || t.stamp || 0
    if (!treeProperty) {
      treeProperty = tree[key] = { _p: tree, _key: key, $t: t }
      treeProperty.$ = stamp
      if (subs.val && key !== 'val') { cb(t, 'new', subs, treeProperty) }
      diff(t, subs, cb, treeProperty, referenced)
      if (t.val && typeof t.val === 'object' && t.val.inherits) {
        property('val', t.val, subs, cb, treeProperty, t)
      }
      changed = true
    } else {
      if (treeProperty.$ !== stamp) {
        treeProperty.$ = stamp
        if (subs.val === true && key !== 'val') {
          cb(t, 'update', subs, treeProperty)
        }
        diff(t, subs, cb, treeProperty, referenced)
        if (t.val && typeof t.val === 'object' && t.val.inherits) {
          if (treeProperty.val && treeProperty.val.$t !== t.val) {
            removeReference(subs, cb, treeProperty.val, t.val)
          }
          property('val', t.val, subs, cb, treeProperty, t)
        } else {
          // if (treeProperty.val) {
          //   // console.log('has treeProperty.val BUT -- wil do this later')
          // }
        }
        changed = true
      } else if (treeProperty.$c !== void 0) {
        // changed = composite(travelt, subs, update, treeKey, stamp, void 0, removed)
        // if (changed) {
        //   simpleUpdate(t, subs, update, treeKey, stamp)
        // }
      }
    }
  } else if (treeProperty) {
    console.log('  switch data remove', key, removed, referenced)
    remove(subs, cb, treeProperty, referenced)
    changed = true
  }

  return changed
}

module.exports = property
