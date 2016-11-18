'use strict'
const { item } = require('./diff')
const { getKeys } = require('../keys')
const { get } = require('../get')

const property = require('./property')
const remove = require('./remove')

// do perf checks can just create an array
// module.exports = function any (t, subs, cb, tree, referenced, removed, previous) {
//   var changed
//   if (removed) {
//     if (tree.$any) {
//       for (let key in tree.$any) {
//         if (key !== '_p' && key !== '_key') {
//           // only call item when removed // referenced
//           if (item(key, t, subs, cb, tree.$any, referenced, removed, previous)) {
//             changed = true
//           }
//         }
//       }
//     }
//   } else {
//     const keys = getKeys(t)
//     if (keys) {
//       if (!tree.$any) {
//         tree.$any = { _p: tree, _key: '$any' }
//         for (let i = 0, len = keys.length; i < len; i++) {
//           if (item(keys[i], t, subs, cb, tree.$any, referenced, removed, previous)) {
//             changed = true
//           }
//         }
//       } else {
//         for (let key in tree.$any) {
//           if (key !== '_p' && key !== '_key') {
//             if (item(key, t, subs, cb, tree.$any, referenced, removed, previous)) {
//               changed = true
//             }
//           }
//         }
//         for (let i = 0, len = keys.length; i < len; i++) {
//           if (!(keys[i] in tree.$any) && item(keys[i], t, subs, cb, tree.$any, referenced, removed, previous)) {
//             changed = true
//           }
//         }
//       }
//     }
//   }
//   return changed
// }

module.exports = function any (t, subs, cb, tree, referenced, removed, previous) {
  var changed
  const keys = getKeys(t)
  if (keys) {
    // if removed
    // if t.val === null || !t

    if (!tree.$any) {
      tree.$any = { _p: tree, _key: '$any', $keys: [], $m: [] }
    }

    const $any = tree.$any
    const $keys = $any.$keys
    const $m = $any.$m
    let len1 = $keys.length
    let len2 = keys.length
    let l = len1 > len2 ? len1 : len2
    len1 = len1 - 1

    // different strategy when $keys is larger
    // use an extra array for candidates
    // write it out

    for (let i = 0; i < l; i++) {
      let key = keys[i]
      if (key === $keys[i]) {
        let k = t && get(t, key)
        if ($m[i].$ !== (k.tStamp || k.stamp || 0)) {
          if (item(key, t, subs, cb, $any, referenced, removed, previous)) {
            changed = true
          }
        }
      } else {
        if (i > len1) {
          $keys[++len1] = key
          item(key, t, subs, cb, $any, referenced, removed, previous)
          $m[len1] = $any[key]
          changed = true
        } else {
          console.log('!', i)
          // need to map all cases
          // insert, remove
        }
      }
    }
  }
  return changed
}

// in is slower...
