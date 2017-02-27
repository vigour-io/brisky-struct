import { create, set } from '../../manipulate'
import { getDefault, get } from '../../get'
import { removeKey, addKey } from '../../keys'
import { getProp } from '../../property'
import { contextProperty } from '../../context'
import createSetObj from './set'
import getType from './get'

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

const merge = (t, type, stamp, reset, original) => {
  console.log(type)
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

const type = (t, val, key, stamp, isNew, original) => {
  var isObject
  if (typeof val === 'object') {
    if (!val) {
      // console.log('remove type')
    } else if (val.stamp && val.val && !val.inherits) {
      if (!stamp) stamp = val.stamp
      val = val.val
    } else if (val.inherits) {
      isObject = true
    } else {
      isObject = true
    }
  }

  // and ignore reset ofc
  if (!isNew && t._p) {
    if (isObject) {
      // console.log('switch using object - not supported yet')
    } else {
      let type = t.type || inheritType(t)
      type = type && type.compute()
      if (type !== val) {
        t = merge(t, val, stamp, original.reset, original, true)
      }
    }
  }

  if (t.type) {
    return set(t.type, val, stamp) && 2
  } else {
    t.type = create(getProp(t, key).struct, val, stamp, t, key)
    return 2
  }
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

export { types, getType }
