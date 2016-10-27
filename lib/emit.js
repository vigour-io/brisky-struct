const onData = t => t.on && t.on.data || t.inherits && onData(t.inherits)
const { getFn, getStruct } = require('./get')

// think about the copying
const updateContext = (t, val, stamp, parent, prev, level, j, fn) => {
  if (parent.instances) {
    console.log('yo', level)
    let key = prev.key
    let i = parent.instances.length
    while (--i > -1) {
      if (!(key in parent.instances[i])) {
        // set context and emit
        console.log('????', parent.instances[i].key)
        let z = j
        while (--z > -1) { fn[z](t, val, stamp) }
        if (parent.instances[i].parent) {
          console.log('go')
          updateContext(t, val, stamp, parent.instances[i].parent, parent.instances[i], level + 1, j, fn)
        }
      }
    }
  }
  if (parent.parent) {
    console.log('go')
    updateContext(t, val, stamp, parent.parent, parent, level + 1, j, fn)
  }
}

const fn = (t, val, stamp, emitters) => {
  const listeners = getFn(emitters)
  if (listeners) {
    let i = listeners.length
    if (i && t.parent) {
      updateContext(t, val, stamp, t.parent, t, 1, i, listeners)
    }
    while (--i > -1) { listeners[i](t, val, stamp) }
  } else {
    emitters.listeners = []
  }
}

const data = (t, val, stamp) => {
  const emitters = onData(t)
  if (emitters) {
    const struct = getStruct(emitters)
    fn(t, val, stamp, emitters)
    if (struct) {
      let i = struct.length
      while (--i > -1) { data(struct[i], val, stamp) }
    } else {
      emitters.struct = []
    }
  }
}

const dataFn = (t, val, stamp) => {
  const emitters = onData(t)
  if (emitters) { fn(t, val, stamp, emitters) }
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
exports.dataFn = dataFn
exports.generic = generic
