const get = (t, key, noContext) => {
  if (key in t) {
    const result = t[key]
    if (!noContext && result && result.inherits) {
      if (t.context) {
        result.context = t.context
        result.contextPath = typeof t.contextPath === 'object'
          ? t.contextPath.concat([ key ])
          : [ t.contextPath, key ]
      } else if (result.context) {
        result.context = null
        result.contextPath = null
      }
    }
    return result
  } else if (t.inherits) {
    const result = get(t.inherits, key, true)
    if (!noContext && result && result.inherits) {
      result.context = t
      result.contextPath = key
    }
    return result
  }
}

const helper = (t, key, val, stamp, noContext) => {
  // if val make whole path

  if (typeof key === 'object') {
    for (let i = 0, len = key.length; t && i < len; i++) {
      t = get(t, key[i], noContext)
    }
    return t
  } else {
    return get(t, key, noContext)
  }
}

const getFn = t => t.fn || t.inherits && getFn(t.inherits)

const getStruct = t => t.struct || t.inherits && getStruct(t.inherits)

const getDefault = t => t.props && t.props.default.struct || getDefault(t.inherits)

// all these helpers will just go to "api" much clearer
// get help will also support methods [0] [1] etc
exports.helper = helper
exports.getFn = getFn
exports.getStruct = getStruct
exports.get = get
exports.getDefault = getDefault
