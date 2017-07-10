import { getFn, getData } from '../get'

// Fire emitters in context
// then clean the context
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

// Lookup until root of master
// to find a given ancestor
const isAncestor = (t, r, cache) => ((
  t.inherits && (t.inherits === r || isAncestor(t.inherits, r, cache))
) || (
  t._p && (t._p === r || isAncestor(t._p, r, cache))
)) && cache.y.push(r)

// Get local root
const getRoot = (t) => {
  let root = t
  while (root._p) {
    root = root._p
  }
  return root
}

// Get local root and reversed path
const getRootPath = (t, path) => {
  let root = t
  while (root._p) {
    path.push(root.key)
    root = root._p
  }
  return root
}

// Iterate over given references list
// and fire emitters if conditions are met
const iterate = (refs, val, stamp, oRoot, cache) => {
  let i = refs.length
  while (i--) {
    let rPath = []
    const rRoot = getRootPath(refs[i], rPath)
    if (~cache.n.indexOf(rRoot)) {
      // pass
    } else if (~cache.y.indexOf(rRoot) || isAncestor(oRoot, rRoot, cache)) {
      let c = oRoot
      let j = rPath.length
      let prev = c
      while (j--) {
        prev = c
        c = c[rPath[j]]
        if (c === void 0) {
          fn(refs[i], val, stamp, prev, j + 1)
          let localRefs = refs[i].emitters &&
            refs[i].emitters.data &&
            refs[i].emitters.data.struct
          if (localRefs) {
            iterate(localRefs, val, stamp, oRoot, cache)
          }
          context(refs[i], val, stamp, oRoot, cache)
          break
        }
      }
    } else {
      cache.n.push(rRoot)
    }
  }
}

// When there's no local references
// there can be still inherited references
const context = (t, val, stamp, oRoot, cache) => {
  if (t.inherits) {
    if (!oRoot) {
      oRoot = getRoot(t)
      cache = { y: [], n: [] }
    }
    const contextRefs =
      t.inherits.emitters &&
      t.inherits.emitters.data &&
      t.inherits.emitters.data.struct
    if (contextRefs) {
      iterate(contextRefs, val, stamp, oRoot, cache)
    }
    context(t.inherits, val, stamp, oRoot, cache)
  }
}

export default context
