import { set } from './manipulate'
import { listener } from './struct/listener'
import { uid } from './uid'
import { realRoot } from './traversal'
import getApi from './get/api'

const reference = (t, val, stamp) => set(t, getApi(t, val.slice(1), {}, stamp))

const removeReference = t => {
  if (t.val && typeof t.val === 'object' && t.val.inherits) {
    listener(t.val.emitters.data, null, uid(t))
  }
}

const vinstances = (instances, cRoot) => {
  let i = instances.length
  let fallback
  while (i--) {
    const vinstance = instances[i].instances &&
      vinstances(instances[i].instances, cRoot)
    if (vinstance !== void 0) {
      return vinstance
    } else {
      const vRoot = realRoot(instances[i])
      if (cRoot === vRoot) {
        return instances[i]
      } else if (cRoot.inherits === vRoot) {
        if (global.DEBUG) console.log('fallback need context')
        fallback = instances[i]
      }
    }
  }
  return fallback
}

const getRefVal = (t, struct, noContext) => {
  if (t.val !== void 0 && t.val !== null) {
    if (t._rc) {
      const vinstance = t.val.instances &&
        vinstances(t.val.instances, realRoot(t._rc))
      if (vinstance !== void 0) {
        t._rc = null
        return vinstance
      } else if (struct && !(t && t.val.inherits)) {
        return t
      } else {
        return t.val
      }
    } else if (struct && !(t && t.val.inherits)) {
      t._rc = t
      return t
    } else {
      t._rc = t
      return t.val
    }
  } else if (t.inherits) {
    t.inherits._rc = t._rc || t
    t._rc = null
    const result = getRefVal(t.inherits, struct, noContext)
    if (!noContext && result && result.inherits) {
      result._c = t
      result._cLevel = 1
    }
    return result
  } else if (t._rc) {
    t._rc = null
  }
}

export { reference, removeReference, getRefVal }
