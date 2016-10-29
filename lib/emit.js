const onData = t => t.on && t.on.data || t.inherits && onData(t.inherits)
const { getFn } = require('./get')

const updateContext = (t, val, stamp, parent, prev, j, fn, path) => {
  var clear
  if (parent.instances) {
    let key = prev.key
    let i = parent.instances.length
    while (i--) {
      if (!(key in parent.instances[i])) {
        let z = j
        let context = parent.instances[i]
        if (!path) {
          path = [ key ]
        } else {
          // path.un
        }
        t.context = context
        t.contextPath = path
        console.log('context', path, parent.instances[i].key)

        while (z--) { fn[z](t, val, stamp, true) }

        clear = true

        if (parent.instances[i].parent) {
          if (updateContext(t, val, stamp, parent.instances[i].parent, parent.instances[i], j, fn)) {
            clear = true
          }
        }
      }
    }
  }
  if (parent.parent) {
    if (updateContext(t, val, stamp, parent.parent, parent, j, fn)) {
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
      if (updateContext(t, val, stamp, t.parent, t, i, listeners)) {
        // and while loop trough the contexts
        delete t.context
        delete t.contextPath
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
