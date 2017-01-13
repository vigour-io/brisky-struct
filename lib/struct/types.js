import { create, set } from '../manipulate'
import { getDefault, get } from '../get'
import { removeKey } from '../keys'
import { getProp } from '../property'

const types = (t, val, pkey, stamp) => {
  if (!t.types) { t.types = {} }
  for (let key in val) {
    let prop = val[key]
    if (t.types[key]) {
      t.types[key].set(prop, stamp)
    } else {
      if (typeof prop !== 'object' || !prop.inherits) {
        prop = prop === 'self' ? t : create(getDefault(t), prop, void 0, t)
      }
      t.types[key] = prop
    }
  }
}

const inheritType = t => t.type || t.inherits && inheritType(t.inherits)

const type = (t, val, key, stamp, isNew, original) => {
  if (typeof val === 'object') {
    console.log('setting type with another struct (reference) is not supported yet')
  } else if (!isNew) {
    let type = t.type || inheritType(t)
    type = type && type.compute()
    if (type !== 'struct') {
      if (type !== val) {
        t = merge(t, val, stamp, original.reset)
      } else {
        return
      }
    }
  }
  console.log('TYPE')
  const struct = getProp(t, key).struct
  t.type = t.type ? t.type.set(val, stamp) : create(struct, val, stamp, t, key)
  return 2
}

const createSetObj = (t, top, instance) => {
  const result = {}
  const keys = t._ks
  if (t.type && !top) result.type = t.type.compute()
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
  const result = getType(t._p, type, t)
  if (result) {
    if (t._ks || t.val !== void 0) {
      t.inherits = result
      const raw = !reset ? createSetObj(t, true) : void 0
      const instance = create(result, raw, void 0, t._p, t.key)
      handleInstances(t, instance, stamp)
      return instance
    } else {
      return create(result, void 0, void 0, t._p, t.key)
    }
  }
  return t
}

const createType = (parent, val, t, stamp, key) => {
  const type = val.type
  const constructor = getType(parent, type, t) || t
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

const getType = (parent, type, t) =>
  (!t || typeof type === 'string' || typeof type === 'number') &&
  (
    parent.types && parent.types[type] ||
    parent.inherits && getType(parent.inherits, type) ||
    parent._p && getType(parent._p, type)
  )

export { types, type, createType, getType }
