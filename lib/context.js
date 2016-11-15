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
    let parent = t._p
    while (--level) {
      path.unshift(parent._k)
      parent = parent._p
    }
    key = path[0]
    let inherits = get(cntx, key, true)
    contextProperty(cntx, void 0, stamp, key, inherits)
    inherits.context = null
    inherits.contextLevel = null
    cntx = cntx[key]
    for (let i = 1, len = path.length; i < len; i++) {
      key = path[i]
      inherits = get(cntx, key, true)
      cntx[key] = create(inherits, void 0, stamp, cntx, key)
      inherits.context = null
      inherits.contextLevel = null
      cntx = cntx[key]
    }
    key = t._k
  } else {
    key = t._k
  }
  t.context = null
  t.contextLevel = null
  return contextProperty(cntx, val, stamp, key, get(cntx, key, true))
}

const contextProperty = (t, val, stamp, key, property) => {
  if (val === null) {
    removeContextProperty(t, key)
    return val
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
