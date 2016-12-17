import { getFn, getData, get } from '../get'
import { getKeys } from '../keys'
import subscription from './subscription'

const strip = (t) => {
  while (t && t.context) {
    t.context = null
    t.contextLevel = null
    t = t._p
  }
}

const update = (context, t, val, stamp, key, resolve, level, j, fn) => {
  if (!(key in context)) {
    let n = j
    if (n) { strip(context) }
    resolve.context = context
    resolve.contextLevel = level
    subscription(context, stamp)
    while (n--) { fn[n](val, stamp, t) }
    if (context._p) {
      if (exec(t, val, stamp, context._p, context.key, context, 1, j, fn)) {
        context.context = null
        context.contextLevel = null
      }
    }
    if (context.instances) {
      let i = context.instances.length
      while (i--) {
        update(context.instances[i], t, val, stamp, key, resolve, level, j, fn)
      }
    }
    return true
  }
}

const exec = (t, val, stamp, parent, key, resolve, level, j, fn) => {
  var clear
  if (parent.instances) {
    let i = parent.instances.length
    while (i--) {
      if (update(parent.instances[i], t, val, stamp, key, resolve, level, j, fn)) {
        clear = true
      }
    }
  }
  if (parent._p) {
    if (exec(t, val, stamp, parent._p, parent.key, resolve, level + 1, j, fn)) {
      clear = true
    }
  }
  return clear
}

// removal
const remove = (t, stamp) => {
  const data = getData(t)
  if (data) {
    const fn = getFn(data)
    if (fn) {
      let i = fn.length
      while (i--) { fn[i](null, stamp, t) }
    }
  }
  const keys = getKeys(t)
  if (keys) {
    for (let i = 0, len = keys.length; i < len; i++) {
      let nest = get(t, keys[i])
      if (nest) {
        remove(nest, stamp)
        nest.context = null
        nest.contextLevel = null
      }
    }
  }
}

const updateRemove = (context, t, stamp, key, resolve, level) => {
  if (!(key in context)) {
    resolve.context = context
    resolve.contextLevel = level
    subscription(context, stamp)
    remove(t, stamp)
    if (context._p) {
      if (execRemove(t, stamp, context._p, context.key, context, 1)) {
        context.context = null
        context.contextLevel = null
      }
    }
    if (context.instances) {
      let i = context.instances.length
      while (i--) {
        updateRemove(context.instances[i], t, stamp, key, resolve, level)
      }
    }
    return true
  }
}

const execRemove = (t, stamp, context, key, resolve, level) => {
  var clear
  if (context.instances) {
    let i = context.instances.length
    while (i--) {
      if (updateRemove(context.instances[i], t, stamp, key, resolve, level)) {
        clear = true
      }
    }
  }
  if (context._p) {
    if (execRemove(t, stamp, context._p, context.key, resolve, level + 1)) {
      clear = true
    }
  }
  return clear
}

const removeContext = (context, key, stamp) => {
  const t = get(context, key)
  if (t) {
    updateRemove(context, t, stamp, key, t, 1)
    t.context = null
    t.contextLevel = null
  }
}

export { removeContext, exec }
