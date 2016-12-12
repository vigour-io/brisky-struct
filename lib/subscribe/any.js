const { update: updateProperty } = require('./property')
const remove = require('./property/remove')
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
  const branch = tree[key]
  if (removed || !t) {
    if (branch) {
      removeFields(key, subs, branch, cb, tree)
      return true
    }
  } else {
    let keys = parseKeys(t)
    if (subs.$keys) {
      keys = subs.$keys(keys, t)
    }

    if (keys) {
      if (!branch) {
        create(key, keys, t, subs, cb, tree)
        return true
      } else {
        return update(key, keys, t, subs, cb, branch)
      }
    } else if (branch) {
      removeFields(key, subs, branch, cb, tree)
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
    let y = branch.$keys[k].$c
    let tt = keys && getOrigin(t, keys[k])
    if (updateProperty(k, tt, subs, cb, branch.$keys, removed, y, branch)) {
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
    updateProperty(i, tt, subs, cb, $keys, void 0, branch)
  }
}

const removeFields = (key, subs, branch, cb, tre) => {
  const $keys = branch.$keys
  let i = $keys.length
  while (i--) {
    remove(subs, cb, $keys[0])
  }
}

const update = (key, keys, t, subs, cb, branch) => {
  var changed
  const $keys = branch.$keys
  const len1 = keys.length
  var len2 = $keys.length
  if (len1 > len2) {
    for (let i = 0; i < len1; i++) {
      let key = keys[i]
      let tt = getOrigin(t, key)
      if (updateProperty(i, tt, subs, cb, $keys, void 0, branch)) {
        changed = true
      }
    }
  } else { // some keys are removed
    for (let i = 0; i < len2; i++) {
      let key = keys[i]
      if (!key) {
        remove(subs, cb, $keys[i])
        len2--
        i--
        changed = true
      } else {
        let tt = getOrigin(t, key)
        if (updateProperty(i, tt, subs, cb, $keys, void 0, branch)) {
          changed = true
        }
      }
    }
  }
  return changed
}

exports.any = any
exports.composite = composite
