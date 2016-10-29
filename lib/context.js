const { get } = require('./get')
const { removeContextKey } = require('./keys')
const { create } = require('./manipulate')

const resolveContext = (t, val, stamp) => {
  let level = t.contextLevel
  var cntx = t.context
  let key
  if (cntx.context) {
    cntx = resolveContext(cntx, void 0, stamp)
  }
  if (level > 1) {
    let path = []
    let parent = t.parent
    while (--level) {
      path.unshift(parent.key)
      parent = parent.parent
    }
    key = path[0]
    contextProperty(cntx, void 0, stamp, key, get(cntx, key, true))
    cntx = cntx[key]
    for (let i = 1, len = path.length; i < len; i++) {
      key = path[i]
      cntx[key] = create(get(cntx, key, true), void 0, stamp, cntx, key)
      cntx = cntx[key]
    }
    key = t.key
  } else {
    key = t.key
  }
  t.context = null
  t.contextLevel = null
  return contextProperty(cntx, val, stamp, key, get(cntx, key, true))
}

const contextProperty = (t, val, stamp, key, property) => {
  if (val === null) {
    removeContextProperty(t, key)
  } else {
    const result = create(property, val, stamp, t, key)
    t[key] = result
    return result
  }
}

const removeContextProperty = (t, key) => {
  t[key] = void 0
  removeContextKey(t, key)
}

exports.contextProperty = contextProperty
exports.resolveContext = resolveContext
