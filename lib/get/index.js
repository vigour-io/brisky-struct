const get = (t, key, noContext) => {
  if (key in t) {
    const result = t[key]
    if (!noContext && result && result.inherits) {
      if (t.context) {
        console.log('SET CONTEXT')
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
      console.log('SET CONTEXT')
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

const getFn = t => t.fn || t.inherits && getFn(t.inherits)

const getDefault = t => t.props && t.props.default.struct || getDefault(t.inherits)

export { getFn, get, getDefault, getOrigin }
