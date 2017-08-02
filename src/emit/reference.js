import { getFn, getData } from '../get'
import { realRoot, realRootPath } from '../traversal'
import subscription from './subscription'

// Lookup until root of master
// to find a given ancestor
const isAncestor = (t, r, pc) => ((t === r && pc) || (
  t.inherits && isAncestor(t.inherits, r, pc)
) || (
  t._p && isAncestor(t._p, r, pc + 1)
))

// Iterate over given references list
// and fire functions if conditions are met
const iterate = (refs, val, stamp, oRoot, cb, fn) => {
  var i = refs.length
  while (i--) {
    const rPath = []
    const rRoot = realRootPath(refs[i], rPath)
    const pc = isAncestor(oRoot.inherits, rRoot, 1)
    if (pc) {
      let c = oRoot
      let j = rPath.length - pc + 1
      let prev = c
      while (j--) {
        prev = c
        c = c[rPath[j]]
        if (c === void 0) {
          fn(refs[i], val, stamp, prev, j + 1, oRoot, cb)
          break
        }
      }
    }
  }
}

// Fire subscriptions in context
// then clean the context
const fnSubscriptions = (t, val, stamp, c, cLevel, oRoot, cb) => {
  t._c = c
  t._cLevel = cLevel
  subscription(t, stamp)
  t._c = null
  t._cLevel = null
  cb(t, stamp, oRoot)
}

// When there's no inherited references
// there can still be a reference to parents
const virtualSubscriptions = (t, stamp, oRoot, first) => {
  while (t && t.__tStamp !== stamp) {
    if (first) {
      first = false
    } else {
      t.__tStamp = stamp
      const contextRefs =
        t.inherits.emitters &&
        t.inherits.emitters.data &&
        t.inherits.emitters.data.struct
      if (contextRefs) {
        iterate(contextRefs, void 0, stamp, oRoot, virtualSubscriptions, fnSubscriptions)
      }
      let localRefs = t.emitters &&
        t.emitters.data &&
        t.emitters.data.struct
      if (localRefs) {
        iterate(localRefs, void 0, stamp, oRoot, virtualSubscriptions, fnSubscriptions)
      }
      t.__tStamp = null
    }
    t = t._p
  }
}

// Fire emitters && subscriptions in context
// then clean the context
const fn = (t, val, stamp, c, cLevel, oRoot, cb) => {
  t._c = c
  t._cLevel = cLevel
  subscription(t, stamp)
  const emitter = getData(t)
  if (emitter) {
    const listeners = getFn(emitter)
    if (listeners) {
      let i = listeners.length
      while (i--) {
        listeners[i](val, stamp, t)
      }
    } else {
      emitter.listeners = []
    }
  }
  t._c = null
  t._cLevel = null
  let localRefs = t.emitters &&
    t.emitters.data &&
    t.emitters.data.struct
  if (localRefs) {
    iterate(localRefs, val, stamp, oRoot, cb, fn)
  }
  cb(t, val, stamp, oRoot)
}

// When there's no local references
// there can be still inherited references
// need to perf test this
const virtualReferences = (t, val, stamp, oRoot) => {
  while (t.inherits) {
    if (!oRoot) {
      oRoot = realRoot(t)
    }
    const contextRefs =
      t.inherits.emitters &&
      t.inherits.emitters.data &&
      t.inherits.emitters.data.struct
    if (contextRefs) {
      iterate(contextRefs, val, stamp, oRoot, virtualReferences, fn)
    } else {
      virtualSubscriptions(t, stamp, oRoot, true)
    }
    t = t.inherits
  }
}

export default virtualReferences
