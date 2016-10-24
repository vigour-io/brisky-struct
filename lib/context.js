const { get } = require('./get')
const { removeContextKey } = require('./keys')
const { create } = require('./manipulate')

const resolveContext = (t, val, stamp) => {
  const path = t.contextPath
  var cntx = t.context
  let key
  if (typeof path === 'object') {
    key = path[0]
    contextProperty(cntx, void 0, stamp, key, get(cntx, key, true))
    cntx = cntx[key]
    const last = path.length - 1
    for (let i = 1; i < last; i++) {
      key = path[i]
      cntx[key] = create(get(cntx, key, true), void 0, stamp, cntx, key)
      cntx = cntx[key]
    }
    key = path[last]
  } else {
    key = path
  }
  contextProperty(cntx, val, stamp, key, get(cntx, key, true))
  return true // check if it really changed
}

const contextProperty = (t, val, stamp, key, property) => {
  if (val === null) {
    removeContextProperty(t, key)
  } else {
    t[key] = create(property, val, stamp, t, key)
  }
  return true // check if it really changed
}

const removeContextProperty = (t, key) => {
  t[key] = void 0
  removeContextKey(t, key)
}

exports.contextProperty = contextProperty
exports.resolveContext = resolveContext
