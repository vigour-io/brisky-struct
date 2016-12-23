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

const getOrigin = (t, key) => {
  if (t) {
    let result = get(t, key)
    if (result !== void 0 && result !== null) {
      return result
    } else {
      return (t = t.val) && typeof t === 'object' && t.inherits && getOrigin(t, key)
    }
  }
}

// if you removed it dont return...
const getData = t => t.emitters && t.emitters.data || t.inherits && getData(t.inherits)

// same here
const getFn = t => t.fn || t.inherits && getFn(t.inherits)

const getDefault = t => t.props && t.props.default.struct || getDefault(t.inherits)

export { get, getDefault, getOrigin, getData, getFn }
