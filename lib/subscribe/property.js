'use strict'
const { diff } = require('./diff')
const { remove, removeReference } = require('./remove')

const composite = () => {
  // changed = composite(travelt, subs, update, treeKey, stamp, void 0, removed)
  // if (changed) {
  //   simpleUpdate(t, subs, update, treeKey, stamp)
  // }
}

const isStruct = t => t.val && typeof t.val === 'object' && t.val.inherits

const reference = (t, subs, cb, tree, referenced, removed) => {
  var changed
  var treeProperty = tree.val
  if (t && (t.val === void 0 || t.val !== null) && !removed) {
    const stamp = t.tStamp || t.stamp || 0
    if (!treeProperty) {
      treeProperty = tree.val = { _p: tree, _key: 'val', $t: t }
      treeProperty.$ = stamp
      diff(t, subs, cb, treeProperty, referenced)
      if (isStruct(t)) { reference(t.val, subs, cb, treeProperty, t) }
      changed = true
    } else {
      if (treeProperty.$ !== stamp) {
        treeProperty.$ = stamp
        diff(t, subs, cb, treeProperty, referenced)
        if (isStruct(t)) {
          if (treeProperty.val && treeProperty.val.$t !== t.val) {
            removeReference(subs, cb, treeProperty.val, t.val)
          }
          reference(t.val, subs, cb, treeProperty, t)
        } else {
          // if (treeProperty.val) {
          //   // console.log('has treeProperty.val BUT -- wil do this later')
          // }
        }
        changed = true
      } else if (treeProperty.$c) {
        composite()
      }
    }
  } else if (treeProperty) {
    console.log('  switch REFERENCE remove', removed)
    // prop want this as well - removeReference
    remove(subs, cb, treeProperty)
    changed = true
  }
  return changed
}

const property = (key, t, subs, cb, tree, removed) => {
  var changed
  var treeProperty = tree[key]
  if (t && (t.val === void 0 || t.val !== null) && !removed) {
    const stamp = t.tStamp || t.stamp || 0
    if (!treeProperty) {
      treeProperty = tree[key] = { _p: tree, _key: key, $t: t }
      treeProperty.$ = stamp
      if (subs.val) { cb(t, 'new', subs, treeProperty) }
      diff(t, subs, cb, treeProperty)
      if (isStruct(t)) { reference(t.val, subs, cb, treeProperty, t) }
      changed = true
    } else {
      if (treeProperty.$ !== stamp) {
        treeProperty.$ = stamp
        if (subs.val === true) { cb(t, 'update', subs, treeProperty) }
        diff(t, subs, cb, treeProperty)
        if (isStruct(t)) {
          if (treeProperty.val && treeProperty.val.$t !== t.val) {
            removeReference(subs, cb, treeProperty.val, t.val)
          }
          reference(t.val, subs, cb, treeProperty, t)
        } else {
          // if (treeProperty.val) {
          //   // console.log('has treeProperty.val BUT -- wil do this later')
          // }
        }
        changed = true
      } else if (treeProperty.$c !== void 0) {
        composite()
      }
    }
  } else if (treeProperty) {
    console.log('  switch data remove', key, removed)
    remove(subs, cb, treeProperty)
    changed = true
  }
  return changed
}

module.exports = property
