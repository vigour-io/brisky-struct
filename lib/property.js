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

const definition = (t, key) => t.props ? t.props[key] : definition(t.inherits, key)
const glob = t => t.props ? t.props['*'] : glob(t.inherits)
const getProperty = (t, key) => definition(t, key) || glob(t)

exports.getProperty = getProperty
exports.property = property
