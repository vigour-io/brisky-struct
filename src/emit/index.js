import { getFn, getData } from '../get'
import { exec as context, virtual } from './context'
import subscription from './subscription'
import { root, path } from '../traversal'
import getApi from '../get/api'

const onGeneric = (t, key) => t.emitters && t.emitters[key] ||
  t.inherits && onGeneric(t.inherits, key)

const overrideSubscription = (t, override, stamp, isNew) => {
  t.stamp = override
  subscription(t, stamp)
  if (t._p && !isNew) {
    if (context(t, void 0, stamp, t._p, t.key, t, 1, 0)) {
      t._c = null
      t._cLevel = null
    }
  }
}

const fn = (t, val, stamp, emitter, noContext) => {
  const listeners = getFn(emitter)
  if (listeners) {
    let i = listeners.length
    if (i && t._p && !noContext) {
      if (context(t, val, stamp, t._p, t.key, t, 1, i, listeners)) {
        let clear = t
        while (clear && clear._c) {
          clear._c = null
          clear._cLevel = null
          clear = clear._p
        }
      }
    }
    while (i--) { listeners[i](val, stamp, t) }
  } else {
    emitter.listeners = []
  }
}

const data = (t, val, stamp, override, isNew) => {
  if (!t.stamp || t.stamp !== stamp) {
    t.stamp = override || stamp
    subscription(t, stamp)
    const own = t.emitters && t.emitters.data
    const refs = t.inherits && t.inherits.emitters &&
      t.inherits.emitters.data && t.inherits.emitters.data.struct
    if (refs) {
      let i = refs.length
      while (i--) {
        const pRoot = root(refs[i], true)
        const pPath = path(refs[i], true)
        if (pRoot.key) pPath.shift()

        const fakeRef = getApi(root(t, true), pPath)
        if (root(t.inherits, true) === pRoot && fakeRef === refs[i]) {
          console.log('time to go')
        }
        if (refs[i]._p) {
          if (virtual()) {
            refs[i]._c = null
            refs[i]._cLevel = null
          }
        }
      }
    }
    if (own) {
      const struct = own.struct
      fn(t, val, stamp, own)
      if (struct) {
        let i = struct.length
        while (i--) { updateStruct(struct[i], val, stamp, override) }
      }
    } else {
      const emitter = getData(t.inherits)
      if (emitter) {
        fn(t, val, stamp, emitter)
      } else {
        if (t._p && !isNew) {
          if (context(t, val, stamp, t._p, t.key, t, 1, 0)) {
            t._c = null
            t._cLevel = null
          }
        }
      }
    }
  }
}

const updateStruct = (t, val, stamp, override) => {
  data(t, val, stamp, override)
  if (t.instances) {
    let i = t.instances.length
    while (i--) {
      if (t.instances[i].val === void 0) {
        updateStruct(t.instances[i], val, stamp, override)
      }
    }
  }
}

const generic = (t, type, val, stamp) => {
  if (type === 'data') {
    data(t, val, stamp)
  } else {
    const emitter = onGeneric(t, type)
    if (emitter) { fn(t, val, stamp, emitter, true) }
  }
}

export { data, generic, overrideSubscription }
