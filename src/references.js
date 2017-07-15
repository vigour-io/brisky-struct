import { set } from './manipulate'
import { listener } from './struct/listener'
import { uid } from './uid'
import { getVal } from './get'
import { removeKey } from './keys'
import { switchInheritance } from './inheritance'
import getApi from './get/api'

const reference = (t, val, stamp) => set(t, getApi(t, val.slice(1), {}, stamp))

const removeReference = (t, val) => {
  if (t.val && typeof t.val === 'object' && t.val.inherits) {
    listener(t.val.emitters.data, null, uid(t))
    removeInstances(t, val)
  }
}

const removeInstances = (t, val, override) => {
  if (t.instances) {
    let i = t.instances.length
    while (i--) {
      const instance = t.instances[i]
      if (override) {
        switchInheritance(instance, override, void 0, t)
      } else {
        override = t
      }
      if (instance.val && instance.val.inherits === getVal(t)) {
        // console.log('DELETING', getRoot(instance).key, instance.key)
        listener(instance.val.emitters.data, null, uid(instance))
        if (instance._ks) {
          removeInstances(instance, val)
          delete instance.val
        } else {
          removeInstances(instance, val, override)
          t.instances.splice(i, 1)
          delete instance._p[instance.key]
          removeKey(instance._p, instance.key)
        }
      } else {
        removeInstances(instance, val)
      }
    }
  }
}

const doesInherit = (t, r) => t === r || (t.inherits && doesInherit(t.inherits, r))

// Get local root
const getRoot = t => {
  while (t._p) {
    t = t._p
  }
  return t
}

// Get local root and path
const getRootPath = (t, path) => {
  while (t._p) {
    path.unshift(t.key)
    t = t._p
  }
  return t
}

const resolveReferences = (t, instance, stamp) => {
  const iRoot = getRoot(instance)
  const refs = t.emitters.data.struct
  var i = refs.length
  while (i--) {
    const rPath = []
    const rRoot = getRootPath(refs[i], rPath)
    if (doesInherit(iRoot.inherits, rRoot)) {
      // console.log('*ADDING', refs[i].key, '->', instance.key, rRoot.key, '->', iRoot.key)
      set(getApi(iRoot, rPath, {}), instance, stamp)
    }
  }
}

const resolveFromValue = (t, val, stamp) => {
  if (val.instances && val._p && t._p) {
    const vRoot = getRoot(val)
    const tPath = []
    const tRoot = getRootPath(t, tPath)
    if (tRoot === vRoot) {
      let i = val.instances.length
      while (i--) {
        const vinstance = val.instances[i]
        // console.log('ADDING', t.key, '->', val.key, vRoot.key, '->', getRoot(vinstance).key)
        const ref = getApi(getRoot(vinstance), tPath, {})
        if (ref._c || !ref.val) {
          set(ref, vinstance, stamp)
        }
        ref._c = null
        ref._cLevel = null
      }
    }
  }
}

export { reference, removeReference, resolveReferences, resolveFromValue }
