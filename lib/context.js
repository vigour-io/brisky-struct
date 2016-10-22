const { get } = require('./get')
const { removeContextKey, createKeys } = require('./keys')
const { create } = require('./manipulate')

const resolveContext = (t, val, stamp) => {
  const path = t.contextPath
  var context = t.context
  let key
  if (typeof path === 'object') {
    key = path[0]
    contextProperty(context, void 0, stamp, key, get(context, key, true))
    context = context[key]
    const last = path.length - 1
    for (let i = 1; i < last; i++) {
      key = path[i]
      context[key] = create(get(context, key, true), void 0, stamp)
      context[key].parent = context
      context[key].key = key
      context = context[key]
    }
    key = path[last]
  } else {
    key = path
  }
  contextProperty(context, val, stamp, key, get(context, key, true))
  return true // check if it really changed
}

const contextProperty = (t, val, stamp, key, property) => {
  if (val === null) {
    removeContextProperty(t, key)
  } else {
    t[key] = create(property, val, stamp)
  }
  return true // check if it really changed
}

const removeContextProperty = (t, key) => {
  t[key] = void 0
  removeContextKey(t, key)
}

exports.contextProperty = contextProperty
exports.removeContextProperty = removeContextProperty
exports.resolveContext = resolveContext
