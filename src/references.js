import { set } from './manipulate'
import { listener } from './struct/listener'
import { uid } from './uid'
import getApi from './get/api'

const removeReference = t => {
  if (t.val && typeof t.val === 'object' && t.val.inherits) {
    listener(t.val.emitters.data, null, uid(t))
  }
}

const reference = (t, val, stamp) => set(t, getApi(t, val.slice(1), {}, stamp))

// Lookup until root of master
// to find a given ancestor
const rootDiff = (t, r, diff) => (t === r && diff) || (t._p && rootDiff(t._p, r, diff + 1))

// Get local root
const getRoot = t => {
  var root = t
  while (root._p) {
    root = root._p
  }
  return root
}

// Get local root and reversed path
const getRootPath = (t, path) => {
  var root = t
  while (root._p) {
    path.push(root.key)
    root = root._p
  }
  return root
}

// When there's no local references
// there can be still inherited references
const resolveReferences = (t, instance, stamp) => {
  const iRoot = getRoot(instance)
  const refs = t.emitters.data.struct
  var i = refs.length
  while (i--) {
    const rPath = []
    const rRoot = getRootPath(refs[i], rPath)
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

export { removeReference, reference, resolveReferences }
