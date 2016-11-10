const get = (t, key, noContext) => {
  if (key in t) {
    const result = t[key]
    if (!noContext && result && result.inherits) {
      if (t.context) {
        result.context = t.context
        result.contextLevel = t.contextLevel + 1
      } else if (result.context) {
        result.context = null
        result.contextLevel = null
      }
    }
    return result
  } else if (t.inherits) {
    const result = get(t.inherits, key, true)
    if (!noContext && result && result.inherits) {
      result.context = t
      result.contextLevel = 1
    }
    return result
  }
}

const helper = (t, key, val, stamp) => {
  // if val make whole path
  // handle val support
  // all these helpers will just go to "api" much clearer
  // get help will also support methods [0] [1] etc

  if (typeof key === 'object') {
    for (let i = 0, len = key.length; t && i < len; i++) {
      t = get(t, key[i])
      if (typeof t === 'function') { t = t() }
    }
    return t
  } else {
    t = get(t, key)
    if (typeof t === 'function') { t = t() }
    return t
  }
}

const getFn = t => t.fn || t.inherits && getFn(t.inherits)
const getDefault = t => t.props && t.props.default.struct || getDefault(t.inherits)

exports.helper = helper
exports.getFn = getFn
exports.get = get
exports.getDefault = getDefault
