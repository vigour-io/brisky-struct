import { data, overrideSubscription } from './emit'
import { listener } from './struct/listener'
import { uid } from './uid'
import instances from './instances'
import remove from './remove'
import { resolveContext } from './context'
import { getProp } from './property'
import createType from './struct/types/create'
import { promise, generator, isGeneratorFunction, iterator } from './async'
import { reference, removeReference, resolveReferences, resolveFromValue, updateInstances } from './references'
import { getKeys } from './keys'

const create = (t, val, stamp, parent, key, reset) => {
  var instance
  const hasType = val &&
    typeof val === 'object' &&
    val.type && getProp(t, 'type') !== getProp(t, 'default')
  if (parent) {
    if (hasType) {
      instance = createType(parent, val, t, stamp, key)
    } else {
      instance = new t.Constructor()
      instance.inherits = t
      if (t.instances !== false) {
        if (!t.instances) {
          t.instances = [ instance ]
        } else {
          t.instances.push(instance)
        }
      }
    }
    instance._p = parent
    if (key !== void 0) {
      instance.key = key
      parent[key] = instance
    }
  } else {
    if (hasType && typeof val.type === 'object') {
      instance = createType(parent, val, t, stamp, key)
    } else {
      instance = new t.Constructor()
      instance.inherits = t
      if (t.instances !== false) {
        if (!t.instances) {
          t.instances = [ instance ]
        } else {
          t.instances.push(instance)
        }
      }
    }
  }
  if (val !== void 0) {
    set(instance, val, stamp, true, reset)
  }

  if (
    parent &&
    t.emitters &&
    t.emitters.data &&
    t.emitters.data.struct
  ) {
    resolveReferences(t, instance, stamp)
  }

  return instance
}

// reset functions
const removeAllFields = (t, stamp) => {
  const keys = getKeys(t)
  let changed
  if (keys) {
    let i = keys.length
    while (i--) {
      if (keys[i] in t) {
        remove(t[keys[i]], stamp)
        changed = true
      }
    }
  }
  return changed
}

const removeSomeFields = (t, stamp, val, changed, isBool) => {
  const keys = getKeys(t)
  if (!val.val && t.val !== void 0) {
    val.val = void 0
    if (isBool) {
      changed = true
    } else if (!changed) {
      changed = []
    }
  }
  if (keys) {
    let i = keys.length
    while (i--) {
      const key = keys[i]
      if (!(key in val) && (key in t)) {
        remove(t[key], stamp)
        if (isBool) {
          changed = true
        } else {
          if (!changed) {
            changed = [ key ]
          } else {
            changed.push(key)
          }
        }
      }
    }
  }
  return changed
}
// --------------

const overrideObjects = (t, val, stamp, isNew, reset) => {
  var override = val.stamp

  if (override && t.stamp && !reset) {
    // conflict resolution
    if (Math.abs(t.stamp) > Math.abs(override)) {
      return false
    }
  }

  if (!stamp) stamp = override // also need to use this for _t stmap but not for travel :/

  if (val.val === null) {
    return remove(t, stamp, override)
  } else {
    if (t.instances) {
      let changed
      for (let key in val) {
        if (key !== 'stamp') {
          let result = key !== 'val'
              ? getProp(t, key)(t, val[key], key, stamp, isNew, reset, val)
              : setVal(t, val.val, stamp, 1)
          if (result) {
            if (!changed) {
              changed = result === 2 ? [] : [ key ]
            } else if (result !== 2) {
              changed.push(key)
            }
          }
        }
      }

      if (reset) {
        const changeNest = removeSomeFields(t, stamp, val, changed)
        if (!changed) changed = changeNest
      }

      if (changed) {
        if (stamp) { data(t, val, stamp, override, isNew) }
        instances(t, val, stamp, changed, override)
        return true
      } else if (stamp !== t.tStamp) {
        // need to apply tStamp from override but not for the travel parts
        overrideSubscription(t, override, stamp, isNew)
      }
    } else {
      let changed
      for (let key in val) {
        if (key !== 'stamp') {
          if (
            key !== 'val'
              ? getProp(t, key)(t, val[key], key, stamp, isNew, reset, val)
              : setVal(t, val.val, stamp, 1)
          ) {
            changed = true
          }
        }
      }

      if (reset && removeSomeFields(t, stamp, val, void 0, true)) changed = true

      if (changed) {
        if (stamp) { data(t, val, stamp, override, isNew) }
        return true
      } else if (stamp !== t.tStamp) {
        overrideSubscription(t, override, stamp, isNew)
      }
    }
  }
}

