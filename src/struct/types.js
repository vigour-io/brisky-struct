import { create, set } from '../manipulate'
import { getDefault, get } from '../get'
import { removeKey, addKey } from '../keys'
import { getProp } from '../property'
import { root } from '../traversal'
import { contextProperty } from '../context'

const inheritType = t => t.type || t.inherits && inheritType(t.inherits)

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

const merge = (t, type, stamp, reset) => {
  const result = getType(t._p, type, t) || getDefault(t._p)

  console.log('MERGE', type, stamp) // why does this not fire?

  const instance = create(
    result,
    ((t._ks || t.val !== void 0) && !reset)
    ? createSetObj(t, true) : void 0,
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
  if (constructor !== t && key && t.key === key && !val.reset && (t._ks || t.val !== void 0)) {
    set(instance, createSetObj(t, true, instance), stamp)
  }
  return instance
}

const getType = (parent, type, t, stamp) => {
  if (typeof type === 'object') type = type.val
  var result = getTypeInternal(parent, type, t)
  if (!result) {
    parent = root(parent)
    set(parent, { types: { [type]: {} } }, stamp)
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

const type = (t, val, key, stamp, isNew, original) => {
  if (typeof val === 'object') {
    if (val.stamp && val.val) {
      if (!stamp) stamp = val.stamp
      val = val.val
      // need to add references
    }
  }

  // and ignore reset ofc
  if (!isNew && t._p) {
    let type = t.type || inheritType(t)
    type = type && type.compute()
    if (type !== val) {
      t = merge(t, val, stamp, original.reset)
    }
  }

  if (t.type) {
    set(t.type, val, stamp)
  } else {
    t.type = create(getProp(t, key).struct, val, stamp, t, key)
  }
  return 2
}

const inherits = (prop, t) => {
  while (t) {
    if (t === prop) return true
    t = t.inherits
  }
}

const types = struct => {
  const types = (t, val, key, stamp) => {
    // need to add referencesv support (with getOrigin)
    var changed
    if (!t.types) {
      const prop = getProp(t, key).struct
      let cntx = get(t, 'types')
      if (cntx && !inherits(prop, cntx)) cntx = false
      t.types = create(cntx || prop, void 0, stamp, t, key)
      if (!cntx) changed = 2
    }
    set(t.types, val, stamp)
    return changed
  }

  types.struct = create(struct, {
    instances: false,
    props: {
      default: (t, val, key, stamp, isNew) => {
        var changed
        const result = get(t, key)
        if (result) {
          if (result._c) {
            contextProperty(t, val, stamp, key, result)
          } else {
            set(result, val, stamp)
            changed = val === null
          }
        } else {
          addKey(t, key)
          if (val === 'self') {
            t[key] = t._p
          } else if (typeof val === 'object' && val.inherits) {
            t[key] = val
          } else {
            create(getDefault(t._p), val, stamp, t, key)
          }
          changed = true
        }
        return changed
      }
    }
  })
  types.struct.props.default.struct = type.struct = struct
  set(struct, { props: { type, types }, types: { struct } })
  struct.types._ks = void 0 // remove struct key
  struct.type = create(struct, 'struct')
}

export { types, createType, getType }
