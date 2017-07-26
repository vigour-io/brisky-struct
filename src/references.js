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
    if (vinstance) {
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
  return fallback
}

const getRefVal = (t, context) => {
  if (t.val !== void 0) {
    const vinstance = context.c && t.val.instances &&
      vinstances(t.val.instances, realRoot(context.c))
    if (vinstance !== void 0 && vinstance !== null) {
      return vinstance
    } else {
      if (!context.c) {
        context.c = t
      }
      return t.val
    }
  } else {
    if (!context.c) {
      context.c = t
    }
    return t.inherits && getRefVal(t.inherits, context)
  }
}

export { reference, removeReference, getRefVal }
