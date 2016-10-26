const { get } = require('./get')
const { addKey } = require('./keys')
const { create, set } = require('./manipulate')
const { contextProperty } = require('./context')

const property = (t, val, key, stamp, struct) => {
  var changed
  const result = get(t, key)
  if (result) {
    if (result.context) {
      contextProperty(t, val, stamp, key, result)
    } else {
      set(result, val, stamp)
    }
  } else {
    changed = true
    addKey(t, key)
    const result = create(struct, val, stamp, t, key)
    t[key] = result
  }
  return changed
}

const getProp = (t, key) => t.props
  ? key in t.props && t.props[key] || t.props.default
  : getProp(t.inherits, key)

exports.getProp = getProp
exports.property = property
