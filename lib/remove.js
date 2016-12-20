import { removeKey, getKeys } from './keys'
import { data } from './emit'
import { removeContext } from './emit/context'
import { listener } from './struct/listener'
import uid from './uid'

const remove = (t, stamp, instance, from) => {
  if (t._async) { delete t._async }

  if (t.val && typeof t.val === 'object' && t.val.inherits) {
    listener(t.val.emitters.data, null, uid(t))
  }

  // t.val = null // test perf impact -- bit nasty....

  if (!instance && t.inherits.instances) {
    const instances = t.inherits.instances
    let i = instances.length
    while (i--) {
      if (instances[i] === t) { instances.splice(i, 1) }
    }
  }

  // remove struct emitters
  if (t.emitters && t.emitters.data && t.emitters.data.struct) {
    let s = t.emitters.data.struct.length
    while (s--) { t.emitters.data.struct[s].val = null }
  }

  if (!instance) {
    if (stamp) {
      data(t, null, stamp)
    }
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
  } else {
    if (stamp) {
      console.log('2 yo yo yo')
      data(t, null, stamp)
    }
    if (t._ks) {
      const keys = t._ks
      for (let i = 0, len = keys.length; i < len; i++) {
        if (keys[i] in t) {
          remove(t[keys[i]], stamp, false, true)
          i--
          len--
        }
      }
    }
  }

  const instances = t.instances
  if (instances) {
    let i = instances.length
    while (i--) { remove(instances[i], stamp, true) }
    t.instances = null
  }

  removeFromParent(t._p, t.key, stamp, false, from)

  return true
}

const removeFromParent = (parent, key, stamp, instance, from) => {
  console.log('hello!', key)
  if (parent && key) {
    if (!instance || parent._ks) {
      removeKey(parent, key)
      if (instance) {
        if (key in parent) { delete parent[key] }
      } else {
        parent[key] = null
      }
    }
    if (!from && stamp) {
      console.log('yo yo yo')
      data(parent, { [key]: null }, stamp)
    }
    const instances = parent.instances
    if (instances) {
      let i = instances.length
      while (i--) {
        removeFromParent(instances[i], key, stamp, true)
      }
    }
  }
}

export default remove
