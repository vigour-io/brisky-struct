const struct = {
  instances: false,
  properties: {
    child: (target, val, key, stamp) => {
      // lets do child
    },
    types: () => {
      // some types
    },
    $transform: (target, val) => {
      // can add more like keys -- do this later
      target.$transform = val
      // changed?
    },
    properties: (target, val, key, stamp) => {
      // need to update instances
      if (!target.properties) {
        const previous = get(target, 'properties', true)
        target.properties = {}
        if (previous) {
          for (let key in previous) {
            target.properties[key] = previous[key]
          }
        }
      }
      for (let key in val) {
        // here well do similair behvaiours of course
        // big advantges of this system is that we can use delete
        target.properties[key] = val[key]
      }
    }
  }
}
struct.child = struct

const getDefinition = (target, key) => {
  const properties = get(target, 'properties', true)
  return properties && properties[key]
}

const removeKey = (target, key) => {
  for (let i = 0; i < target.keys.length; i++) {
    if (target.keys[i] === key) {
      target.keys.splice(i, 1)
      break
    }
  }
  // UPDATE KEY INSTANCES
}

const createKeys = (target) => {
  const keys = get(target.inherits, 'keys', true)
  target.keys = keys ? keys.concat([]) : []
}

const addKey = (target, key) => {
  if (!target.keys) { createKeys(target) }
  target.keys.push(key)
  // UPDATE KEY INSTANCES
}

const contextProperty = (target, val, stamp, key, property) => {
  if (val === null) {
    removeContextPropery(target, key)
  } else {
    target[key] = create(property, val, stamp)
  }
  return true // check if it really changed
}

const removeContextPropery = (target, key) => {
  target[key] = void 0
  if (!target.keys) { createKeys(target) }
  removeKey(target, key)
}

const resolveContext = (target, val, stamp) => {
  const path = target.contextPath
  let context = target.context
  // optmize for remove
  if (val === null) {
    console.log('context remove need to handle a bit later')
  }
  if (typeof path === 'object') {
    for (let i = 0, len = path.length; i < len; i++) {
      // const property = (target, key, val, stamp) => {
      // const contextProperty = (target, val, stamp, key, property) => {
      context[path[i]] = create(get(context, path[i], true), void 0, stamp)
      context[path[i]].parent = context
      context[path[i]].key = path[i]
      context = context[path[i]]
    }
  } else {
    context = context[path] = create(get(context, path, true), void 0, stamp)
  }
  // console.log('yo g', val, context.key, context.keys)
  set(context, val, stamp)
  return true
}

const property = (target, key, val, stamp) => {
  var changed
  const definition = getDefinition(target, key)
  if (definition) {
    changed = definition(target, val, key, stamp)
  } else {
    const result = get(target, key)
    if (result) {
      if (result.context) {
        changed = contextProperty(target, val, stamp, key, result)
      } else {
        changed = set(result, val, stamp)
      }
    } else {
      changed = true
      addKey(target, key)
      const result = create(get(target, 'child', true), val, stamp)
      result.key = key
      result.parent = target
      target[key] = result
    }
  }
  return changed
}

const create = (target, val, stamp) => {
  const instance = { inherits: target }
  if (target.instances !== false) {
    if (!target.instances) { target.instances = [] }
    target.instances.push(instance)
  }
  if (val !== void 0) { set(instance, val, stamp) }
  return instance
}

const remove = (target, stamp) => {
  const parent = target.parent
  const key = target.key
  if (parent && key) {
    if (get(parent.inherits, key, true)) {
      removeContextPropery(parent, key)
    } else {
      removeKey(parent, key)
      delete parent[key]
    }
  }
  if (target.keys) {
    for (let i = 0; i < target.keys.length; i++) {
      // NESTED UPDATES
    }
  }
}

const setVal = (target, val) => {
  if (target.val !== val) {
    target.val = val
    return true
  }
}

const set = (target, val, stamp) => {
  var changed
  if (target.context) {
    changed = resolveContext(target, val, stamp)
  } else {
    const type = typeof val
    if (type === 'object' && type !== 'function') {
      if (!val) {
        remove(target, stamp)
        changed = true
      } else {
        if (val.inherits) {
          changed = setVal(target, val)
        } else {
          for (let key in val) {
            if (key === 'val') {
              if (setVal(target, val)) { changed = true }
            } else if (property(target, key, val[key], stamp)) {
              changed = true
            }
          }
        }
      }
    } else if (val !== void 0) {
      changed = setVal(target, val)
    }
  }
  return changed
}

const get = (target, key, noContext) => {
  if (key in target) {
    const result = target[key]
    if (!noContext && result && result.inherits) {
      if (target.context) {
        result.context = target.context
        result.contextPath = typeof target.contextPath === 'object'
          ? target.contextPath.concat([ key ])
          : [ target.contextPath, key ]
      } else if (result.context) {
        delete result.context
        delete result.contextPath
      }
    }
    return result
  } else if (target.inherits) {
    const result = get(target.inherits, key, true)
    if (!noContext && result && result.inherits) {
      result.context = target
      result.contextPath = key
    }
    return result
  }
}

const getHelper = (target, key, val, noContext) => {
  if (typeof key === 'object') {
    for (let i = 0, len = key.length; target && i < len; i++) {
      target = get(target, key[i], noContext)
    }
    return target
  } else {
    return get(target, key, noContext)
  }
}

const compute = (target, val, passon) => {
  if (!val) {
    val = target.val
    if (typeof val === 'object' && val.inherits) {
      val = compute(val)
    }
  }
  if (target.$transform) {
    return target.$transform(val, passon || target)
  } else {
    return val
  }
}

exports.struct = struct
exports.create = create
exports.set = set
exports.get = getHelper
exports.compute = compute
