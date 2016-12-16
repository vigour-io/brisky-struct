import { get } from './get'
import { removeKey, getKeys } from './keys'
import { data, removeContext as emitRemoveContext } from './emit'
import { listener } from './struct/listener'
import uid from './uid'

const remove = (t, stamp, instance, from) => {
  console.log('yo yo yo 2')

  if (t._async) { delete t._async }

  if (t.val && typeof t.val === 'object' && t.val.inherits) {
    listener(t.val.emitters.data, null, uid(t))
  }

  if (!instance && t.inherits.instances) {
    const instances = t.inherits.instances
    let i = instances.length
    while (i--) {
      if (instances[i] === t) { instances.splice(i, 1) }
    }
  }

  const instances = t.instances
  if (instances) {
    let i = instances.length
    while (i--) { remove(instances[i], stamp, true) }
    t.instances = null
  }

  // remove struct emitters
  if (t.emitters && t.emitters.data && t.emitters.data.struct) {
    let s = t.emitters.data.struct.length
    while (s--) { t.emitters.data.struct[s].val = null }
  }

  if (stamp) {
    data(t, null, stamp)
    if (t._ks) {
      const keys = t._ks
      for (let i = 0, len = keys.length; i < len; i++) {
        if (keys[i] in t) {
          remove(t[keys[i]], stamp, false, true)
          i--
          len--
        } else {
          removeContext(t, keys[i], stamp)
        }
      }
    } else {
      const keys = getKeys(t)
      if (keys) {
        for (let i = 0, len = keys.length; i < len; i++) {
          removeContext(t, keys[i], stamp)
        }
      }
    }
  } else if (t._ks) {
    const keys = t._ks
    for (let i = 0, len = keys.length; i < len; i++) {
      if (keys[i] in t) {
        remove(t[keys[i]], stamp, false, true)
        i--
        len--
      }
    }
  }

  removeFromParent(t._p, t.key, stamp, false, from)
}

const removeFromParent = (parent, key, stamp, instance, from) => {
  if (parent && key) {
    if (!instance || parent._ks) {
      removeKey(parent, key)
      if (instance) {
        if (key in parent) { delete parent[key] }
      } else {
        parent[key] = null
      }
    }
    if (!from && stamp) { data(parent, null, stamp) }
    const instances = parent.instances
    if (instances) {
      let i = instances.length
      while (i--) {
        removeFromParent(instances[i], key, stamp, true)
      }
    }
  }
}

const removeContext = (context, key, stamp) => {
  const t = get(context, key)
  if (t) {
    emitRemoveContext(t, key, stamp)
    const keys = getKeys(t)
    if (keys) {
      for (let i = 0, len = keys.length; i < len; i++) {
        // fire for all
        removeContext(t, keys[i], stamp)
      }
    }
    t.context = null
    t.contextLevel = null
  }
}

export { remove, removeContext }
