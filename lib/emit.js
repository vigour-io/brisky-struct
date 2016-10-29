const onData = t => t.on && t.on.data || t.inherits && onData(t.inherits)
const { getFn } = require('./get')

const updateContext = (t, val, stamp, parent, prev, j, fn, resolve, level) => {
  var clear
  if (parent.instances) {
    let key = prev
    let i = parent.instances.length
    while (i--) {
      if (!(key in parent.instances[i])) {
        let z = j
        let context = parent.instances[i]
        resolve.context = context
        resolve.contextLevel = level
        while (z--) { fn[z](t, val, stamp, true) }
        clear = true
        if (parent.instances[i].parent) {
          if (updateContext(t, val, stamp, parent.instances[i].parent, parent.instances[i].key, j, fn, parent.instances[i], 1)) {
            // need to clear of course
          }
        }
      }
    }
  }
  if (parent.parent) {
    if (updateContext(t, val, stamp, parent.parent, parent.key, j, fn, resolve, level + 1)) {
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
      if (updateContext(t, val, stamp, t.parent, t.key, i, listeners, t, 1)) {
        delete t.context
        delete t.contextPath
      }
    }
    console.log('-------------')
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
