const { get } = require('./get')
const { removeKey, createKeys } = require('./keys')
const { create } = require('./set')

const resolveContext = (target, val, stamp) => {
  const path = target.contextPath
  var context = target.context
  let key
  if (typeof path === 'object') {
    key = path[0]
    contextProperty(context, void 0, stamp, key, get(context, key, true))
    context = context[key]
    for (let i = 1, len = path.length; i < len - 1; i++) {
      key = path[i]
      context[key] = create(get(context, key, true), void 0, stamp)
      context[key].parent = context
      context[key].key = key
      context = context[key]
    }
    key = path[path.length - 1]
  } else {
    key = path
  }
  contextProperty(context, val, stamp, key, get(context, key, true))
  return true // check if it really changed
}

const contextProperty = (target, val, stamp, key, property) => {
  if (val === null) {
    removeContextProperty(target, key)
  } else {
    target[key] = create(property, val, stamp)
  }
  return true // check if it really changed
}

const removeContextProperty = (target, key) => {
  target[key] = void 0
  if (!target.keys) { createKeys(target) }
  removeKey(target, key)
}

exports.contextProperty = contextProperty
exports.removeContextProperty = removeContextProperty
exports.resolveContext = resolveContext
