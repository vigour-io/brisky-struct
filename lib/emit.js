const { getFn } = require('./get')

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
      while (n--) { fn[n](t, val, stamp, true) }
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

// need to be able to pass a tStamp (void 0 for incoming hub stuff)
/*
if (parent._emitters._data.base) {
  parent._emitters._data.base.each(function (p) {
    looper(p, val, stamp)
  })
}
*/

// needs base and ofc context! and instances!
// so emitters seem pretty perfect for this job...

const execSubs = (p, stamp) => {
  let i = p.subscriptions.length
  while (i--) { p.subscriptions[i](stamp) }
}

// this is wrong need to do it differently
const setStamp = (t, stamp) => {
  t.stamp = t.tStamp = stamp
  if (t._p) {
    let p = t._p
    while (p && p.tStamp !== stamp) {
      // need to update t.stamps on things that are referenced
      // also need to handle stamp + tStamp
      p.tStamp = stamp
      // can also be on thing it inherits from ?
      // no exception for subs
      if (p.subscriptions) { execSubs(p, stamp) }
      p = p._p
    }
  }
  if (t.subscriptions) {
    execSubs(t, stamp)
  }
}

const data = (t, val, stamp) => {
  if (t.stamp !== stamp) {
    setStamp(t, stamp)
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
      if (emitter) { fn(t, val, stamp, emitter) }
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

exports.onData = onData
exports.data = data
exports.generic = generic
