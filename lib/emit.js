const onData = t => t.on && t.on.data || t.inherits && onData(t.inherits)
const { getFn } = require('./get')

const emitContextInstance = (context, t, val, stamp, key, resolve, level, j, fn) => {
  var clear
  if (!(key in context)) {
    let z = j
    resolve.context = context
    resolve.contextLevel = level
    while (z--) { fn[z](t, val, stamp, true) }
    clear = true
    if (context.parent) {
      if (updateContext(t, val, stamp, context.parent, context.key, context, 1, j, fn)) {
        context.context = null
        context.contextPath = null
      }
    }
    if (context.instances) {
      let i = context.instances.length
      while (i--) {
        emitContextInstance(context.instances[i], t, val, stamp, key, resolve, level, j, fn)
      }
    }
  }
  return clear
}

const updateContext = (t, val, stamp, parent, key, resolve, level, j, fn) => {
  var clear
  if (parent.instances) {
    let i = parent.instances.length
    while (i--) {
      if (emitContextInstance(parent.instances[i], t, val, stamp, key, resolve, level, j, fn)) {
        clear = true
      }
    }
  }
  if (parent.parent) {
    if (updateContext(t, val, stamp, parent.parent, parent.key, resolve, level + 1, j, fn)) {
      clear = true
    }
  }
  return clear
}

const fn = (t, val, stamp, emitters) => {
  const listeners = getFn(emitters)
  if (listeners) {
    let i = listeners.length
    if (i && t.parent) {
      if (updateContext(t, val, stamp, t.parent, t.key, t, 1, i, listeners)) {
        t.context = null
        t.contextPath = null
      }
    }
    while (i--) { listeners[i](t, val, stamp) }
  } else {
    emitters.listeners = []
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
    const emitters = onData(t.inherits)
    if (emitters) {
      fn(t, val, stamp, emitters)
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
    // do generic emit
  }
}

exports.data = data
exports.generic = generic
