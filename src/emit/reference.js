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

const setC = (t, c, level) => {
  while (t && level) {
    t._c = c
    t._cLevel = level
    level--
    t = t._p
  }
}

const removeC = t => {
  while (t && t._c) {
    t._c = null
    t._cLevel = null
    t = t._p
  }
}

const setContext = (t, c, level, prev) => {
  if (t._c) {
    if (t._c !== c) {
      prev.c = t._c
      prev.level = t._cLevel
      removeC(t)
      setC(t, c, level)
    }
  } else {
    setC(t, c, level)
  }
}

const removeContext = (t, c, prev) => {
  if (prev.c) {
    if (prev.c !== c) {
      removeC(t)
      setC(t, prev.c, prev.level)
    }
  } else {
    removeC(t)
  }
}

const setTStamps = (t, level, stamp) => {
  while (t && level) {
    t.tStamp = stamp
    level--
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
          if (refs[i].__tStamp !== stamp) {
            refs[i].__tStamp = stamp
            let localRefs = refs[i].emitters &&
              refs[i].emitters.data &&
              refs[i].emitters.data.struct
            if (localRefs) {
              iterate(localRefs, val, stamp, oRoot, fn)
            }
            refs[i].__tStamp = null
          }
          break
        }
      }
      if (c !== void 0) {
        fn(c, val, stamp, void 0, void 0, oRoot)
      }
    }
  }
}

// Fire subscriptions in context
const fnSubscriptions = (t, val, stamp, c, level, oRoot, cb) => {
  if (c === void 0) {
    subscription(t, stamp)
  } else {
    setTStamps(t, level, stamp)
    subscription(c, stamp)
  }
  if (cb) {
    cb(t, stamp, oRoot)
  }
}

// When there's no inherited references
// there can still be a reference to parents
const handleInheritedStruct = (t, stamp, oRoot, first) => {
  if (t.__tStamp !== stamp) {
    t.__tStamp = stamp
    if (t.inherits) {
      const contextRefs =
        t.inherits.emitters &&
        t.inherits.emitters.data &&
        t.inherits.emitters.data.struct
      if (contextRefs) {
        iterate(contextRefs, void 0, stamp, oRoot, fnSubscriptions, handleInheritedStruct)
      }
      handleInheritedStruct(t.inherits, stamp, oRoot, false)
    }
    if (!first) {
      if (t._p) {
        handleInheritedStruct(t._p, stamp, oRoot, false)
      }
      if (first === false) {
        const localRefs = t.emitters &&
          t.emitters.data &&
          t.emitters.data.struct
        if (localRefs) {
          iterate(localRefs, void 0, stamp, oRoot, fnSubscriptions, handleInheritedStruct)
        }
      }
    }
    t.__tStamp = null
  }
}

// Fire emitters && subscriptions in context
// then clean the context
const fn = (t, val, stamp, c, level, oRoot, cb) => {
  const prev = {}
  setContext(t, c, level, prev)
  if (c === void 0 || level === 1) {
    subscription(t, stamp)
  } else {
    setTStamps(t, level, stamp)
    subscription(c, stamp)
  }
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
  removeContext(t, c, prev)
  if (cb) {
    cb(t, val, stamp, oRoot)
  }
}

// When there's no local references
// there can be still inherited references
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

export default { updateInheritedStruct, handleInheritedStruct }
