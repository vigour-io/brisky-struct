import { create } from '../manipulate'
import { getDefault, get } from '../get'
import { removeKey } from '../keys'

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

const type = (t, val, key, stamp) => {
  if (typeof val === 'object') {
    console.log('setting type with another struct (reference) is not supported yet')
  } else {
    const type = t.type || inheritType(t)
    if (type) {
      if (type.compute() === val) {
        return
      } else {
        t = merge(t, val, stamp)
      }
    }
    const struct = getType(t, 'struct')
    t.type = create(struct, val, stamp)
  }
}

const createSetObj = (t, top) => {
  const result = {}
  const keys = t._ks
  // need to remove t._ks when its inherited
  console.log(keys, t.path())
  if (t.type && !top) result.type = t.type.compute()
  if (keys) {
    for (let i = 0, len = keys.length; i < len; i++) {
      let key = keys[i]
      if (t[key]) result[key] = createSetObj(t[key])
    }
  }
  if (t.val !== void 0) result.val = t.val
  return result
}

// slow as fuck
const handleInstances = (t, a) => {
  const instances = t.instances
  const keys = t._ks
  if (keys) {
    for (let i = 0, len = keys.length; i < len; i++) {
      if (t[keys[i]]) handleInstances(t[keys[i]], a[keys[i]])
    }
  }
  if (instances) {
    a.instances = instances
    for (let i = 0, len = instances.length; i < len; i++) {
      instances[i].inherits = a
      if ('_ks' in instances[i]) {
        let newKeys = a.keys().concat()
        let keys = instances[i]._ks || []
        instances[i]._ks = newKeys // now update your own instances as well!
        for (let j = 0, len = newKeys.length; j < len; j++) {
          if (instances[i][newKeys[j]] === null && get(a, newKeys[j])) {
            removeKey(instances[i], newKeys[i])
          }
        }
        for (let j = 0, len = keys.length; j < len; j++) {
          if (instances[i][keys[j]]) newKeys.push(keys[j])
        }
        handleInstances(instances[i], instances[i])
      }
    }
  }
}

const merge = (t, type, stamp) => {
  const result = getType(t._p, type, t)
  if (result) {
    if (t._ks || t.val !== void 0) {
      t.inherits = result
      const raw = createSetObj(t, true)
      const instance = create(result, raw, void 0, t._p, t.key)
      handleInstances(t, instance)
      return instance
    } else {
      console.log('\nfound a type - ', type)
    }
  }
  return t
}

const createType = (parent, val, t, stamp) => {
  const type = val.type
  var instance
  if (val.reset) {
    instance = new t.Constructor()
    instance.inherits = t
  } else {
    console.log('TODO: need to merge types on create figure out later')
    t = getType(parent, type, t) || t
    instance = new t.Constructor()
    instance.inherits = t
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

export { types, type, createType }
