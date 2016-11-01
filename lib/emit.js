const onData = t => t.on && t.on.data || t.inherits && onData(t.inherits)
const onGeneric = (t, key) => t.on && t.on[key] || t.inherits && onGeneric(t.inherits, key)
const { getFn } = require('./get')

const updateContext = (context, t, val, stamp, key, resolve, level, j, fn) => {
  if (!(key in context)) {
    let z = j
    resolve.context = context
    resolve.contextLevel = level
    while (z--) { fn[z](t, val, stamp, true) }
    if (context.parent) {
      if (emitContext(t, val, stamp, context.parent, context.key, context, 1, j, fn)) {
        context.context = null
        context.contextPath = null
      }
    }
    if (context.instances) {
      let i = context.instances.length
      while (i--) {
        updateContext(context.instances[i], t, val, stamp, key, resolve, level, j, fn)
      }
    }
    return true
  }
}

const emitContext = (t, val, stamp, parent, key, resolve, level, j, fn) => {
  var clear
  if (parent.instances) {
    let i = parent.instances.length
    while (i--) {
      if (updateContext(parent.instances[i], t, val, stamp, key, resolve, level, j, fn)) {
        clear = true
      }
    }
  }
  if (parent.parent) {
    if (emitContext(t, val, stamp, parent.parent, parent.key, resolve, level + 1, j, fn)) {
      clear = true
    }
  }
  return clear
}

const fn = (t, val, stamp, emitter) => {
  const listeners = getFn(emitter)
  if (listeners) {
    let i = listeners.length
    if (i && t.parent) {
      if (emitContext(t, val, stamp, t.parent, t.key, t, 1, i, listeners)) {
        t.context = null
        t.contextPath = null
      }
    }
    while (i--) { listeners[i](t, val, stamp) }
  } else {
    emitter.listeners = []
  }
}

const data = (t, val, stamp) => {
  const own = t.on && t.on.data
  if (own) {
    const struct = own.struct
    fn(t, val, stamp, own)
    if (struct) {
      let i = struct.length
      while (i--) { updateStruct(struct[i], val, stamp) }
    }
  } else {
    const emitter = onData(t.inherits)
    if (emitter) {
      fn(t, val, stamp, emitter)
    }
  }
}

const updateStruct = (t, val, stamp) => {
  data(t, val, stamp)
  if (t.instances) {
    let i = t.instances.length
    while (i--) { updateStruct(t.instances[i], val, stamp) }
  }
}

const generic = (t, type, val, stamp) => {
  // rewrite type (helper)
  if (type === 'data') {
    data(t, val, stamp)
  } else {
    const emitter = onGeneric(t, type)
    if (emitter) { fn(t, val, stamp, emitter) }
  }
}

exports.data = data
exports.generic = generic
