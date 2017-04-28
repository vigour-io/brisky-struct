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
      if (target) {
        if (updateProperty(k, target.$t, subs, cb, keys, target.$c, branch)) {
          changed = true
        }
      }
    }
  }
  return changed
}

const any = (key, t, subs, cb, tree, removed) => {
  const branch = tree[key]
  var $object
  if (removed || !t) {
    if (branch) {
      removeFields(key, subs, branch, cb, tree)
      return true
    }
  } else {
    let keys = parseKeys(t)
    if (subs.$keys) {
      if (subs.$keys.val) {
        $object = subs.$keys.$object
        keys = subs.$keys.val(keys || [], t, subs, tree)
      } else {
        keys = subs.$keys(keys || [], t, subs, tree)
      }
    }
    if (keys) {
      if (!branch) {
        if ($object) {
          createObject(key, keys, t, subs, cb, tree)
        } else {
          create(key, keys, t, subs, cb, tree)
        }
        return true
      } else {
        // $object
        return $object
          ? updateObject(key, keys, t, subs, cb, branch)
          : update(key, keys, t, subs, cb, branch)
      }
    } else if (branch) {
      if ($object) {
        removeFieldsObject(key, subs, branch, cb, tree)
      } else {
        removeFields(key, subs, branch, cb, tree)
      }
      return true
    }
  }
}

// AS ARRAY
const create = (key, keys, t, subs, cb, tree) => {
  const len = keys.length
  const $keys = new Array(len)
  const branch = tree[key] = { _p: tree, _key: key, $keys }
  for (let i = 0; i < len; i++) {
    let key = keys[i]
    let tt = getOrigin(t, key)
    updateProperty(i, tt, subs, cb, $keys, void 0, branch)
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
      }
    }
  }
  return changed
}
// ------AS OBJECT
const createObject = (key, keys, t, subs, cb, tree) => {
  const len = keys.length
  const $keys = {}
  const branch = tree[key] = { _p: tree, _key: key, $keys }
  for (let i = 0; i < len; i++) {
    let key = keys[i]
    let tt = getOrigin(t, key)
    updateProperty(key, tt, subs, cb, $keys, void 0, branch)
  }

  if (subs.$keys && subs.$keys.val) {
    const dKey = '$keys' + key
    const dBranch = branch[dKey] = { _p: branch, _key: dKey }
    diff(t, subs.$keys, cb, dBranch)
  }
}

const removeFieldsObject = (key, subs, branch, cb, tre) => {
  const $keys = branch.$keys
  for (let key$ in $keys) {
    remove(subs, cb, $keys[key$])
  }
}

const updateObject = (key$, keys, t, subs, cb, branch) => {
  var changed
  const $keys = branch.$keys
  const len1 = keys.length
  const marked = {}
  for (let i = 0; i < len1; i++) {
    let key = keys[i]
    marked[key] = true
    let tt = getOrigin(t, key)
    if (updateProperty(key, tt, subs, cb, $keys, void 0, branch)) {
      changed = true
    }
  }
  for (let key in $keys) {
    if (!(key in marked)) {
      remove(subs, cb, $keys[key])
    }
  }
  return changed
}

// ---- for composite it is not a difference
export { any, composite }
