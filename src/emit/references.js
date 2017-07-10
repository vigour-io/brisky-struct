import { getFn, getData } from '../get'
import { root, path } from '../traversal'
import getApi from '../get/api'

const fn = (ref, t, val, stamp) => {
  const emitter = getData(ref)
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

const iterate = (refs, val, stamp, orig, roots) => {
  if (refs) {
    let i = refs.length
    while (i--) {
      let rRoot = root(refs[i], true)
      let rPath = path(refs[i], true)
      if (rRoot.key) rPath.shift()
      let fakeRef = getApi(root(orig, true), rPath)
      if (fakeRef._c && ~roots.indexOf(rRoot)) {
        fn(refs[i], fakeRef, val, stamp)
        let localRefs = refs[i].emitters &&
          refs[i].emitters.data &&
          refs[i].emitters.data.struct
        iterate(localRefs, val, stamp, orig, roots)
        context(refs[i], val, stamp, orig, roots)
      }
    }
  }
}

const context = (t, val, stamp, orig, roots) => {
  if (t.inherits) {
    if (!roots) {
      roots = [root(t.inherits, true)]
    } else {
      roots.push(root(t.inherits, true))
    }
    const contextRefs = t.inherits &&
      t.inherits.emitters &&
      t.inherits.emitters.data &&
      t.inherits.emitters.data.struct
    iterate(contextRefs, val, stamp, orig, roots)
    context(t.inherits, val, stamp, orig, roots)
  }
}

export default context
