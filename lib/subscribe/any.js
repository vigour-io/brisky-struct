const { property, update: updateProperty } = require('./property')
const { getKeys } = require('../keys')
const { getOrigin } = require('../get')

const inherits = (key, t, index) => {
  var i = 0
  while (i < index && t && typeof t === 'object' && t.inherits) {
    i++
    if (key in t) {
      return false
    }
    t = t.val
  }
  return true
}

// reintroduce $m whenever it feels like its going to help
const parseKeys = (t) => {
  var keys = getKeys(t)
  var orig = t
  t = t.val
  if (t && typeof t === 'object' && t.inherits) {
    let combined
    let index = 1
    while (t && typeof t === 'object' && t.inherits) {
      let k = getKeys(t)
      let kl = k && k.length
      if (kl) {
        if (!combined) {
          if (keys) {
            combined = []
            for (let j = 0, len = keys.length; j < len; j++) {
              combined[j] = keys[j]
            }
            for (let i = 0; i < kl; i++) {
              if (inherits(k[i], orig, index)) {
                combined.push(k[i])
              }
            }
          } else {
            keys = k
          }
        } else {
          for (let i = 0; i < kl; i++) {
            if (inherits(k[i], orig, index)) {
              combined.push(k[i])
            }
          }
        }
      }
      index++
      t = t.val
    }
    return combined || keys
  }
  return keys
}

const any = (key, t, subs, cb, tree, removed) => {
  // updateProperty
  if (removed || !t) {
    if (tree[key]) {
      // removeFields(key, t, subs, cb, tree)
      return true
    }
  } else {
    let keys = parseKeys(t)
    if (subs.$keys) {
      keys = subs.$keys(keys, t)
    }

    if (keys) {
      const branch = tree[key]
      if (!branch) {
        create(key, keys, t, subs, cb, tree)
        return true
      } else {
        return update(key, keys, t, subs, cb, branch)
      }
    } else if (tree[key]) {
      // removeFields(key, t, subs, cb, tree)
      return true
    }
  }
}

const composite = (key, t, subs, cb, branch, removed, c) => {
  var changed
  var keys = parseKeys(t)
  if (subs.$keys) {
    keys = subs.$keys(keys, t)
  }
  for (let k in c) {
    let y = branch[k].$c
    let tt = getOrigin(t, keys[k])
    if (updateProperty(k, tt, subs, cb, branch.$keys, removed, y)) {
      changed = true
    }
  }
  return changed
}

const create = (key, keys, t, subs, cb, tree) => {
  const len = keys.length
  const $keys = new Array(len)
  const branch = tree[key] = { _p: tree, _key: key, $keys }
  for (let i = 0; i < len; i++) {
    let key = keys[i]
    let tt = getOrigin(t, key)
    updateProperty(i, tt, subs, cb, $keys)
    $keys[i]._p = branch
  }
}

// return update(key, keys, t, subs, cb, branch)
const update = (key, keys, t, subs, cb, branch) => {
  var changed
  const $keys = branch.$keys
  for (let i = 0, len = keys.length; i < len; i++) {
    let key = keys[i]
    let tt = getOrigin(t, key)
    if (updateProperty(i, tt, subs, cb, $keys)) {
      changed = true
    }
  }
  return changed
}

// const removeFields = (key, t, subs, cb, tree) => {
//   const branch = tree[key]
//   const $keys = branch.$keys
//   const len = $keys.length
//   for (let i = 0; i < len; i++) {
//     property($keys[i], t, subs, cb, branch, true)
//   }
//   delete tree[key]
// }

// const create = (key, keys, t, subs, cb, tree) => {
//   const len = keys.length
//   const $keys = new Array(len)
//   const branch = tree[key] = { _p: tree, _key: '$any', $keys }
//   for (let i = 0; i < len; i++) {
//     let key = keys[i]
//     $keys[i] = key
//     property(key, t, subs, cb, branch)
//   }
// }

// const modify = (hot, $keys, t, subs, cb, branch) => {
//   for (let i = 0, len = hot.length; i < len - 2; i += 3) {
//     let create = hot[i]
//     let remove = hot[i + 1]
//     if (remove) {
//       property(remove, t, subs, cb, branch, true)
//       $keys.pop() // measure speed of pop make this faster
//     }
//     if (create) {
//       let index = hot[i + 2]
//       property(create, t, subs, cb, branch)
//       $keys[index] = create
//     }
//   }
// }

// const update = (key, keys, t, subs, cb, branch) => {
//   var hot, changed
//   const $keys = branch.$keys
//   const len1 = $keys.length
//   const len2 = keys.length
//   var checks = len1

//   const len = len1 > len2 ? len1 : len2
//   for (let i = 0; i < len; i++) {
//     let key = keys[i]
//     let compare = $keys[i]
//     if (key === compare) {
//       checks--
//       changed = property(key, t, subs, cb, branch)
//     } else {
//       if (!hot) {
//         hot = [ key, compare, i ]
//       } else {
//         if (checks) {
//           let j = hot.length
//           let block
//           while (!block && (j -= 3) > -1) {
//             if (key !== void 0 && hot[j + 1] === key) {
//               $keys[i] = key
//               changed = property(key, t, subs, cb, branch)
//               if (compare === hot[j]) {
//                 if (compare && $keys[hot[j + 2]] !== compare) {
//                   $keys[hot[j + 2]] = compare
//                 }
//                 hot.splice(j, 3)
//                 checks--
//                 block = true
//               } else {
//                 hot[j + 1] = key = void 0
//                 if (hot[j] === void 0) {
//                   hot.splice(j, 3) // splice is slow
//                   checks--
//                 }
//                 if (compare === void 0) { block = true }
//               }
//             } else if (compare !== void 0 && compare === hot[j]) {
//               let index = hot[j + 2]
//               $keys[index] = compare
//               changed = property(compare, t, subs, cb, branch)
//               if (key === hot[j + 1]) {
//                 hot.splice(j, 3)
//                 checks--
//                 block = true
//               } else {
//                 hot[j] = compare = void 0
//                 if (hot[j + 1] === void 0) {
//                   hot.splice(j, 3)
//                   checks--
//                 }
//                 if (key === void 0) { block = true }
//               }
//             }
//           }
//           if (!block) {
//             hot.push(key, compare, i)
//           } else {
//             checks--
//           }
//         } else {
//           hot.push(key, void 0, i)
//         }
//       }
//     }
//   }
//   if (hot) {
//     modify(hot, $keys, t, subs, cb, branch)
//     changed = true
//   }
//   return changed
// }

exports.any = any
exports.composite = composite
