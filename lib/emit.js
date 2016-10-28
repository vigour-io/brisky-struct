const onData = t => t.on && t.on.data || t.inherits && onData(t.inherits)
const { getFn, getStruct } = require('./get')

const updateContext = (t, val, stamp, parent, prev, level, j, fn) => {
  if (parent.instances) {
    let key = prev.key
    let i = parent.instances.length
    while (i--) {
      if (!(key in parent.instances[i])) {
        let z = j
        // we need the path if this is the case else it starts to fail fast
        // pretty heavy unfoturnately
        // try to find a fast wat to do it
        // console.log('level', level)
        while (z--) { fn[z](t, val, stamp) }
        if (parent.instances[i].parent) {
          updateContext(t, val, stamp, parent.instances[i].parent, parent.instances[i], level + 1, j, fn)
        }
      }
    }
  }
  if (parent.parent) {
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
    while (i--) { listeners[i](t, val, stamp) }
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
      while (i--) { data(struct[i], val, stamp) }
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
