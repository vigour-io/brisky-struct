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

const helper = (target, key, val, noContext) => {
  if (typeof key === 'object') {
    for (let i = 0, len = key.length; target && i < len; i++) {
      target = get(target, key[i], noContext)
    }
    return target
  } else {
    return get(target, key, noContext)
  }
}

exports.helper = helper
exports.get = get
