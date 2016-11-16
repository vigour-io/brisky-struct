const onData = t => t.emitters && t.emitters.data || t.inherits && onData(t.inherits)
const onGeneric = (t, key) => t.emitters && t.emitters[key] || t.inherits && onGeneric(t.inherits, key)
const { getFn } = require('./get')

const updateContext = (context, t, val, stamp, key, resolve, level, j, fn) => {
  if (!(key in context)) {
    let z = j
    if (resolve.context !== context) {
      resolve.context = context
      resolve.contextLevel = level
      while (z--) { fn[z](t, val, stamp, true) }
      if (context._p) {
        if (emitContext(t, val, stamp, context._p, context.key, context, 1, j, fn)) {
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
    }
    return true
  }
}

const emitContext = (t, val, stamp, parent, key, resolve, level, j, fn) => {
  var clear
  if (parent._c !== t) {
    if (parent.instances) {
      let i = parent.instances.length
      while (i--) {
        if (updateContext(parent.instances[i], t, val, stamp, key, resolve, level, j, fn)) {
          clear = true
        }
      }
    }
    if (parent._p) {
      if (emitContext(t, val, stamp, parent._p, parent.key, resolve, level + 1, j, fn)) {
        clear = true
      }
    }
  }
  return clear
}

const fn = (t, val, stamp, emitter) => {
  const listeners = getFn(emitter)
  if (listeners) {
    let i = listeners.length
    if (i && t._p) {
      if (emitContext(t, val, stamp, t._p, t.key, t, 1, i, listeners)) {
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
  if (t.stamp !== stamp) {
    t.stamp = stamp
    const own = t.emitters && t.emitters.data
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
}

const updateStruct = (t, val, stamp) => {
  data(t, val, stamp)
  if (t.instances) {
    let i = t.instances.length
    while (i--) {
      if (t.instances[i].val === void 0) {
        updateStruct(t.instances[i], val, stamp)
      }
    }
  }
}

const generic = (t, type, val, stamp) => {
  if (type === 'data') {
    data(t, val, stamp)
  } else {
    const emitter = onGeneric(t, type)
    if (emitter) { fn(t, val, stamp, emitter) }
  }
}

exports.onData = onData
exports.data = data
exports.generic = generic