const objects = (t, val, stamp, isNew, reset) => {
  if (val.stamp) {
    return overrideObjects(t, val, stamp, isNew, reset)
  } else if (t.instances) {
    let changed
    for (let key in val) {
      if (key !== 'stamp') {
        let result = key !== 'val'
            ? getProp(t, key)(t, val[key], key, stamp, isNew, reset, val)
            : setVal(t, val.val, stamp, 1)
        if (result) {
          if (!changed) {
            changed = result === 2 ? [] : [ key ]
          } else if (result !== 2) {
            changed.push(key)
          }
        }
      }
    }
    if (reset) {
      const changeNest = removeSomeFields(t, stamp, val, changed)
      if (!changed) changed = changeNest
    }
    if (changed) {
      if (stamp) { data(t, val, stamp, false, isNew) }
      instances(t, val, stamp, changed)
      return true
    }
  } else {
    let changed
    for (let key in val) {
      if (
        key !== 'val'
          ? getProp(t, key)(t, val[key], key, stamp, isNew, reset, val)
          : setVal(t, val.val, stamp, 1)
      ) {
        changed = true
      }
    }

    if (reset && removeSomeFields(t, stamp, val, void 0, true)) changed = true

    if (changed) {
      if (stamp) { data(t, val, stamp, false, isNew) }
      return true
    }
  }
}

const set = (t, val, stamp, isNew, reset) => {
  if (t._c) {
    return resolveContext(t, val, stamp, reset)
  } else {
    const type = typeof val
    if (type === 'function') {
      if (isGeneratorFunction(val)) {
        generator(t, val, stamp)
      } else if (setVal(t, val, stamp)) {
        if (reset) removeAllFields(t, stamp)
        return isChanged(t, val, stamp, isNew)
      } else if (reset && removeAllFields(t, stamp)) {
        return isChanged(t, val, stamp, isNew)
      }
    } else if (type === 'object') {
      if (!val) {
        return remove(t, stamp)
      } else {
        if (val.inherits) {
          if (setVal(t, val, stamp, true)) {
            if (reset) removeAllFields(t, stamp)
            return isChanged(t, val, stamp, isNew)
          } else if (reset && removeAllFields(t, stamp)) {
            return isChanged(t, val, stamp, isNew)
          }
        } else if (val.then && typeof val.then === 'function') {
          // handle reset :X ?
          promise(t, val, stamp)
        } else if (val.next && typeof val.next === 'function') {
          // handle reset :X ?
          iterator(t, val, stamp)
        } else if (val[0] && val[0] === '@') {
          if (reference(t, val, stamp)) {
            if (reset) removeAllFields(t, stamp)
            return isChanged(t, val, stamp, isNew)
          } else if (reset && removeAllFields(t, stamp)) {
            return isChanged(t, val, stamp, isNew)
          }
        } else {
          return objects(t, val, stamp, isNew, reset)
        }
      }
    } else if (setVal(t, val, stamp)) {
      if (reset) removeAllFields(t, stamp)
      return isChanged(t, val, stamp, isNew)
    } else if (reset && removeAllFields(t, stamp)) {
      return isChanged(t, val, stamp, isNew)
    }
  }
}

const isChanged = (t, val, stamp, isNew) => {
  if (stamp) { data(t, val, stamp, false, isNew) }
  if (t.instances) { instances(t, val, stamp, true) }
  return true
}

const getOnProp = t => t.props && t.props.on || getOnProp(t.inherits)

const onContext = (t, context) => {
  if (t.emitters) {
    if (context) {
      t.emitters._c = context
      t.emitters._cLevel = 1
    }
  } else if (t.inherits) {
    onContext(t.inherits, context || t)
  }
}

const setVal = (t, val, stamp, ref) => {
  if (t.val !== val) {
    if (ref) {
      if (ref === 1) {
        if (typeof val === 'object') {
          if (!val.inherits) {
            if (val[0] && val[0] === '@') {
              return reference(t, val, stamp)
            } else {
              removeReference(t)
              if (val.then && typeof val.then === 'function') {
                promise(t, val, stamp)
                return
              } else if (val.next && typeof val.next === 'function') {
                iterator(t, val, stamp)
                return
              }
              t.val = val
              return true
            }
          }
        } else {
          removeReference(t)
          t.val = val
          return true
        }
      }
      removeReference(t)
      if (t.val && typeof t.val === 'object' && t.val.inherits && t.instances) {
        updateInstances(t, val)
      }
      t.val = val
      if (val.emitters) {
        if (!val.emitters.data) {
          getOnProp(val)(val, { data: void 0 }, 'on')
        }
        listener(val.emitters.data, t, uid(t))
      } else {
        onContext(val)
        getOnProp(val)(val, { data: void 0 }, 'on')
        listener(val.emitters.data, t, uid(t))
      }
      resolveFromValue(t, val, stamp)
    } else {
      removeReference(t)
      t.val = val
    }
    return true
  }
}

export { set, create }
