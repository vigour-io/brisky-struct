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

// const removeFields = (key, t, subs, cb, tree) => {
//   const branch = tree[key]
//   const $keys = branch.$keys
//   const len = $keys.length
//   for (let i = 0; i < len; i++) {
//     property($keys[i], t, subs, cb, branch, true)
//   }
//   delete tree[key]
// }

// return update(key, keys, t, subs, cb, branch)
const update = (key, keys, t, subs, cb, branch) => {
  var changed
  const $keys = branch.$keys
  const len1 = keys.length
  const len2 = $keys.length
  for (let i = 0, len = len1 > len2 ? len1 : len2; i < len; i++) {
    let key = keys[i]
    if (!key) {
      if (updateProperty(i, void 0, subs, cb, $keys)) {
        changed = true
      }
    } else {
      let tt = getOrigin(t, key)
      if (updateProperty(i, tt, subs, cb, $keys)) {
        changed = true
      }
    }
  }
  return changed
}

exports.any = any
exports.composite = composite
