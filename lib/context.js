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
      path.unshift(parent.key)
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

/**
 * @function storeContext
 * stores context for reapplying with applyContext
 * @todo: needs perf optmization
 * @return {array} returns store
 */
const storeContext = t => {
  var context = t.context
  if (context) {
    const arr = []
    let level = t.contextLevel
    while (context) {
      arr.push(context, level)
      level = context.contextLevel
      context = context.context
    }
    return arr
  }
}

/**
 * @function applyContext
 * applies context to base
 */
const applyContext = (t, store) => {
  if (store) {
    const l = store.length
    let ret
    for (let i = 0, target = t; i < l; i = i + 2) {
      let context = store[i]
      let level = store[i + 1]
      let path = [ target ]
      let newTarget = setContext(target, context, level, path)
      let base = handleChange(target, context, path, level)
      if (ret === void 0 && base !== void 0) {
        ret = base
      }
      if (newTarget) {
        target = newTarget
      }
    }
    return ret
  }
}

const handleChange = (target, context, path, level) => {
  var newContext, newLevel
  var travelTaget = context
  if (context.val === null) {
    return null
  }
  for (let i = 0, len = path.length; i < len; i++) {
    let segment = path[i]
    let field = get(travelTaget, segment.key)
    // delete does not work.... like this does not set null anymore
    if (!field || field.val === null) {
      removeContext(target, level)
      return null
    } else if (field !== segment) {
      segment.context = null
      segment.contextLevel = null
      newContext = field
      newLevel = len - (i + 1)
    }
    travelTaget = field
    if (i === len - 1) {
      target = travelTaget
    }
  }
  if (newContext) {
    if (!newLevel) {
      removeContext(target, level)
    } else {
      setContext(target, newContext, newLevel)
    }
    return target
  }
}

const setContext = (target, context, level, path) => {
  if (level) {
    target.contextLevel = level
    target.context = context
    if (level > 1) {
      let p = target._p
      for (let i = 1; p && i < level; i++) {
        if (path) { path.unshift(p) }
        p.context = context
        p.contextLevel = target.contextLevel - i
        p = p._p
      }
    }
    return context
  }
}

const removeContext = (target, level) => {
  if (level) {
    target.contextLevel = null
    target.context = null
    if (level > 1) {
      let p = target._p
      for (let i = 1; p && i < level; i++) {
        p.context = null
        p.contextLevel = null
        p = p._p
      }
    }
  }
}

exports.contextProperty = contextProperty
exports.resolveContext = resolveContext

exports.applyContext = applyContext
exports.storeContext = storeContext
