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

const setContext = (t, c, level) => {
  while (t && level) {
    t._c = c
    t._cLevel = level
    level--
    t = t._p
  }
}

const removeContext = t => {
  while (t && t._c) {
    t._c = null
    t._cLevel = null
    t = t._p
  }
}

// Iterate over given references list
// and fire functions if conditions are met
const iterate = (refs, val, stamp, oRoot, fn, cb) => {
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
          let localRefs = refs[i].emitters &&
            refs[i].emitters.data &&
            refs[i].emitters.data.struct
          if (localRefs) {
            iterate(localRefs, val, stamp, oRoot, fn, cb)
          }
          break
        }
      }
      if (c !== void 0) {
        fn(c, val, stamp, void 0, void 0, oRoot, cb)
      }
    }
  }
}

// Fire subscriptions in context
// then clean the context
const fnSubscriptions = (t, val, stamp, c, level, oRoot, cb) => {
  setContext(t, c, level)
  subscription(t, stamp)
  removeContext(t)
  cb(t, stamp, oRoot)
}

const handleContextStruct = (t, stamp) => {
  // this is getting harder
}

// When there's no inherited references
// there can still be a reference to parents
const handleInheritedStruct = (t, stamp, oRoot) => {
  while (t.inherits) {
    if (!oRoot) {
      oRoot = realRoot(t)
    }
    const contextRefs =
      t.inherits.emitters &&
      t.inherits.emitters.data &&
      t.inherits.emitters.data.struct
    if (contextRefs) {
      iterate(contextRefs, void 0, stamp, oRoot, fnSubscriptions, handleInheritedStruct)
    }
    t = t.inherits
  }
}

// Fire emitters && subscriptions in context
// then clean the context
const fn = (t, val, stamp, c, level, oRoot, cb) => {
  setContext(t, c, level)
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
  removeContext(t)
  cb(t, val, stamp, oRoot)
}

// When there's no local references
// there can be still inherited references
// need to perf test this
const updateInheritedStruct = (t, val, stamp, oRoot) => {
  while (t.inherits) {
    if (!oRoot) {
      oRoot = realRoot(t)
    }
    const contextRefs =
      t.inherits.emitters &&
      t.inherits.emitters.data &&
      t.inherits.emitters.data.struct
    if (contextRefs) {
      iterate(contextRefs, val, stamp, oRoot, fn, updateInheritedStruct)
    }
    t = t.inherits
  }
}

export default { updateInheritedStruct, handleInheritedStruct, handleContextStruct }
