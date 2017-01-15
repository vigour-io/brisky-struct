import { create, set } from '../manipulate'
import { getDefault, get } from '../get'
import { removeKey, addKey } from '../keys'
import { getProp } from '../property'
import { root } from '../traversal'

const types = (t, val, key, stamp) => {
  if (!t.types) t.types = create(getProp(t, key).struct, void 0, stamp, t, key)
  for (let field in val) {
    let prop = val[field]
    if (t.types[field]) {
      t.types[field].set(prop, stamp)
    } else {
      if (typeof prop !== 'object' || !prop.inherits) {
        // self is not suitable for struct cant change parent/key
        prop = prop === 'self' ? t : create(
          get(t.types, field) || getDefault(t), prop, stamp, t.types, field
        )
      }
      t.types[field] = prop
      addKey(t.types, field)
    }
  }
}

const inheritType = t => t.type || t.inherits && inheritType(t.inherits)

const extractListeners = (t, result) => {
  if (t.emitters && t.emitters.data) {
    if (!result) result = {}
    result.on = { data: {} }
    const data = result.on.data
    for (var key in t.emitters.data) {
      if (
        key !== 'inherits' &&
        key !== '_p' &&
        key !== 'key' &&
        key !== 'fn' &&
        key !== 'struct' &&
        t.emitters.data[key]
      ) {
        data[key] = t.emitters.data[key]
      }
    }
    return result
  }
}

const type = (t, val, key, stamp, isNew, original) => {
  if (typeof val === 'object') {
    if (val.stamp && val.val) {
      stamp = val.stamp
      val = val.val
    } else {
      console.log('setting type with another struct (reference) is not supported yet', val)
      return
    }
  }

  if (!isNew) {
    let type = t.type || inheritType(t)
    type = type && type.compute()
    if (type !== val) {
      t = merge(t, val, stamp, original.reset)
    }
  }

  t.type = t.type
    ? t.type.set(val, stamp)
    : create(getProp(t, key).struct, val, stamp, t, key)

  return 2
}

const createSetObj = (t, top, instance) => {
  const result = {}
  const keys = t._ks
  if (t.type && !top) result.type = t.type.compute()
  extractListeners(t, result)
  if (keys) {
    for (let i = 0, len = keys.length; i < len; i++) {
      let key = keys[i]
      let field = t[key]
      if (field && (!instance || !instance.get(key))) {
        result[key] = createSetObj(field, false, instance && instance.get(key))
      }
    }
  }
  if (t.val !== void 0) result.val = t.val
  return result
}

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
          tField.set(null, stamp)
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

const merge = (t, type, stamp, reset) => {
  const result = getType(t._p, type, t) || getDefault(t._p)
  var instance
  if (t._ks || t.val !== void 0) {
    t.inherits = result
    const raw = !reset ? createSetObj(t, true) : void 0
    instance = create(result, raw, stamp, t._p, t.key)
    handleInstances(t, instance, stamp)
  } else {
    instance = create(result, extractListeners(t), stamp, t._p, t.key)
  }
  t._$p = t._p
  t._p = null
  set(t, null)
  return instance
}

const createType = (parent, val, t, stamp, key) => {
  const type = val.type
  const constructor = getType(parent, type, t, stamp) || t
  const instance = new constructor.Constructor()
  instance.inherits = constructor
  if (constructor.instances !== false) {
    if (!constructor.instances) {
      constructor.instances = [ instance ]
    } else {
      constructor.instances.push(instance)
    }
  }
  if (key && t.key === key && !val.reset && (t._ks || t.val !== void 0)) {
    set(instance, createSetObj(t, true, instance), stamp)
  }
  return instance
}

const getType = (parent, type, t, stamp) => {
  if (typeof type === 'object') type = type.val
  var result = getTypeInternal(parent, type, t)
  if (!result) {
    parent = root(parent) // replace with fast traversal
    parent.set({ types: { [type]: {} } }, stamp)
    result = parent.types[type]
  }
  return result
}

const getTypeInternal = (parent, type, t) =>
  (!t || typeof type === 'string' || typeof type === 'number') &&
  (
    parent.types && get(parent.types, type) ||
    parent.inherits && getTypeInternal(parent.inherits, type) ||
    parent._p && getTypeInternal(parent._p, type)
  )

export { types, type, createType, getType }
