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

// module.exports = function any (t, subs, cb, tree, referenced, removed, previous) {
//   var changed
//   const keys = getKeys(t)
//   if (keys) {
//     if (!tree.$any) {
//       tree.$any = { _p: tree, _key: '$any' }
//     }
//     for (let i = 0, len = keys.length; i < len; i++) {
//       let key = keys[i]
//       if (property(key, t && get(t, key), subs, cb, tree.$any)) {
//         changed = true
//       }
//     }
//   }
//   return changed
// }

module.exports = function any (t, subs, cb, tree, referenced, removed, previous) {
  var changed
  const keys = getKeys(t)
  if (keys) {
    // console.log('go $any')
    if (!tree.$any) {
      tree.$any = { _p: tree, _key: '$any', $keys: [], $m: [] }
    }

    const $any = tree.$any
    const $keys = $any.$keys
    const $m = $any.$m
    let len1 = $keys.length
    let len2 = keys.length
    let i = len1 > len2 ? len1 : len2
    len1 = len1 - 1

    while (i--) {
      let key = keys[i]
      if (key === $keys[i]) {
        let k = t && get(t, key)
        if ($m[i].$ !== (k.tStamp || k.stamp || 0)) {
          if (item(key, t, subs, cb, $any, referenced, removed, previous)) {
            changed = true
          }
        }
      } else {
        // console.log('diff', key, '@', i)
        // console.log('push', $keys)
        // removal will be handled when contining to loop trough the while loop

        if (i > len1) {
          $keys[len1 + 1] = key
          item(key, t, subs, cb, $any, referenced, removed, previous)
          $m[len1 + 1] = $any[key]
          changed = true
        }
      }
    }

    // for (let i = 0, len = keys.length; i < len; i++) {
    //   // let key = keys[i]
    //   // let x = tree.$any[key]
    //   // if (x) {
    //   //   let k = t && get(t, key)
    //   //   if (x.$ !== (k.tStamp || k.stamp || 0)) {
    //   //     if (item(key, t, subs, cb, tree.$any, referenced, removed, previous)) {
    //   //       changed = true
    //   //     }
    //   //   }
    //   } else if (item(key, t, subs, cb, tree.$any, referenced, removed, previous)) {
    //     tree.$any.$keys.push(key)
    //     changed = true
    //   }
    // }
  }
  return changed
}

// in is slower...
