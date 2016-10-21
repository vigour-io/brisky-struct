const { get } = require('./get')
const { removeKey, createKeys } = require('./keys')
const { create, set, property } = require('./set')

const resolveContext = (target, val, stamp) => {
  const path = target.contextPath
  let context = target.context
  // optmize for remove
  if (val === null) {
    console.log('context remove need to handle a bit later')
  }
  // so top needs to be property
  // else wrong keys
  if (typeof path === 'object') {
    for (let i = 0, len = path.length; i < len; i++) {
      // const property = (target, key, val, stamp) => {
      // const contextProperty = (target, val, stamp, key, property) => {
      context[path[i]] = create(get(context, path[i], true), void 0, stamp)
      context[path[i]].parent = context
      context[path[i]].key = path[i]
      context = context[path[i]]
    }
  } else {
    context = context[path] = create(get(context, path, true), void 0, stamp)
  }
  // console.log('yo g', val, context.key, context.keys)
  set(context, val, stamp)
  return true
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
