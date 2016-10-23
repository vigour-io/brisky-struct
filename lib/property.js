const { get } = require('./get')
const { addKey } = require('./keys')
const { create, set } = require('./manipulate')
const { contextProperty } = require('./context')

const property = (t, val, key, stamp, struct) => {
  var changed
  const result = get(t, key)
  if (result) {
    if (result.context) {
      changed = contextProperty(t, val, stamp, key, result)
    } else {
      changed = set(result, val, stamp)
    }
  } else {
    changed = true
    addKey(t, key)
    const result = create(struct, val, stamp)
    result.key = key
    result.parent = t
    t[key] = result
  }
  return changed
}

const prop = (t, key) => t.props ? key in t.props && t.props[key] : prop(t.inherits, key)

const getProperty = (t, key) => {
  if (t.props) {
    if (key in t.props) {
      return t.props[key]
    } else {
      return t.inherits && prop(t.inherits, key) || t.props['*']
    }
  } else {
    return getProperty(t.inherits, key)
  }
}

exports.getProperty = getProperty
exports.property = property
