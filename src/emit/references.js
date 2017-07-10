import { getFn, getData } from '../get'

const fn = (t, val, stamp) => {
  const emitter = getData(t)
  if (emitter) {
    const listeners = getFn(emitter)
    if (listeners) {
      let i = listeners.length
      while (i--) {
        listeners[i](val, stamp, t)
      }
      let clear = t
      while (clear && clear._c) {
        clear._c = null
        clear._cLevel = null
        clear = clear._p
      }
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
        const ref = refs[i]
        ref._c = c
        ref._cLevel = j + 1
        fn(ref, val, stamp)
        let localRefs = ref.emitters &&
            ref.emitters.data &&
            ref.emitters.data.struct
        if (localRefs) iterate(localRefs, val, stamp, oRoot, tRoot)
        context(ref, val, stamp, oRoot)
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
