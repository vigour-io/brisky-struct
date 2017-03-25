import { create, set } from '../manipulate'
import { getDefault, get } from '../get'
import { removeKey, getKeys } from '../keys'
import getType from '../struct/types/get'

// ---------------------------
// this is all from type can be changed
const createSetObj = (t, top) => {
  const result = {}
  const keys = t._ks
  if (t.type && !top) result.type = t.type.compute()
  if (keys) {
    for (let i = 0, len = keys.length; i < len; i++) {
      let key = keys[i]
      let field = t[key]
      if (field) result[key] = createSetObj(field, false)
    }
  }
  if (t.val !== void 0) result.val = t.val
  return result
}

const extractListeners = (t, instance) => {
  var result
  const keys = t._ks
  if (keys) {
    if (keys) {
      for (let i = 0, len = keys.length; i < len; i++) {
        let key = keys[i]
        if (instance[key]) {
          let field = t[key]
          let r = extractListeners(field, instance[key])
          if (r) {
            if (!result) result = {}
            result[key] = r
          }
        }
      }
    }
  }
  const d = t.emitters && t.emitters.data
  if (d) {
    if (!result) result = {}
    result.on = { data: {} }
    const data = result.on.data
    for (let key in d) {
      if (
        key !== 'inherits' &&
        key !== '_p' &&
        key !== 'key' &&
        key !== 'fn' &&
        key !== 'struct' &&
        d[key]
      ) {
        data[key] = d[key]
        if (typeof d[key] === 'object') data[key].val = instance
      }
    }
  }

  return result
}

// handleInstances - check if it can go faster
const handleInstances = (t, a, stamp) => {
  const instances = t.instances
  t.instances = null
  const keys = t._ks
  if (keys) {
    for (let i = 0, len = keys.length; i < len; i++) {
      let key = keys[i]
      let tField = t[key]
      if (tField) {
        let aField = a[key]
        if (!aField) {
          set(tField, null, stamp)
          len--
          i--
        } else {
          handleInstances(tField, aField, stamp)
        }
      }
    }
  }
  if (instances) {
    a.instances = instances
    for (let i = 0, len = instances.length; i < len; i++) {
      let instance = instances[i]
      instance.inherits = a
      if ('_ks' in instance) {
        let newKeys = a.keys().concat()
        let keys = instance._ks || []
        instance._ks = newKeys
        for (let j = 0, len = newKeys.length; j < len; j++) {
          if (instance[newKeys[j]] === null && get(a, newKeys[j])) {
            removeKey(instance, newKeys[i])
          }
        }
        for (let j = 0, len = keys.length; j < len; j++) {
          if (instance[keys[j]]) newKeys.push(keys[j])
        }
        handleInstances(instance, instance, stamp)
      }
    }
  }
}

// move all type stuff to type itself -- first things first a super efficient overtaker
// mergeType -- > will become merge or something
const mergeType = (t, type, stamp, reset, original) => {
  const result = getType(t._p, type, t) || getDefault(t._p)

  const raw = ((t._ks || t.val !== void 0) && !reset)
    ? createSetObj(t, true) : void 0

  const instance = create(
    result,
    raw,
    stamp,
    t._p,
    t.key
  )

  const listeners = extractListeners(t, instance)

  if (listeners) set(instance, listeners, stamp)

  handleInstances(t, instance, stamp)
  t._$p = t._p
  t._p = null
  set(t, null)
  return instance
}
// ---------------------------

// this is it for now
const switchInheritance = (t, inherits, stamp) => {
  console.log(getKeys(inherits))
  if (t._ks && getKeys(inherits)) {
    // merge keys arrays
    t._ks = inherits._ks
  }
  // also need to remove shit if it inherits somehting else

  // think about remove
  if (t.val === void 0 && inherits.val !== void 0) {

  }

  t.inherits = inherits
}

export { createSetObj, mergeType, switchInheritance }
