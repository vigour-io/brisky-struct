import { update as updateProperty } from './property'
import remove from './property/remove'
import { getKeys } from '../keys'
import { getOrigin } from '../get'
import { diff } from './diff'

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
      if (subs.$keys.val) {
        keys = subs.$keys.val(keys, t)
      } else {
        keys = subs.$keys(keys, t)
      }
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

const create = (key, keys, t, subs, cb, tree) => {
  const len = keys.length
  const $keys = new Array(len)
  const branch = tree[key] = { _p: tree, _key: key, $keys }
  for (let i = 0; i < len; i++) {
    let key = keys[i]
    let tt = getOrigin(t, key)
    updateProperty(i, tt, subs, cb, $keys, void 0, branch)
    if (tt._c) {
      tt._cLevel = null
      tt._c = null
    }
  }

  if (subs.$keys && subs.$keys.val) {
    const dKey = '$keys' + key
    const dBranch = branch[dKey] = { _p: branch, _key: dKey }
    diff(t, subs.$keys, cb, dBranch)
  }
}

const removeFields = (key, subs, branch, cb, tre) => {
  const $keys = branch.$keys
  let i = $keys.length
  while (i--) {
    remove(subs, cb, $keys[0])
  }
}

const composite = (key, t, subs, cb, branch, removed, c) => {
  var changed
  const keys = branch.$keys
  if (subs.$keys && subs.$keys.val) {
    const dKey = '$keys' + key
    if (c[dKey] && diff(t, subs.$keys, cb, branch[dKey])) {
      any(key, t, subs, cb, branch._p, removed)
    } else {
      for (let k in c) {
        let target = keys[k]
        if (
          k !== dKey &&
          updateProperty(k, target.$t, subs, cb, keys, target.$c, branch)
        ) {
          changed = true
        }
      }
    }
  } else {
    for (let k in c) {
      let target = keys[k]
      if (updateProperty(k, target.$t, subs, cb, keys, target.$c, branch)) {
        changed = true
      }
    }
  }
  return changed
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
      if (tt._c) {
        tt._cLevel = null
        tt._c = null
      }
    }
  } else {
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
        if (tt._c) {
          tt._cLevel = null
          tt._c = null
        }
      }
    }
  }
  return changed
}

export { any, composite }
