import { set } from './manipulate'
import { listener } from './struct/listener'
import { uid } from './uid'
import { setPathContext } from './context'
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
        fallback = instances[i]
      }
    }
  }
  if (fallback) {
    setPathContext(fallback, cRoot)
  }
  return fallback
}

const getRefVal = (t, struct, noContext) => {
  if (t.val !== void 0 && t.val !== null) {
    const vinstance = t._rc && t.val.instances &&
      vinstances(t.val.instances, realRoot(t._rc))
    if (vinstance) {
      t._rc = void 0
      return vinstance
    } else if (t.val && t.val.inherits) {
      if (t._c && !noContext) {
        setPathContext(t.val, t._c)
      }
      t.val._rc = t._rc || t._c || t
      return t.val
    } else if (!struct) {
      return t.val
    }
  } else if (t.inherits) {
    t.inherits._rc = t._rc || t._c || t
    t._rc = void 0
    const result = getRefVal(t.inherits, struct, noContext)
    if (!noContext && result && result.inherits) {
      result._c = t
      result._cLevel = 1
    }
    return result
  } else if (t._rc) {
    t._rc = void 0
  }
}

export { reference, removeReference, getRefVal }
