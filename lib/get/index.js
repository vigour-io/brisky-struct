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

const getOrigin = (t, key) => get(t, key) ||
  (t = t.val) && typeof t === 'object' && t.inherits && getOrigin(t, key)

const getFn = t => t.fn || t.inherits && getFn(t.inherits)
const getDefault = t => t.props && t.props.default.struct || getDefault(t.inherits)

exports.getFn = getFn
exports.get = get
exports.getDefault = getDefault
exports.getOrigin = getOrigin
