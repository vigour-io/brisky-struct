const struct = {
  instances: false
}
struct.child = struct

// const keys = (target) => {
  // can also just not make the keys array, and make it when nessecary
// }

const getDefinition = (target, key) => {
  const properties = get(target, 'properties', true)
  return properties && properties[key]
}

const property = (target, key, val, stamp) => {
  // if property handle complete special
  // remove and null

  var changed
  const definition = getDefinition(target, key)
  if (definition) {
    changed = definition(target, key, val, stamp)
  } else {
    const result = get(target, key)
    if (result) {
      if (result.context) {
        // make new instance
        // if previous and remove make a removed keys field?
      } else {
        changed = set(result, val, stamp)
      }
    } else {
      changed = true
      if (!target.keys) {
        target.keys = []
      }
      target.keys.push(key)
      target[key] = create(get(target, 'child', true), val, stamp)
    }
  }
  return changed
}

const get = (target, key, noContext) => {
  if (key in target) {
    return target[key]
  } else if (target.inherits) {
    const result = get(target.inherits, key, true)
    if (!noContext && result && result.inherits) {
      result.context = target
      result.contextKey = key
    }
    return result
  }
}

const create = (target, val, stamp) => {
  const instance = { inherits: target }
  if (target.instances !== false) {
    if (!target.instances) { target.instances = [] }
    target.instances.push(instance)
  }
  set(instance, val, stamp)
  return instance
}

const set = (target, val, stamp) => {
  const type = typeof val
  var changed
  if (type === 'object' && type !== 'function') {
    if (val.inherits) {
      // struct
    } else {
      for (let key in val) {
        if (property(target, key, val[key], stamp)) {
          changed = true
        }
      }
    }
  } else {
    changed = target.val !== val
    if (changed) {
      target.val = val
    }
  }
  return changed
}

exports.struct = struct
exports.create = create
exports.set = set
