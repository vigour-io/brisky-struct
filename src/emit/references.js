import { getFn, getData } from '../get'

const fn = (t, val, stamp, c, cLevel) => {
  const emitter = getData(t)
  if (emitter) {
    const listeners = getFn(emitter)
    if (listeners) {
      t._c = c
      t._cLevel = cLevel
      let i = listeners.length
      while (i--) {
        listeners[i](val, stamp, t)
      }
      t._c = null
      t._cLevel = null
    } else {
      emitter.listeners = []
    }
  }
}

const doesInherit = (t, r) => t.inherits && (t.inherits === r || doesInherit(t.inherits, r))

const getRoot = (t) => {
  let root = t
  while (root._p) {
    root = root._p
  }
  return root
}

const getRootPath = (t, path) => {
  let root = t
  while (root._p) {
    path.push(root.key)
    root = root._p
  }
  return root
}

const iterate = (refs, val, stamp, oRoot, tRoot) => {
  let i = refs.length
  while (i--) {
    let rPath = []
    const rRoot = getRootPath(refs[i], rPath)
    if (rRoot) {
      let c = oRoot
      if (tRoot === rRoot || doesInherit(tRoot, rRoot)) {
        let j = rPath.length
        let next = c
        while (next) {
          c = next
          next = c[rPath[j--]]
        }
        fn(refs[i], val, stamp, c, j + 1)
        let localRefs = refs[i].emitters &&
            refs[i].emitters.data &&
            refs[i].emitters.data.struct
        if (localRefs) iterate(localRefs, val, stamp, oRoot, tRoot)
        context(refs[i], val, stamp, oRoot)
      }
    }
  }
}

const context = (t, val, stamp, oRoot) => {
  if (t.inherits) {
    if (!oRoot) {
      oRoot = getRoot(t)
    }
    const contextRefs =
      t.inherits.emitters &&
      t.inherits.emitters.data &&
      t.inherits.emitters.data.struct
    if (contextRefs) {
      iterate(contextRefs, val, stamp, oRoot, getRoot(t))
    }
    context(t.inherits, val, stamp, oRoot)
  }
}

export default context
