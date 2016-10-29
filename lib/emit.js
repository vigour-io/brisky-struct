const onData = t => t.on && t.on.data || t.inherits && onData(t.inherits)
const { getFn } = require('./get')

const updateContext = (t, val, stamp, parent, prev, j, fn, contextFix, p) => {
  var clear
  if (parent.instances) {
    let key = prev
    let i = parent.instances.length
    while (i--) {
      if (!(key in parent.instances[i])) {
        let z = j
        let context = parent.instances[i]
        let xpath = key

        // if (contextFix) {
        //   console.log(p, context.key, contextFix.key)
        //   contextFix.context = context
        //   contextFix.contextPath = p
        // } else {
        //   t.context = context
        //   t.contextPath = xpath
        // }

        console.log(' \ncontext', t.key, contextFix && contextFix.key, parent.instances[i].key, prev, p, key)
        if (prev.context) {
          console.log('?')
        }

        while (z--) { fn[z](t, val, stamp, true) }

        clear = true

        if (parent.instances[i].parent) {
          console.log('DOUBLE POINT', prev, parent.instances[i].key)
          if (updateContext(t, val, stamp, parent.instances[i].parent, parent.instances[i].key, j, fn, parent.instances[i], [ parent.instances[i].key ])) {
            clear = true
          }
        }
      }
    }
  }
  if (parent.parent) {
    console.log(prev, parent.key, contextFix && contextFix.key)
    if (p) {
      p.unshift(parent.key)
    }
    if (updateContext(t, val, stamp, parent.parent, parent.key, j, fn, contextFix, p)) {
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
      if (updateContext(t, val, stamp, t.parent, t.key, i, listeners)) {
        // and while loop trough the contexts
        // delete t.context
        // delete t.contextPath
      }
    }
    console.log(' \nNORMAL')
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
