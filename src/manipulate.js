import { data, overrideSubscription } from './emit'
import { listener } from './struct/listener'
import { uid } from './uid'
import instances from './instances'
import remove from './remove'
import { resolveContext } from './context'
import { getProp } from './property'
import createType from './struct/types/create'
import { promise, generator, isGeneratorFunction, iterator } from './async'
import { reference, resolveReferences, removeReference } from './references'
import { get, getVal } from './get'

const create = (t, val, stamp, parent, key) => {
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
    set(instance, val, stamp, true)
  }

  if (parent) {
    if (
      t.emitters &&
      t.emitters.data &&
      t.emitters.data.struct
    ) {
      resolveReferences(t, instance, stamp)
    }
    // this part will go into the actual setting of a struct listener
    /*
     else if (
      instance.emitters &&
      instance.emitters.data &&
      instance.emitters.data.struct
    ) {
      resolveReferences(t, instance, stamp)
    }
    */
  }
  return instance
}

const overrideObjects = (t, val, stamp, isNew) => {
  const override = val.stamp
  if (!stamp) stamp = override
  if (val.val === null) {
    return remove(t, stamp, override)
  } else {
    if (t.instances) {
      let changed
      for (let key in val) {
        if (key !== 'stamp') {
          let result = key !== 'val'
              ? getProp(t, key)(t, val[key], key, stamp, isNew, val)
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
      if (changed) {
        if (stamp) { data(t, val, stamp, override, isNew) }
        instances(t, val, stamp, changed, override)
        return true
      } else if (stamp !== t.tStamp) {
        overrideSubscription(t, override, stamp, isNew)
      }
    } else {
      let changed
      for (let key in val) {
        if (key !== 'stamp') {
          if (
            key !== 'val'
              ? getProp(t, key)(t, val[key], key, stamp, isNew, val)
              : setVal(t, val.val, stamp, 1)
          ) {
            changed = true
          }
        }
      }
      if (changed) {
        if (stamp) { data(t, val, stamp, override, isNew) }
        return true
      } else if (stamp !== t.tStamp) {
        overrideSubscription(t, override, stamp, isNew)
      }
    }
  }
}

const objects = (t, val, stamp, isNew) => {
  if (val.stamp) {
    return overrideObjects(t, val, stamp, isNew)
  } else if (t.instances) {
    let changed
    for (let key in val) {
      if (key !== 'stamp') {
        let result = key !== 'val'
            ? getProp(t, key)(t, val[key], key, stamp, isNew, val)
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
          ? getProp(t, key)(t, val[key], key, stamp, isNew, val)
          : setVal(t, val.val, stamp, 1)
      ) {
        changed = true
      }
    }
    if (changed) {
      if (stamp) { data(t, val, stamp, false, isNew) }
      return true
    }
  }
}

const set = (t, val, stamp, isNew) => {
  if (t._c) {
    return resolveContext(t, val, stamp)
  } else {
    const type = typeof val
    if (type === 'function') {
      if (isGeneratorFunction(val)) {
        generator(t, val, stamp)
      } else if (setVal(t, val, stamp)) {
        return isChanged(t, val, stamp, isNew)
      }
    } else if (type === 'object') {
      if (!val) {
        return remove(t, stamp)
      } else {
        if (val.inherits) {
          if (setVal(t, val, stamp, true)) {
            return isChanged(t, val, stamp, isNew)
          }
        } else if (val.then && typeof val.then === 'function') {
          promise(t, val, stamp)
        } else if (val.next && typeof val.next === 'function') {
          iterator(t, val, stamp)
        } else if (val[0] && val[0] === '@') {
          if (reference(t, val, stamp)) {
            return isChanged(t, val, stamp, isNew)
          }
        } else {
          return objects(t, val, stamp, isNew)
        }
      }
    } else if (setVal(t, val, stamp)) {
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

      if (val.instances && val._p && t._p) {
        const rootInstances = val.root(true).instances
        if (rootInstances && t.root(true) === val.root(true)) {
          for (let i = 0, len = rootInstances.length; i < len; i++) {
            const field = get(rootInstances[i], val.path(true), true)
            if (field !== val) {
              const instance = get(rootInstances[i], t.path(true))
              if (getVal(instance) === t.val) instance.set(field, stamp)
            }
          }
        }
      }
    } else {
      removeReference(t)
      t.val = val
    }
    return true
  }
}

export { set, create, resolveReferences }
