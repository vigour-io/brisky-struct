'use strict'
const { item } = require('./diff')
const { getKeys } = require('../keys')
const { get } = require('../get')

// const property = require('./property')
// const remove = require('./remove')

module.exports = (t, subs, cb, tree, referenced, removed, previous) => {
  // null check should never happen anymore...
  if (removed || !t) {
    if (tree.$any) {
      remove()
      // pass removed true here (it is removed)
      return true
    }
  } else {
    const keys = getKeys(t)
    if (keys) {
      if (!tree.$any) {
        create(keys, t, subs, cb, tree, referenced, previous)
        return true
      } else {
        return update(keys, t, subs, cb, tree, referenced, previous)
      }
    }
  }
}

const remove = () => {
  console.log('remove')
}

const create = (keys, t, subs, cb, tree, referenced, previous) => {
  const len = keys.length
  const $keys = new Array(len)
  const $m = new Array(len)
  const branch = tree.$any = { _p: tree, _key: '$any', $keys, $m }
  for (let i = 0; i < len; i++) {
    let key = keys[i]
    $keys[i] = key
    item(key, t, subs, cb, branch, referenced, void 0, previous)
    $m[i] = branch[key]
  }
}

const update = (keys, t, subs, cb, tree, referenced, previous) => {
  // var changed, inserts, removals
  // const branch = tree.$any
  // const $keys = branch.$keys
  // const $m = branch.$m
  // const len1 = $keys.length
  // const len2 = keys.lengthw
  // if (len1 > len2) {
  //   console.log('$keys is larger')
  // } else {
  //   console.log('keys is larger')
  // }
  // return changed
}

// for (let i = 0; i < l; i++) {
//   let key = keys[i]
//   if (key === $keys[i]) {
//     let k = t && get(t, key)
//     if ($m[i].$ !== (k.tStamp || k.stamp || 0)) {
//       if (item(key, t, subs, cb, $any, referenced, removed, previous)) {
//         // $m[i] = $any[key].$
//         changed = true
//       }
//     }
//   } else {
//     // need to take care of inserts and removals
//     // removals, inserts
//     if (i > len1) {
//       $keys[++len1] = key
//       item(key, t, subs, cb, $any, referenced, removed, previous)
//       $m[len1] = $any[key]
//       changed = true
//     } else {
//     //   console.log('!', i)
//     //   // need to map all cases
//     //   // insert, remove
//     }
//   }
// }
