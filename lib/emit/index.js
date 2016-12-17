import { getFn, getData } from '../get'
import { exec as context } from './context'
import subscription from './subscription'

const onGeneric = (t, key) => t.emitters && t.emitters[key] ||
  t.inherits && onGeneric(t.inherits, key)

const fn = (t, val, stamp, emitter) => {
  const listeners = getFn(emitter)
  if (listeners) {
    let i = listeners.length
    if (i && t._p) {
      if (context(t, val, stamp, t._p, t.key, t, 1, i, listeners)) {
        t.context = null
        t.contextLevel = null
      }
    }
    while (i--) { listeners[i](val, stamp, t) }
  } else {
    emitter.listeners = []
  }
}

const data = (t, val, stamp, isNew) => {
  if (t.stamp !== stamp) {
    t.stamp = stamp
    subscription(t, stamp)
    const own = t.emitters && t.emitters.data
    if (own) {
      const struct = own.struct
      fn(t, val, stamp, own)
      if (struct) {
        let i = struct.length
        while (i--) { updateStruct(struct[i], val, stamp) }
      }
    } else {
      const emitter = getData(t.inherits)
      if (emitter) {
        fn(t, val, stamp, emitter)
      } else {
        if (t._p && !isNew) {
          if (context(t, val, stamp, t._p, t.key, t, 1, 0)) {
            t.context = null
            t.contextLevel = null
          }
        }
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

export { data, generic }
