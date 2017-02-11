import { get } from './get'
import { removeContextKey } from './keys'
import { create } from './manipulate'
import { removeContext as emit } from './emit/context'

const resolveContext = (t, val, stamp) => {
  let level = t._cLevel
  var cntx = t._c
  let key
  if (cntx._c) {
    cntx = resolveContext(cntx, void 0, stamp)
  }
  if (level > 1) {
    let path = []
    let parent = t._p
    while (--level) {
      path.unshift(parent.key)
      parent = parent._p
    }
    // need to happen for every step.. also when making an instance
    // basicly it allways needs to happen on create...
    key = path[0]
    let inherits = get(cntx, key, true)
    contextProperty(cntx, void 0, stamp, key, inherits)
    inherits._c = null
    inherits._cLevel = null
    cntx = cntx[key]
    for (let i = 1, len = path.length; i < len; i++) {
      key = path[i]
      inherits = get(cntx, key, true)
      cntx[key] = create(inherits, void 0, stamp, cntx, key)
      inherits._c = null
      inherits._cLevel = null
      cntx = cntx[key]
    }
    key = t.key
  } else {
    key = t.key
  }
  t._c = null
  t._cLevel = null
  return contextProperty(cntx, val, stamp, key, get(cntx, key, true))
}

const contextProperty = (t, val, stamp, key, property) => {
  if (val === null) {
    emit(t, key, stamp)
    t[key] = null
    removeContextKey(t, key)
    return val
  } else {
    return create(property, val, stamp, t, key)
  }
}

/**
 * @function storeContext
 * stores context for reapplying with applyContext
 * @todo: needs perf optmization
 * @return {array} returns store
 */
const storeContext = t => {
  var context = t._c
  if (context) {
    const arr = []
    let level = t._cLevel
    while (context) {
      arr.push(context, level)
      level = context._cLevel
      context = context._c
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
    for (let i = 0, target = t; i < l; i += 2) {
      let context = store[i]
      let level = store[i + 1]
      let path = [ target ]
      let newTarget = setContext(target, context, level, path)
      let struct = handleChange(target, context, path, level)
      if (ret === void 0 && struct !== void 0) {
        ret = struct
      }
      if (newTarget) target = newTarget
    }
    return ret
  } else {
    if (t._c) {
      t._c = null
      t._cLevel = null
    }
  }
}

const handleChange = (target, context, path, level) => {
  var newContext, newLevel
  var travelTaget = context
  if (context._p && context._p[context.key] === null) {
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
      segment._c = null
      segment._cLevel = null
      newContext = field
      newLevel = len - (i + 1)
    }
    travelTaget = field
    if (i === len - 1) target = travelTaget
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
    target._cLevel = level
    target._c = context
    if (level > 1) {
      let p = target._p
      for (let i = 1; p && i < level; i++) {
        if (path) { path.unshift(p) }
        p._c = context
        p._cLevel = target._cLevel - i
        p = p._p
      }
    }
    return context
  }
}

const removeContext = (target, level) => {
  if (level) {
    target._cLevel = null
    target._c = null
    if (level > 1) {
      let p = target._p
      for (let i = 1; p && i < level; i++) {
        p._c = null
        p._cLevel = null
        p = p._p
      }
    }
  }
}

// make some tests but obvisouly usefull
// const clearContext = (t, level) => {
//   var parent = t
//   var i = 0
//   if (!level) level = t._cLevel
//   while (parent && i < level) {
//     parent._c = null
//     parent._cLevel = null
//     parent = i === 1 ? parent._c : parent._p
//     i++
//   }
//   return this
// }

export { contextProperty, resolveContext, applyContext, storeContext }
