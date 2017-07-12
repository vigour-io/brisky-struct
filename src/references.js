import { set } from './manipulate'
import { listener } from './struct/listener'
import { uid } from './uid'
import { getVal } from './get'
import getApi from './get/api'

const reference = (t, val, stamp) => set(t, getApi(t, val.slice(1), {}, stamp))

const removeReference = t => {
  if (t.val && typeof t.val === 'object' && t.val.inherits) {
    listener(t.val.emitters.data, null, uid(t))
  }
}

// Get local root
const getRoot = t => {
  var root = t
  while (root._p) {
    root = root._p
  }
  return root
}

// Get local root and reversed path
const getRootPathRev = (t, path) => {
  var root = t
  while (root._p) {
    path.push(root.key)
    root = root._p
  }
  return root
}

// Get local root and path
const getRootPath = (t, path) => {
  var root = t
  while (root._p) {
    path.unshift(root.key)
    root = root._p
  }
  return root
}

const resolveReferences = (t, instance, stamp) => {
  const iRoot = getRoot(instance)
  const refs = t.emitters.data.struct
  var i = refs.length
  while (i--) {
    const rPath = []
    const rRoot = getRootPathRev(refs[i], rPath)
    if (iRoot.inherits === rRoot) {
      let bind
      let s = iRoot
      let j = rPath.length
      while (j--) {
        bind = s
        s = s[rPath[j]]
        if (!s) {
          set(bind, { [rPath[j]]: {} })
          s = bind[rPath[j]]
        }
      }
      set(s, instance, stamp)
    }
  }
}

const resolveFromValue = (t, val, stamp) => {
  if (val.instances && val._p && t._p) {
    const vPath = []
    const vRoot = getRootPath(val, vPath)
    const tPath = []
    const tRoot = getRootPath(t, tPath)
    const rootInstances = vRoot.instances
    if (rootInstances && tRoot === vRoot) {
      let i = rootInstances.length
      while (i--) {
        const field = getApi(rootInstances[i], vPath, void 0, void 0, true)
        if (field !== val) {
          const instance = getApi(rootInstances[i], tPath)
          if (instance && getVal(instance) === val) {
            set(instance, field, stamp)
          }
          instance._c = null
          instance._cLevel = null
          field._c = null
          field._cLevel = null
        }
      }
    }
  }
}

export { reference, removeReference, resolveReferences, resolveFromValue }
