import { getFn } from './get'

const onData = t => t.emitters && t.emitters.data ||
  t.inherits && onData(t.inherits)

const onGeneric = (t, key) => t.emitters && t.emitters[key] ||
  t.inherits && onGeneric(t.inherits, key)

const updateContext = (context, t, val, stamp, key, resolve, level, j, fn) => {
  if (!(key in context)) {
    let n = j
    if (resolve.context !== context) {
      resolve.context = context
      resolve.contextLevel = level
      setStamp(context, stamp)
      console.log('!!!CONTEXT!!!')
      while (n--) { fn[n](val, stamp, t) }
      if (context._p) {
        if (execContext(t, val, stamp, context._p, context.key, context, 1, j, fn)) {
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

// call it do context -- also need to handle instances in the same way (since they exclude)
const execContext = (t, val, stamp, parent, key, resolve, level, j, fn) => {
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
      if (execContext(t, val, stamp, parent._p, parent.key, resolve, level + 1, j, fn)) {
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
      if (execContext(t, val, stamp, t._p, t.key, t, 1, i, listeners)) {
        t.context = null
        t.contextPath = null
      }
    }
    while (i--) { listeners[i](val, stamp, t) }
  } else {
    emitter.listeners = []
  }
}

const execSubs = (p, stamp) => {
  let i = p.subscriptions.length
  while (i--) { p.subscriptions[i](stamp) }
}

const setStamp = (t, stamp) => {
  t.tStamp = stamp
  if (t._p || t.context) {
    let p = t._p
    if (t.context && t.contextLevel === 1) {
      p = t.context
    }
    while (p && p.tStamp !== stamp) {
      p.tStamp = stamp
      if (p.emitters && p.emitters.data && p.emitters.data.struct) {
        let i = p.emitters.data.struct.length
        while (i--) {
          setStamp(p.emitters.data.struct[i], stamp)
        }
      }
      if (p.subscriptions) { execSubs(p, stamp) }
      if (p.context && p.contextLevel === 1) {
        p = t.context
      } else {
        p = p._p
      }
    }
  }
  if (t.subscriptions) {
    execSubs(t, stamp)
  }
}

const data = (t, val, stamp) => {
  // if ! emitter still need to do context updates
  if (t.stamp !== stamp) {
    t.stamp = stamp
    setStamp(t, stamp)
    const own = t.emitters && t.emitters.data
    if (own) {
      const struct = own.struct
      // test this! for context and subs
      fn(t, val, stamp, own)
      if (struct) {
        let i = struct.length
        while (i--) { updateStruct(struct[i], val, stamp) }
      }
    } else {
      const emitter = onData(t.inherits)
      if (emitter) {
      // test this! for context and subs
        fn(t, val, stamp, emitter)
      } else {
        console.log('still need to do CONTEXT')
        if (t._p) {
          if (execContext(t, val, stamp, t._p, t.key, t, 1, 0)) {
            t.context = null
            t.contextPath = null
          }
        }
      }
    }
  }
}

const updateStruct = (t, val, stamp) => {
  // should allready update all tStamps
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

export { onData, data, generic }
