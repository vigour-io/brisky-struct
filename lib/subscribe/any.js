'use strict'
const { item } = require('./diff')
const { getKeys } = require('../keys')
const { get } = require('../get')

// const property = require('./property')
// const remove = require('./remove')

module.exports = function any (t, subs, cb, tree, referenced, removed, previous) {
  const keys = getKeys(t)
  if (keys) {
    let changed, inserts, removals

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
    if (removed || !t || t.val === null) {
      console.log('remove')
    } else {

      for (let i = 0; i < l; i++) {
        let key = keys[i]
        if (key === $keys[i]) {
          let k = t && get(t, key)
          if ($m[i].$ !== (k.tStamp || k.stamp || 0)) {
            if (item(key, t, subs, cb, $any, referenced, removed, previous)) {
              // $m[i] = $any[key].$
              changed = true
            }
          }
        } else {
          // need to take care of inserts and removals

          // removals, inserts

          if (i > len1) {
            $keys[++len1] = key
            item(key, t, subs, cb, $any, referenced, removed, previous)
            $m[len1] = $any[key]
            changed = true
          } else {
          //   console.log('!', i)
          //   // need to map all cases
          //   // insert, remove
          }
        }
      }

    }

    return changed
  }
}

// in is slower...
// module.exports = function any (t, subs, cb, tree, referenced, removed, previous) {
//   var changed
//   const keys = getKeys(t)
//   if (keys) {
//     // if removed
//     // if t.val === null || !t
//     if (!tree.$any) {
//       tree.$any = { _p: tree, _key: '$any', $keys: [], $m: [] }
//     }
//     for (let i = 0, len = keys.length; i < len; i++) {
//       if (item(keys[i], t, subs, cb, tree.$any, referenced, removed, previous)) {
//         changed = true
//       }
//     }
//   }
//   return changed
// }
