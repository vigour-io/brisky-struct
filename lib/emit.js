const onData = t => t.on && t.on.data || t.inherits && onData(t.inherits)
const { getFn } = require('./get')

const updateContext = (t, val, stamp, parent, prev, resolve, level, j, fn) => {
  var clear
  if (parent.instances) {
    let key = prev
    let i = parent.instances.length
    while (i--) {
      let instance = parent.instances[i]
      if (!(key in instance)) {
        let z = j
        let context = instance
        resolve.context = context
        resolve.contextLevel = level
        while (z--) { fn[z](t, val, stamp, true) }
        clear = true
        if (instance.parent) {
          if (updateContext(t, val, stamp, instance.parent, instance.key, instance, 1, j, fn)) {
            instance.context = null
            instance.contextPath = null
          }
        }
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
