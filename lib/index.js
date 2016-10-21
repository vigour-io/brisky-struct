const struct = {
  instances: false,
  properties: {
    $transform: (target, val, key, stamp) => {
      // can add more like keys
      target.$transform = val
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
  // needs to get all properties (inherited bit annoying)
  const properties = get(target, 'properties', true)
  return properties && properties[key]
}

const property = (target, key, val, stamp) => {
  // if property handle complete special
  // remove and null
  var changed
  const definition = getDefinition(target, key)
  if (definition) {
    changed = definition(target, val, key, stamp)
  } else {
    const result = get(target, key)
    if (result) {
      if (result.context) {
        // need to know change
        target[key] = create(result, val, stamp)
        // may need to check if resolve is nessecary
        // if previous and remove make a removed keys field
      } else {
        changed = set(result, val, stamp)
      }
    } else {
      changed = true
      if (!target.keys) {
        target.keys = []
      }
      target.keys.push(key)
      // make child true, for listeners and transform
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
  // need to do some looping trough properties
  const parent = target.parent
  const key = target.key
  if (parent && key) {
    if (get(parent.inherits, key, true)) {
      if (!parent.removedKeys) {
        parent.removedKeys = []
      }
      parent.removedKeys.push(key)
      parent[key] = void 0
    } else {
      // remove from array
      for (let i = 0; i < parent.keys.length; i++) {
        if (parent.keys[i] === key) {
          parent.keys.splice(i, 1)
          break
        }
      }
      delete parent[key]
    }
  }
  // needs to check for instances
  if (target.instances) {
    // fire for instances perhaps but can also just be handled from set and nowhere else prob better...
  }
  // firing for context removes
  if (target.keys) {
    // these are OWN keys
    for (let i = 0; i < target.keys.length; i++) {
      // !need to emit! (if applicable)
      // and need to check if item has reference listeners
      // remove(target[target.keys[i]], stamp, fromRemove)
    }
  }
}

// need params, need to fix create
const set = (target, val, stamp) => {
  var changed
  if (target.context) {
    const path = target.contextPath
    let context = target.context
    // optmize for remove
    if (val === null) {
      console.log('context remove need to handle a bit later')
    }
    if (typeof path === 'object') {
      for (let i = 0, len = path.length; i < len; i++) {
        context = context[path[i]] = create(get(context, path[i], true), void 0, stamp)
      }
    } else {
      context = context[path] = create(get(context, path, true), void 0, stamp)
    }
    set(context, val, stamp)
    changed = true // maybe not but for consistency
  } else {
    const type = typeof val
    if (type === 'object' && type !== 'function') {
      if (!val) {
        remove(target, stamp)
        changed = true
      } else {
        if (val.inherits) {
          // REUSE
          changed = target.val !== val
          if (changed) {
            // if previous was reference go do some shit, remove listeners
            // add listeners
            target.val = val
          }
          // REUSE
        } else {
          for (let key in val) {
            if (key === 'val') {
              // REUSE
              changed = target.val !== val.val
              if (changed) {
                // if previous was reference go do some shit, remove listeners
                target.val = val.val
              }
              // REUSE
            } else if (property(target, key, val[key], stamp)) {
              changed = true
            }
          }
        }
      }
    } else if (val !== void 0) {
      // REUSE
      changed = target.val !== val
      if (changed) {
        // if previous was reference go do some shit, remove listeners
        target.val = val
      }
      // REUSE
    }
  }
  return changed
}

const get = (target, key, noContext) => {
  if (key in target) {
    const result = target[key]
    if (!noContext && result) {
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

// call it helper or something
const deepGet = (target, key, val, noContext) => {
  if (typeof key === 'object') {
    for (let i = 0, len = key.length; target && i < len; i++) {
      target = get(target, key[i], noContext)
    }
    return target
  } else {
    return get(target, key, noContext)
  }
}

const keys = (target) => {
  // memoize
  // needs to combined REMOVED and keys array
  // can also just not make the keys array, and make it when nessecary
}

const compute = (target, val, passon) => {
  if (!val) {
    val = target.val
    if (typeof target.val === 'object' && target.val.inherits) {
      val = compute(target.val)
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

exports.get = deepGet

exports.keys = keys

exports.compute = compute
