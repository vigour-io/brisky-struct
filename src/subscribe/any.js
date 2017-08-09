import { update as updateProperty } from './property'
import remove from './property/remove'
import { getKeys } from '../keys'
import { getOrigin } from '../get'
import { diff } from './diff'
import { getRefVal } from '../references'

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

const parseKeys = t => {
  var keys = getKeys(t)
  var orig = t
  t = getRefVal(t) // edge case
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

// const diff = (t, subs, cb, tree, removed, composite, oRoot) => {

const composite = (key, t, subs, cb, branch, removed, c, oRoot) => {
  var changed
  const keys = branch.$keys
  if (subs.$keys && subs.$keys.val) {
    const dKey = '$keys' + key
    if (c[dKey] && diff(t, subs.$keys, cb, branch[dKey], void 0, void 0, oRoot)) {
      any(key, t, subs, cb, branch._p, removed, oRoot)
    } else {
      for (let k in c) {
        const target = keys[k]
        if (
          k !== dKey &&
          updateProperty(k, target.$t, subs, cb, keys, target.$c, branch, oRoot)
        ) {
          changed = true
        }
      }
    }
  } else {
    for (let k in c) {
      const target = keys[k]
      if (target) {
        if (updateProperty(k, target.$t, subs, cb, keys, target.$c, branch, oRoot)) {
          changed = true
        }
      }
    }
  }
  return changed
}

const any = (key, t, subs, cb, tree, removed, oRoot) => {
  const branch = tree[key]
  var $object
  if (removed || !t) {
    if (branch) {
      removeFields(key, subs, branch, cb, oRoot)
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
          createObject(key, keys, t, subs, cb, tree, oRoot)
        } else {
          create(key, keys, t, subs, cb, tree, oRoot)
        }
        return true
      } else {
        // $object
        return $object
          ? updateObject(key, keys, t, subs, cb, branch, oRoot)
          : update(key, keys, t, subs, cb, branch, oRoot)
      }
    } else if (branch) {
      if ($object) {
        removeFieldsObject(key, subs, branch, cb, oRoot)
      } else {
        removeFields(key, subs, branch, cb, oRoot)
      }
      return true
    }
  }
}

// AS ARRAY
const create = (key, keys, t, subs, cb, tree, oRoot) => {
  const len = keys.length
  const $keys = new Array(len)
  const branch = tree[key] = { _p: tree, _key: key, $keys }
  for (let i = 0; i < len; i++) {
    let key = keys[i]
    let tt = getOrigin(t, key)
    updateProperty(i, tt, subs, cb, $keys, void 0, branch, oRoot)
  }
  if (subs.$keys && subs.$keys.val) {
    const dKey = '$keys' + key
    const dBranch = branch[dKey] = { _p: branch, _key: dKey }
    diff(t, subs.$keys, cb, dBranch, void 0, void 0, oRoot)
  }
}

const removeFields = (key, subs, branch, cb, oRoot) => {
  const $keys = branch.$keys
  let i = $keys.length
  while (i--) {
    remove(subs, cb, $keys[0], oRoot)
  }
}

const update = (key, keys, t, subs, cb, branch, oRoot) => {
  var changed
  const $keys = branch.$keys
  const len1 = keys.length
  var len2 = $keys.length
  if (len1 > len2) {
    for (let i = 0; i < len1; i++) {
      const key = keys[i]
      if (updateProperty(i, getOrigin(t, key), subs, cb, $keys, void 0, branch, oRoot)) {
        changed = true
      }
    }
  } else {
    for (let i = 0; i < len2; i++) {
      const key = keys[i]
      if (!key) {
        remove(subs, cb, $keys[i], oRoot)
        len2--
        i--
        changed = true
      } else {
        if (updateProperty(i, getOrigin(t, key), subs, cb, $keys, void 0, branch, oRoot)) {
          changed = true
        }
      }
    }
  }
  return changed
}
// ------AS OBJECT
const createObject = (key, keys, t, subs, cb, tree, oRoot) => {
  const len = keys.length
  const $keys = {}
  const branch = tree[key] = { _p: tree, _key: key, $keys }
  for (let i = 0; i < len; i++) {
    let key = keys[i]
    let tt = getOrigin(t, key)
    updateProperty(key, tt, subs, cb, $keys, void 0, branch, oRoot)
  }

  if (subs.$keys && subs.$keys.val) {
    const dKey = '$keys' + key
    const dBranch = branch[dKey] = { _p: branch, _key: dKey }
    diff(t, subs.$keys, cb, dBranch, void 0, void 0, oRoot)
  }
}

const removeFieldsObject = (key, subs, branch, cb, oRoot) => {
  const $keys = branch.$keys
  for (let key$ in $keys) {
    remove(subs, cb, $keys[key$], oRoot)
  }
}

const updateObject = (key$, keys, t, subs, cb, branch, oRoot) => {
  var changed
  const $keys = branch.$keys
  const len1 = keys.length
  const marked = {}
  for (let i = 0; i < len1; i++) {
    let key = keys[i]
    marked[key] = true
    let tt = getOrigin(t, key)
    if (updateProperty(key, tt, subs, cb, $keys, void 0, branch, oRoot)) {
      changed = true
    }
  }
  for (let key in $keys) {
    if (!(key in marked)) {
      remove(subs, cb, $keys[key], oRoot)
    }
  }
  return changed
}

// ---- for composite it is not a difference
export { any, composite }
